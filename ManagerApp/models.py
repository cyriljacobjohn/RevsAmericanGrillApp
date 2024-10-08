from django.db import models

# Create your models here.

class Inventory(models.Model):
    item_id = models.AutoField(primary_key=True)
    itemname = models.CharField(max_length=50)
    itemcount = models.IntegerField()
    itemfcount = models.IntegerField()
    itemcode = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'inventory'
    
class Menu(models.Model):
    food_id = models.AutoField(primary_key=True)
    menuitem = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    ingredients = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'menu'

class Lowinventory(models.Model):
    priority_id = models.AutoField(primary_key=True)
    item_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'lowinventory'

class Orderhistory(models.Model):
    order_id = models.AutoField(primary_key=True)
    time_stamp = models.DateTimeField()
    pricetotal = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'orderhistory'

class Orderdetails(models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.IntegerField(blank=True, null=True)
    food_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orderdetails'
    
class SimpleAccount(models.Model):
   email=models.EmailField(unique=True)
   password = models.CharField(max_length=150, default='')
   first_name = models.CharField(('First Name'),max_length=150)
   last_name = models.CharField(('last Name'),max_length=150)
   is_manager=models.BooleanField(default=False)
   is_server=models.BooleanField(default=False)
   is_active=models.BooleanField(default=True)
   is_auth=models.BooleanField(default=False)
   def __str__(self):
       return self.email