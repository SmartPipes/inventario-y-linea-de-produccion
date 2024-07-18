from django.db import models
from inventory.models import Product, Warehouse, State, RawMaterial
from users.models import User
from users.models import Division  # Si Division es necesario
from inventory.models import City

class Factory(models.Model):
    factory_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    phone = models.CharField(max_length=10, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')

    class Meta:
        db_table = 'pro_Factories'

    def __str__(self):
        return self.name

class Phase(models.Model):
    phase_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    after_phase = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='sub_phases')

    class Meta:
        db_table = 'pro_Phases'

    def __str__(self):
        return self.name

class ProductionLine(models.Model):
    productionLine_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)
    production_line_creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_production_lines')
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, null=True,blank=False)
    state = models.CharField(max_length=20, choices=[('In Use','IN USE'),('Free','FREE')], default='Free')
                                  
    class Meta:
        db_table = 'pro_ProductionLines'

    def __str__(self):
        return self.name

class ProductionPhase(models.Model):
    productionLine = models.ForeignKey(ProductionLine, on_delete=models.CASCADE)
    phase = models.ForeignKey(Phase, on_delete=models.CASCADE)
    sequence_number = models.PositiveSmallIntegerField()

    class Meta:
        db_table = 'pro_production_phases'
        unique_together = (('productionLine', 'phase'),)

class ProductionOrder(models.Model):
    production_order_id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Completed', 'Completed')])
    warehouse_to_deliver = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='deliver_orders')
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    pl_assigned = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, null=True, default=None)

    class Meta:
        db_table = 'pro_ProductionOrders'

class ProductionOrderDetail(models.Model):
    production_order = models.ForeignKey(ProductionOrder, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_quantity = models.PositiveSmallIntegerField()

    class Meta:
        db_table = 'pro_ProductionOrdersDetails'
        unique_together = (('production_order', 'product'),)

class ProductionOrderPhase(models.Model):
    production_order = models.ForeignKey(ProductionOrder, on_delete=models.CASCADE)
    phase = models.ForeignKey(Phase, on_delete=models.CASCADE)
    entry_phase_date = models.DateTimeField(auto_now_add=True)
    exit_phase_date = models.DateTimeField(null=True, default=None)

    class Meta:
        db_table = 'pro_ProductionOrders-Phases'
        unique_together = (('production_order', 'phase'),)

class FactoryManager(models.Model):
    factory_manager_id = models.AutoField(primary_key=True)
    entry_date = models.DateField()
    departure_date = models.DateField(null=True, blank=True)
    factory = models.ForeignKey(Factory, on_delete=models.CASCADE)
    manager = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'pro_FactoryManagers'
        unique_together = (('factory', 'manager'),)
        
class ProductionOrderWarehouseRetrievalDetail(models.Model):
    production_order = models.ForeignKey(ProductionOrder, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    raw_material = models.ForeignKey(RawMaterial, on_delete=models.CASCADE)
    qty = models.PositiveIntegerField()

    class Meta:
        db_table = 'pro_production_orders_warehouses_retrieveal_detail'
        unique_together = (('production_order', 'warehouse', 'raw_material'),)
    