from django.contrib import admin
from .models import Trade, Transaction, Listing, Pokemon

admin.site.register(Trade)
admin.site.register(Transaction)
admin.site.register(Listing)
admin.site.register(Pokemon)

# Register your models here.
