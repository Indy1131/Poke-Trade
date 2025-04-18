from django.contrib import admin
from .models import Trade, Purchase, Transaction

admin.site.register(Trade)
admin.site.register(Purchase)
admin.site.register(Transaction)

# Register your models here.
