from rest_framework import serializers
from .models import DeliveryTeam, DeliveryOrder, DeliveryOrderDetail

class DeliveryTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryTeam
        fields = '__all__'

class DeliveryOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryOrder
        fields = '__all__'

class DeliveryOrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryOrderDetail
        fields = '__all__'
