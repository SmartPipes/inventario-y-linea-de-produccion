from django.db import models
from sales.models import Sale
from inventory.models import Product
from users.models import User

class DeliveryTeam(models.Model):
    delivery_team_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='delivery_teams')

    class Meta:
        db_table = 'del_DeliveryTeams'

    def __str__(self):
        return self.name

class DeliveryOrder(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Transit', 'In Transit'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    delivery_order_id = models.AutoField(primary_key=True)
    delivery_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    delivery_address = models.CharField(max_length=255)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='delivery_orders')
    delivery_team = models.ForeignKey(DeliveryTeam, on_delete=models.SET_NULL, null=True, blank=True, related_name='delivery_orders')

    class Meta:
        db_table = 'del_DeliveryOrders'

    def __str__(self):
        return f"Delivery Order {self.delivery_order_id} - {self.status}"

class DeliveryOrderDetail(models.Model):
    delivery_order_detail_id = models.AutoField(primary_key=True)
    quantity = models.PositiveIntegerField()
    delivery_order = models.ForeignKey(DeliveryOrder, on_delete=models.CASCADE, related_name='delivery_order_details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='delivery_order_details')

    class Meta:
        db_table = 'del_DeliveryOrdersDetails'

    def __str__(self):
        return f"Detail {self.delivery_order_detail_id} for Delivery Order {self.delivery_order.delivery_order_id}"
