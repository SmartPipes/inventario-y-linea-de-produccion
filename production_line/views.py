from rest_framework import viewsets,mixins,status
from django.db.models import Sum
from .models import Factory, Phase, ProductionLine, ProductionPhase, ProductionOrder, ProductionOrderDetail, ProductionOrderPhase, FactoryManager, ProductionOrderWarehouseRetrievalDetail
from .serializers import FactorySerializer, PhaseSerializer, ProductionLineSerializer, ProductionPhaseSerializer, ProductionOrderSerializer, ProductionOrderDetailSerializer, ProductionOrderPhaseSerializer, FactoryManagerSerializer, ProductionOrderWarehouseRetrievalDetailSerializer

class FactoryViewSet(viewsets.ModelViewSet):
    queryset = Factory.objects.all()
    serializer_class = FactorySerializer

class PhaseViewSet(viewsets.ModelViewSet):
    queryset = Phase.objects.all()
    serializer_class = PhaseSerializer

class ProductionLineViewSet(viewsets.ModelViewSet):
    queryset = ProductionLine.objects.all()
    serializer_class = ProductionLineSerializer

class ProductionPhaseViewSet(viewsets.ModelViewSet):
    queryset = ProductionPhase.objects.all()
    serializer_class = ProductionPhaseSerializer

class ProductionOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.all()
    serializer_class = ProductionOrderSerializer

class ProductionOrderDetailViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrderDetail.objects.all()
    serializer_class = ProductionOrderDetailSerializer

class ProductionOrderPhaseViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrderPhase.objects.all()
    serializer_class = ProductionOrderPhaseSerializer

class FactoryManagerViewSet(viewsets.ModelViewSet):
    queryset = FactoryManager.objects.all()
    serializer_class = FactoryManagerSerializer

class ProductionOrderWarehouseRetrievalDetailViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrderWarehouseRetrievalDetail.objects.all()
    serializer_class = ProductionOrderWarehouseRetrievalDetailSerializer

