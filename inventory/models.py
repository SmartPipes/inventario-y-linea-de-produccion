from django.db import models

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'inv_category'

class Product(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_icon = models.CharField(max_length=150, blank=True, null=True)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'inv_product'

class ProductImage(models.Model):
    image_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=200)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'inv_productimage'

class AttachedFile(models.Model):
    file_id = models.AutoField(primary_key=True)
    file_path = models.CharField(max_length=100)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user_uploader = models.IntegerField()

    def __str__(self):
        return self.file_path

    class Meta:
        db_table = 'inv_attachedfile'

class Supplier(models.Model):
    RATING_CHOICES = [
        ('Excellent', 'Excellent'),
        ('Good', 'Good'),
        ('Fair', 'Fair'),
        ('Poor', 'Poor'),
    ]

    supplier_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=80)
    RFC = models.CharField(max_length=13)
    email = models.CharField(max_length=120)
    phone = models.CharField(max_length=10, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    rating = models.CharField(max_length=9, choices=RATING_CHOICES)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'inv_supplier'

class ProductSupplier(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = (('product', 'supplier'),)
        db_table = 'inv_productsupplier'

class Warehouse(models.Model):
    warehouse_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    phone = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'inv_warehouse'

class Inventory(models.Model):
    ITEM_TYPE_CHOICES = [
        ('Product', 'Product'),
        ('RawMaterial', 'RawMaterial'),
    ]

    item_id = models.AutoField(primary_key=True)
    item_type = models.CharField(max_length=12, choices=ITEM_TYPE_CHOICES)
    item_id_in_type = models.IntegerField()
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    stock = models.IntegerField()

    def __str__(self):
        return f'{self.item_type} {self.item_id_in_type} in {self.warehouse}'

    class Meta:
        db_table = 'inv_inventory'

class RestockRequest(models.Model):
    REQUEST_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    request_id = models.AutoField(primary_key=True)
    quantity = models.IntegerField()
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=REQUEST_STATUS_CHOICES)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    requested_by = models.IntegerField()

    def __str__(self):
        return f'Request {self.request_id} for {self.product}'

    class Meta:
        db_table = 'inv_restockrequest'

class OperationsLog(models.Model):
    operation_id = models.AutoField(primary_key=True)
    quantity = models.SmallIntegerField()
    datetime = models.DateTimeField(auto_now_add=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    OpLogUser = models.IntegerField()
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)

    def __str__(self):
        return f'Operation {self.operation_id} for {self.product}'

    class Meta:
        db_table = 'inv_operationlog'

class UserWarehouseAssignment(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    assigned_date = models.DateField()
    removed_date = models.DateField(blank=True, null=True)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    manager_user = models.IntegerField()

    def __str__(self):
        return f'Assignment {self.assignment_id} in {self.warehouse}'

    class Meta:
        db_table = 'inv_userwarehouseassignment'

class RawMaterial(models.Model):
    rawMaterial_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    image_icon = models.CharField(max_length=150, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'inv_rawmaterial'
