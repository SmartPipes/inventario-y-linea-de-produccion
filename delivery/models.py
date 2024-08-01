from django.db import models
from sales.models import Sale
from inventory.models import Product
from users.models import User

class ThirdPartyService(models.Model):
    service_id = models.AutoField(primary_key=True)
    service_name = models.CharField(max_length=50)
    contact_number = models.CharField(max_length=10)
    tracking_url = models.URLField(max_length=200)  # Changed to URLField for URL validation

    class Meta:
        db_table = 'del_third_party_services'
        verbose_name = 'Third Party Service'
        verbose_name_plural = 'Third Party Services'

    def __str__(self):
        return self.service_name

class DeliveryOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    delivery_order_id = models.AutoField(primary_key=True)
    delivery_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    delivery_address = models.CharField(max_length=255)
    notes = models.TextField(blank=True)  # Allow notes to be optional
    third_party_service = models.ForeignKey(ThirdPartyService, on_delete=models.SET_NULL, null=True, blank=False, related_name='delivery_orders')
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='delivery_orders')
    client = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='delivery_orders')

    class Meta:
        db_table = 'del_delivery_orders'
        verbose_name = 'Delivery Order'
        verbose_name_plural = 'Delivery Orders'

    def __str__(self):
        return f"Delivery Order {self.delivery_order_id} - {self.status}"

class DeliveryOrderDetail(models.Model):
    delivery_order_detail_id = models.AutoField(primary_key=True)
    quantity = models.PositiveIntegerField()
    delivery_order = models.ForeignKey(DeliveryOrder, on_delete=models.CASCADE, related_name='delivery_order_details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='delivery_order_details')

    class Meta:
        db_table = 'del_delivery_order_details'
        verbose_name = 'Delivery Order Detail'
        verbose_name_plural = 'Delivery Order Details'

    def __str__(self):
        return f"Detail {self.delivery_order_detail_id} for Delivery Order {self.delivery_order.delivery_order_id}"
