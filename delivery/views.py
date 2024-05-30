from rest_framework import viewsets
from .models import DeliveryTeam, DeliveryOrder, DeliveryOrderDetail
from .serializers import DeliveryTeamSerializer, DeliveryOrderSerializer, DeliveryOrderDetailSerializer

class DeliveryTeamViewSet(viewsets.ModelViewSet):
    queryset = DeliveryTeam.objects.all()
    serializer_class = DeliveryTeamSerializer

class DeliveryOrderViewSet(viewsets.ModelViewSet):
    queryset = DeliveryOrder.objects.all()
    serializer_class = DeliveryOrderSerializer

class DeliveryOrderDetailViewSet(viewsets.ModelViewSet):
    queryset = DeliveryOrderDetail.objects.all()
    serializer_class = DeliveryOrderDetailSerializer
