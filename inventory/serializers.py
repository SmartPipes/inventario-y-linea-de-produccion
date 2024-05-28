from rest_framework import serializers
from .models import Product, RawMaterial, Inventory

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    item_description = serializers.SerializerMethodField()
    item_price = serializers.SerializerMethodField()
    price_type = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = ['inventory_id', 'item_id', 'item_type', 'warehouse', 'stock', 'item_name', 'item_description', 'item_price', 'price_type']

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
            supplier = raw_material.rawmaterialsupplier_set.first()  # Assuming one supplier for simplicity
            return supplier.purchase_price if supplier else None
        return None

    def get_price_type(self, obj):
        if obj.item_type == 'Product':
            return 'sale_price'
        elif obj.item_type == 'RawMaterial':
            return 'purchase_price'
        return None
