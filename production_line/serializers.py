from rest_framework import serializers
from .models import Factory, Phase, ProductionLine, ProductionPhase, ProductionOrder, ProductionOrderDetail, ProductionOrderPhase, FactoryManager

class FactorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Factory
        fields = '__all__'

class PhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phase
        fields = '__all__'

class ProductionLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionLine
        fields = '__all__'

class ProductionPhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionPhase
        fields = '__all__'

class ProductionOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionOrder
        fields = '__all__'

class ProductionOrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionOrderDetail
        fields = '__all__'

class ProductionOrderPhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionOrderPhase
        fields = '__all__'

class FactoryManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FactoryManager
        fields = '__all__'
