from rest_framework import serializers
from .models import Cart, Payment, Sale, CartDetail, SaleDetail

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class CartDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartDetail
        fields = '__all__'

class SaleDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleDetail
        fields = '__all__'

class BulkSaleDetailSerializer(serializers.ListSerializer):
    child = SaleDetailSerializer()

    def create(self, validated_data):
        sale_details = [SaleDetail(**item) for item in validated_data]
        return SaleDetail.objects.bulk_create(sale_details)
