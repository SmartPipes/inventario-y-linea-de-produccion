from django.db import models
from users.models import User  # Ensure the 'users' app is installed
from inventory.models import Product  # Ensure the 'inventory' app is installed

class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    cart_date = models.DateTimeField(auto_now_add=True)
    client_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='carts')

    class Meta:
        db_table = 'sal_carts'
    
    def __str__(self):
        return f"Cart {self.cart_id}"

class Sale(models.Model):
    sale_id = models.AutoField(primary_key=True)
    sale_date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    client_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='sales')

    class Meta:
        db_table = 'sal_sales'

    def __str__(self):
        return f"Sale {self.sale_id} - {self.total}"

class Payment(models.Model):
    PAYMENT_CHOICES = [
        ('Debito', 'Debit'),
        ('Credito', 'Credit'),
        ('PayPal', 'PayPal'),
    ]
    
    payment_id = models.AutoField(primary_key=True)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_CHOICES)
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100)
    sale_id = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='payments')

    class Meta:
        db_table = 'sal_payments'

    def __str__(self):
        return f"Payment {self.payment_id} - {self.payment_method}"

class CartDetail(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_details')
    quantity = models.PositiveIntegerField()

    class Meta:
        db_table = 'sal_cart_details'
        unique_together = (('cart', 'product'),)

    def __str__(self):
        return f"Cart {self.cart.cart_id} - Product {self.product.name}"

class SaleDetail(models.Model):
    sale_detail_id = models.AutoField(primary_key=True)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='sale_details')
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # The price of the item at the time of purchase
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sale_details')

    class Meta:
        db_table = 'sal_sale_details'

    def __str__(self):
        return f"Sale {self.sale.sale_id} - Product {self.product.name}"
