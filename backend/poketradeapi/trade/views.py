from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import models, transaction
from django.contrib.contenttypes.models import ContentType
from .serializers import TradeSerializer, ListingSerializer, TransactionSerializer
from market.models import Balance
from .models import Transaction, Listing, Trade
from pokemon.models import Pokemon
from pokemon.utils import fetch_pokeapi_data


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_trade_request(request):
    original_id = request.data.get("original")
    offer_id = request.data.get("offer")

    if not original_id or not offer_id:
        return Response(
            {"detail": "must have both original and offered pokemon"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Fetch both Pokémon objects
        original = Pokemon.objects.get(id=original_id)
        offer = Pokemon.objects.get(id=offer_id)

        # Get owners of each Pokémon
        owner = original.owner_user
        offerer = offer.owner_user

        # Make sure the request user is one of the parties (typically the offerer)
        if request.user != offerer:
            return Response(
                {"detail": "You must be the owner of the offered Pokémon."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Create trade
        trade = Trade.objects.create(
            owner=owner,
            offerer=offerer,
            original=original,
            offer=offer,
        )

        return Response(
            {"detail": "Trade created successfully.", "trade_id": trade.id},
            status=status.HTTP_201_CREATED,
        )

    except Pokemon.DoesNotExist:
        return Response(
            {"detail": "One or both Pokémon not found."},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_trades(request):
    user = request.user

    outbound = Trade.objects.filter(offerer=user, completed=False)
    inbound = Trade.objects.filter(owner=user, completed=False)

    outbound_serialized = TradeSerializer(outbound, many=True).data
    inbound_serialized = TradeSerializer(inbound, many=True).data

    for trade in outbound_serialized:
        offer = trade["offer"]
        original = trade["original"]

        offer_api_data = fetch_pokeapi_data(offer["poke_dex_id"])
        original_api_data = fetch_pokeapi_data(original["poke_dex_id"])

        offer["api_data"] = offer_api_data or {}
        original["api_data"] = original_api_data or {}

    for trade in inbound_serialized:
        offer = trade["offer"]
        original = trade["original"]

        offer_api_data = fetch_pokeapi_data(offer["poke_dex_id"])
        original_api_data = fetch_pokeapi_data(original["poke_dex_id"])

        offer["api_data"] = offer_api_data or {}
        original["api_data"] = original_api_data or {}

    return Response(
        {"outbound": outbound_serialized, "inbound": inbound_serialized},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_trade(request, trade_id):
    Trade.objects.filter(id=trade_id).delete()

    return Response(
        {"detail": "Trade deleted successfully"}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_trade(request, trade_id):
    user = request.user

    if not user.is_authenticated:
        return Response(
            {"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        trade = Trade.objects.select_related("owner", 'offerer', 'original', 'offer').get(
            id=trade_id
        )
    except Trade.DoesNotExist:
        return Response(
            {"detail": "Trade not found"}, status=status.HTTP_404_NOT_FOUND
        )
    
    if trade.owner != user:
        return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    if trade.completed:
        return Response(
            {"detail": "Trade already completed"}, status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():
        newTransaction = Transaction.objects.create(
            buyer=trade.offerer,
            seller=trade.owner,
            content_type=ContentType.objects.get_for_model(Trade),
            object_id=trade_id,
        )

        # Swap ownership
        original_owner = trade.owner
        offerer = trade.offerer

        trade.original.owner_user = offerer
        trade.offer.owner_user = original_owner

        trade.original.save()
        trade.offer.save()

        trade.completed = True
        trade.save()

        Listing.objects.filter(pokemon__in=[trade.original, trade.offer], completed=False).delete()
        Trade.objects.filter(completed=False).filter(
            models.Q(original__in=[trade.original, trade.offer]) |
            models.Q(offer__in=[trade.original, trade.offer])
        ).exclude(id=trade.id).delete()

    return Response(
        {"detail": "Listing purchased successfully"}, status=status.HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    transactions = Transaction.objects.filter(
        models.Q(buyer=request.user) | models.Q(seller=request.user)
    ).order_by("-created_at")

    serializer = TransactionSerializer(transactions, many=True)
    base_data = serializer.data

    search = request.GET.get("search", "").lower()

    enriched = []

    for transaction in base_data:
        type = transaction['type']
        if type == "trade":
            offer = transaction['info']["offer"]
            original = transaction['info']["original"]

            offer_api_data = fetch_pokeapi_data(offer["poke_dex_id"])
            original_api_data = fetch_pokeapi_data(original["poke_dex_id"])

            if search and (offer_api_data or original_api_data):
                if (offer_api_data and search not in offer_api_data["name"].lower()) and (original_api_data and search not in original_api_data["name"].lower()):
                    continue

            offer["api_data"] = offer_api_data or {}
            original["api_data"] = original_api_data or {}
            enriched.append(transaction)
        else:
            p = transaction["info"]["pokemon"]
            api_data = fetch_pokeapi_data(p["poke_dex_id"])
                
            if search and api_data:
                if search not in api_data["name"].lower():
                    continue
            p["api_data"] = api_data or {}
            enriched.append(transaction)

    return Response(enriched, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_listing(request):
    pokemon_id = request.data.get("pokemon")
    price = request.data.get("price")
    completed = False

    if not pokemon_id or price is None:
        return Response(
            {"detail": "pokemon_id and price are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    pokemon = Pokemon.objects.get(id=pokemon_id)

    listing = Listing.objects.create(pokemon=pokemon, price=price, completed=completed)

    return Response(
        data={"detail": "listing successfully created"}, status=status.HTTP_200_OK
    )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_listing(request, listing_id):
    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        return Response(
            {"detail": "Listing not found"}, status=status.HTTP_404_NOT_FOUND
        )

    price = request.data.get("price")
    completed = request.data.get("completed")

    if price is not None:
        listing.price = price

    if completed is not None:
        listing.completed = completed

    listing.save()

    return Response(
        {"detail": "Listing updated successfully"}, status=status.HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_listing(request, listing_id):
    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        return Response(
            {"detail": "Listing not found"}, status=status.HTTP_404_NOT_FOUND
        )

    listing.delete()

    return Response(
        {"detail": "Listing deleted successfully"}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_listings(request):
    user = request.user

    if not user.is_authenticated:
        return Response(
            {"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED
        )

    listings = Listing.objects.filter(completed=False)
    serializer = ListingSerializer(listings, many=True)

    base_data = serializer.data

    search = request.GET.get("search", "").lower()

    enriched = []
    myListings = []

    for listing in base_data:
        p = listing["pokemon"]
        api_data = fetch_pokeapi_data(p["poke_dex_id"])

        if p["owner_user"]["id"] == user.id:
            p["api_data"] = api_data or {}
            myListings.append(listing)
            continue

        if search and api_data:
            if search not in api_data["name"].lower():
                continue
        p["api_data"] = api_data or {}
        enriched.append(listing)

    return Response({"myListings": myListings, "listings": enriched})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_listing(request, listing_id):
    user = request.user

    if not user.is_authenticated:
        return Response(
            {"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED
        )

    listings = Listing.objects.filter(completed=False, id=listing_id)
    serializer = ListingSerializer(listings, many=True)

    base_data = serializer.data[0]

    pokemon = base_data["pokemon"]
    api_data = fetch_pokeapi_data(pokemon["poke_dex_id"])
    pokemon["api_data"] = api_data

    return Response(base_data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def purchase_listing(request, listing_id):
    user = request.user

    if not user.is_authenticated:
        return Response(
            {"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        listing = Listing.objects.select_related("pokemon__owner_user").get(
            pk=listing_id
        )
    except Listing.DoesNotExist:
        return Response(
            {"detail": "Listing not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if listing.completed:
        return Response(
            {"detail": "Listing already completed"}, status=status.HTTP_400_BAD_REQUEST
        )

    seller = listing.pokemon.owner_user
    buyer = user
    price = listing.price

    if buyer.balance.balance < price:
        return Response(
            {"detail": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST
        )

    if buyer == seller:
        return Response(
            {"detail": "Cannot buy own pokemon"}, status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():
        newTransaction = Transaction.objects.create(
            buyer=user,
            seller=listing.pokemon.owner_user,
            content_type=ContentType.objects.get_for_model(Listing),
            object_id=listing_id,
        )

        # Swap ownership
        pokemon = listing.pokemon
        pokemon.owner_user = buyer
        pokemon.save()

        # Update listing
        listing.completed = True
        listing.save()

        # Update balances
        buyer.balance.balance -= price
        seller.balance.balance += price
        buyer.balance.save()
        seller.balance.save()

        Listing.objects.filter(pokemon=pokemon, completed=False).delete()
        Trade.objects.filter(completed=False).filter(models.Q(original=pokemon) | models.Q(offer=pokemon)).delete()

    return Response(
        {"detail": "Listing purchased successfully"}, status=status.HTTP_200_OK
    )
