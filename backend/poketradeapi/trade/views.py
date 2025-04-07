from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import TradeRequest, Trade, TradeDetail
from pokemon.models import Pokemon  # Import the Pokémon model

@login_required
def send_trade_request(request, receiver_id, offered_pokemon_id, requested_pokemon_id):
    receiver = get_object_or_404(settings.AUTH_USER_MODEL, id=receiver_id)
    offered_pokemon = get_object_or_404(Pokemon, id=offered_pokemon_id, owner=request.user)
    requested_pokemon = get_object_or_404(Pokemon, id=requested_pokemon_id, owner=receiver)

    trade_request = TradeRequest.objects.create(sender=request.user, receiver=receiver)
    TradeDetail.objects.create(trade_request=trade_request, offered_pokemon=offered_pokemon, requested_pokemon=requested_pokemon)

    return redirect('trade_list')

@login_required
def accept_trade(request, trade_request_id):
    trade_request = get_object_or_404(TradeRequest, id=trade_request_id, receiver=request.user)

    if trade_request.status != "Pending":
        return redirect('trade_list')

    trade_request.status = "Accepted"
    trade_request.save()

    trade = Trade.objects.create(initiator=trade_request.sender, recipient=trade_request.receiver)

    for trade_detail in trade_request.trade_details.all():
        offered_pokemon = trade_detail.offered_pokemon
        requested_pokemon = trade_detail.requested_pokemon

        # Swap Pokémon ownership
        offered_pokemon.owner, requested_pokemon.owner = requested_pokemon.owner, offered_pokemon.owner
        offered_pokemon.save()
        requested_pokemon.save()

    return redirect('trade_list')
