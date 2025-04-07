from django.contrib import admin
from .models import TradeRequest, TradeDetail, Trade

admin.site.register(TradeRequest)
admin.site.register(TradeDetail)
admin.site.register(Trade)
# Register your models here.
