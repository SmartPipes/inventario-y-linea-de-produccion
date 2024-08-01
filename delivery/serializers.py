from rest_framework import serializers
from .models import ThirdPartyService, DeliveryOrder, DeliveryOrderDetail

class ThirdPartyServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThirdPartyService
        fields = '__all__'

class DeliveryOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryOrder
        fields = '__all__'

class DeliveryOrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryOrderDetail
        fields = '__all__'
