from django.db import models
from users.models import User

class State(models.Model):
    state_id = models.AutoField(primary_key=True)
    state_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'inv_state'

    def __str__(self):
        return self.state_name

class City(models.Model):
    city_id = models.AutoField(primary_key=True)
    city_name = models.CharField(max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='inventory_cities')

    class Meta:
        db_table = 'inv_city'

    def __str__(self):
        return self.city_name

class Warehouse(models.Model):
    warehouse_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    phone = models.CharField(max_length=10, blank=True)
    status = models.CharField(max_length=8, choices=[('Active', 'Active'), ('Inactive', 'Inactive')])
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    class Meta:
        db_table = 'inv_warehouse'

    def __str__(self):
        return self.name

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'inv_category'

    def __str__(self):
        return self.name

class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=80)
    RFC = models.CharField(max_length=13)
    email = models.EmailField(max_length=120, blank=True)
    phone = models.CharField(max_length=10, blank=True)
    address = models.CharField(max_length=200, blank=True)
    rating = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('E', 'E')])

    class Meta:
        db_table = 'inv_supplier'

    def __str__(self):
        return self.name

class RawMaterial(models.Model):
    raw_material_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    image_icon = models.ImageField(upload_to='product_icons/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True, blank=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'inv_raw_material'

    def __str__(self):
        return self.name

class Product(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES)
    image_icon = models.ImageField(upload_to='product_icons/', blank=True, null=True)

    class Meta:
        db_table = 'inv_product'

    def __str__(self):
        return self.name

class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    item_id = models.IntegerField()
    item_type = models.CharField(max_length=12, choices=[('Product', 'Product'), ('RawMaterial', 'RawMaterial')])
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    stock = models.IntegerField()

    class Meta:
        db_table = 'inv_inventory'
        unique_together = (('item_id', 'item_type', 'warehouse'),)

    @property
    def product(self):
        if self.item_type == 'Product':
            return Product.objects.get(pk=self.item_id)
        return None

    @property
    def raw_material(self):
        if self.item_type == 'RawMaterial':
            return RawMaterial.objects.get(pk=self.item_id)
        return None

class OperationLog(models.Model):
    TYPE_OPERATION_CHOICES = [('Add', 'Add'), ('Remove', 'Remove')]
    operation_log_id = models.AutoField(primary_key=True)
    quantity = models.SmallIntegerField()
    datetime = models.DateTimeField(auto_now_add=True)
    type_operation = models.CharField(max_length=6, choices=TYPE_OPERATION_CHOICES)
    inventory_item = models.ForeignKey(Inventory, on_delete=models.CASCADE)  # Nueva relación con Inventory
    op_log_user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relacionada con la tabla User
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)

    class Meta:
        db_table = 'inv_operation_log'

class UserWarehouseAssignment(models.Model):
    user_warehouse_assignment_id = models.AutoField(primary_key=True)
    assigned_date = models.DateField()
    removed_date = models.DateField(null=True, blank=True)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    manager_user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relacionada con la tabla User

    class Meta:
        db_table = 'inv_user_warehouse_assignment'

class ProductImage(models.Model):
    product_image_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        db_table = 'inv_product_image'

class AttachedFile(models.Model):
    attached_file_id = models.AutoField(primary_key=True)
    file_path = models.CharField(max_length=100)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user_uploader = models.ForeignKey(User, on_delete=models.CASCADE)  # Relacionada con la tabla User

    class Meta:
        db_table = 'inv_attached_file'

class ProductRawMaterialList(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    raw_material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    quantity = models.SmallIntegerField()

    class Meta:
        db_table = 'inv_product_raw_material_list'
        unique_together = (('product', 'raw_material'),)


class RestockRequest(models.Model):
    restock_request_id = models.AutoField(primary_key=True)
    quantity = models.IntegerField()
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=9, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')])
    raw_material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)  # Relacionada con la tabla User
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)

    class Meta:
        db_table = 'inv_restock_request'

class RestockRequestWarehouse(models.Model):
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=15, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected'), ('In Progress', 'In Progress')], default='Pending')
    from_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='restock_request_warehouse1')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    to_factory = models.ForeignKey('production_line.Factory', on_delete=models.CASCADE, related_name='restock_request_Factory')
    production_order_id = models.ForeignKey('production_line.ProductionOrder',on_delete=models.CASCADE, related_name='restock_request_PO')

    class Meta:
        db_table = 'inv_restock_request_warehouse'



class RestockRequestWarehouseRawMaterial(models.Model):
    restock_request_warehouse = models.ForeignKey(RestockRequestWarehouse, on_delete=models.CASCADE)
    raw_material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    class Meta:
        db_table = 'inv_restock_request_warehouse_raw_material'
        unique_together = (('restock_request_warehouse', 'raw_material'),)
