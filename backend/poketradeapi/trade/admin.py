from django.contrib import admin
from .models import Trade, Transaction, Listing, Pokemon

admin.site.register(Trade)
admin.site.register(Listing)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    search_fields =['buyer__username','seller__username']

@admin.register(Pokemon)
class PokemonAdmin(admin.ModelAdmin):
    search_fields =['owner_user__username']

# Register your models here.
