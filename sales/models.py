from django.db import models
from users.models import User  # Asegúrate de que la aplicación 'users' esté instalada
from inventory.models import Product  # Asegúrate de que la aplicación 'inventory' esté instalada

class Cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    cart_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')])
    sale = models.ForeignKey('Sale', on_delete=models.SET_NULL, null=True, blank=True, related_name='carts')

    class Meta:
        db_table = 'sal_Carts'

    def __str__(self):
        return f"Cart {self.cart_id} - {self.status}"

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    payment_method = models.CharField(max_length=50)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='payments')

    class Meta:
        db_table = 'sal_Payments'

    def __str__(self):
        return f"Payment {self.payment_id} - {self.payment_method}"

class Sale(models.Model):
    sale_id = models.AutoField(primary_key=True)
    sale_date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales')

    class Meta:
        db_table = 'sal_Sales'

    def __str__(self):
        return f"Sale {self.sale_id} - {self.total}"

class CartDetail(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_details')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='cart_details')
    quantity = models.PositiveIntegerField()

    class Meta:
        db_table = 'sal_CartDetails'
        unique_together = (('cart', 'product'),)

    def __str__(self):
        return f"Cart {self.cart.cart_id} - Product {self.product.name}"

class SaleDetail(models.Model):
    sale_detail_id = models.AutoField(primary_key=True)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='sale_details')
    quantity = models.PositiveIntegerField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sale_details')

    class Meta:
        db_table = 'sal_SalesDetails'

    def __str__(self):
        return f"Sale {self.sale.sale_id} - Product {self.product.name}"

class Invoice(models.Model):
    invoice_id = models.AutoField(primary_key=True)
    invoice_date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    sale_detail = models.ForeignKey(SaleDetail, on_delete=models.CASCADE, related_name='invoices')

    class Meta:
        db_table = 'sal_Invoices'

    def __str__(self):
        return f"Invoice {self.invoice_id} - {self.total}"
