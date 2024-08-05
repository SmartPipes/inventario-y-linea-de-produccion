from rest_framework import serializers
from .models import Product, RawMaterial, Inventory, Category, State, City, Warehouse, Supplier, OperationLog, RestockRequest, ProductRawMaterialList, RestockRequestWarehouse, RestockRequestWarehouseRawMaterial, UserWarehouseAssignment
from datetime import datetime

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class OperationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationLog
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'datetime' in representation:
            representation['datetime'] = self.format_datetime(representation['datetime'])
        return representation

    def format_datetime(self, value):
        dt = datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%fZ')
        return dt.strftime('%Y-%m-%d %H:%M')

class RestockRequestSerializer(serializers.ModelSerializer):
    inventory_id = serializers.SerializerMethodField()

    class Meta:
        model = RestockRequest
        fields = '__all__'

    def get_inventory_id(self, obj):
        try:
            inventory = Inventory.objects.get(item_id=obj.raw_material.raw_material_id, item_type='RawMaterial', warehouse=obj.warehouse.warehouse_id)
            return inventory.inventory_id
        except Inventory.DoesNotExist:
            return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'requested_at' in representation:
            representation['requested_at'] = self.format_datetime(representation['requested_at'])
        return representation

    def format_datetime(self, value):
        dt = datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%fZ')
        return dt.strftime('%Y-%m-%d %H:%M')

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = ['raw_material_id', 'name', 'description', 'image_icon', 'purchase_price', 'category', 'supplier']
        
class InventorySerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    item_description = serializers.SerializerMethodField()
    item_price = serializers.SerializerMethodField()
    price_type = serializers.SerializerMethodField()
    warehouse_name = serializers.SerializerMethodField()
    image_icon = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = ['inventory_id', 'item_id', 'item_type', 'warehouse', 'stock', 'item_name', 'item_description', 'item_price', 'price_type', 'warehouse_name', 'image_icon']

    def get_item_name(self, obj):
        if obj.item_type == 'Product':
            product = Product.objects.get(pk=obj.item_id)
            return product.name
        elif obj.item_type == 'RawMaterial':
            raw_material = RawMaterial.objects.get(pk=obj.item_id)
            return raw_material.name
        return None

    def get_item_description(self, obj):
        if obj.item_type == 'Product':
            product = Product.objects.get(pk=obj.item_id)
            return product.description
        elif obj.item_type == 'RawMaterial':
            raw_material = RawMaterial.objects.get(pk=obj.item_id)
            return raw_material.description
        return None

    def get_item_price(self, obj):
        if obj.item_type == 'Product':
            product = Product.objects.get(pk=obj.item_id)
            return product.price
        elif obj.item_type == 'RawMaterial':
            raw_material = RawMaterial.objects.get(pk=obj.item_id)
            return raw_material.purchase_price
        return None

    def get_price_type(self, obj):
        if obj.item_type == 'Product':
            return 'sale_price'
        elif obj.item_type == 'RawMaterial':
            return 'purchase_price'
        return None

    def get_warehouse_name(self, obj):
        return obj.warehouse.name

    def get_image_icon(self, obj):
        request = self.context.get('request')
        if obj.item_type == 'Product':
            product = Product.objects.get(pk=obj.item_id)
            if product.image_icon:
                return request.build_absolute_uri(product.image_icon.url)
        elif obj.item_type == 'RawMaterial':
            raw_material = RawMaterial.objects.get(pk=obj.item_id)
            if raw_material.image_icon:
                return request.build_absolute_uri(raw_material.image_icon.url)
        return None

class InventoryTotalStockSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    item_type = serializers.CharField(max_length=12)
    total_stock = serializers.IntegerField()
    
class RestockRequestWarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestockRequestWarehouse
        fields = '__all__'
        
class RestockRequestWarehouseRawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestockRequestWarehouseRawMaterial
        fields = '__all__'
        
class UserWarehouseAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWarehouseAssignment
        fields = '__all__'    
        
class UpdateInventorySerializer(serializers.Serializer):
    inventory_id = serializers.IntegerField(required=False, allow_null=True)
    item_id = serializers.IntegerField(required=True)
    item_type = serializers.CharField(max_length=12, required=True)
    warehouse_id = serializers.IntegerField(required=True)
    stock = serializers.IntegerField(required=True)
    user_id = serializers.IntegerField(required=True)
    datetime = serializers.DateTimeField()  # Asegúrate de tener el campo datetime

    def update_or_create_inventory(self):
        inventory_id = self.validated_data.get('inventory_id')
        item_id = self.validated_data['item_id']
        item_type = self.validated_data['item_type']
        warehouse_id = self.validated_data['warehouse_id']
        quantity = self.validated_data['stock']
        user_id = self.validated_data['user_id']
        datetime = self.validated_data['datetime']  # Obtener la fecha y hora

        if inventory_id:
            try:
                inventory = Inventory.objects.get(pk=inventory_id)
                initial_stock = inventory.stock
                inventory.stock += quantity
                inventory.save()

                # Crear un registro en OperationLog
                OperationLog.objects.create(
                    quantity=quantity,
                    type_operation='Add' if quantity > 0 else 'Remove',
                    inventory_item=inventory,
                    op_log_user_id=user_id,
                    warehouse_id=warehouse_id,
                    datetime=datetime  # Usar la fecha y hora recibida
                )
                return inventory
            except Inventory.DoesNotExist:
                pass

        # Si no se encontró el inventario o no se proporcionó, creamos uno nuevo
        inventory, created = Inventory.objects.update_or_create(
            item_id=item_id,
            item_type=item_type,
            warehouse_id=warehouse_id,
            defaults={'stock': quantity}
        )
        if not created:
            initial_stock = inventory.stock
            inventory.stock += quantity
            inventory.save()

        # Crear un registro en OperationLog
        OperationLog.objects.create(
            quantity=quantity,
            type_operation='Add' if quantity > 0 else 'Remove',
            inventory_item=inventory,
            op_log_user_id=user_id,
            warehouse_id=warehouse_id,
            datetime=datetime  # Usar la fecha y hora recibida
        )

        return inventory


            
class ProductRawMaterialListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductRawMaterialList
        fields = '__all__'

class BulkProductRawMaterialListSerializer(serializers.ListSerializer):
    child = ProductRawMaterialListSerializer()

    def create(self, validated_data):
        material_list = [ProductRawMaterialList(**item) for item in validated_data]
        return ProductRawMaterialList.objects.bulk_create(material_list)
            
