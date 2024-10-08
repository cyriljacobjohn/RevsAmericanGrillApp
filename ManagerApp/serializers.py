from rest_framework import serializers
from ManagerApp.models import Inventory, Menu, Lowinventory, SimpleAccount

class inventorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Inventory
        fields=('item_id', 'itemname', 'itemcount', 'itemfcount', 'itemcode')

class menuSerializer(serializers.ModelSerializer):
    class Meta:
        model=Menu
        fields=('food_id', 'menuitem', 'price', 'ingredients')

class lowInvSerializer(serializers.ModelSerializer):
    class Meta:
        model=Lowinventory
        fields=('priority_id', 'item_id')

class comboItemSerializer(serializers.Serializer):
    combo=serializers.CharField(max_length=200)
    count=serializers.IntegerField(max_value=1000)

class salesItemSerializer(serializers.Serializer):
    menuItem=serializers.CharField(max_length=200)
    amountSold=serializers.IntegerField(max_value=1000)
    totalRevenue=serializers.FloatField(max_value=10000.0)

class inventoryItemSerializer(serializers.Serializer):
    item=serializers.CharField(max_length=3)
    amountSold=serializers.IntegerField(max_value=1000)

class lowItemSerializer(serializers.Serializer):
    item=serializers.CharField(max_length=200)
    level=serializers.IntegerField(max_value=1000)

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=SimpleAccount
        fields=('email','password','first_name','last_name','is_manager','is_server','is_active','is_auth')