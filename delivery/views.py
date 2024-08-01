from rest_framework import viewsets
from .models import ThirdPartyService, DeliveryOrder, DeliveryOrderDetail
from .serializers import ThirdPartyServiceSerializer, DeliveryOrderSerializer, DeliveryOrderDetailSerializer

class ThirdPartyServiceViewSet(viewsets.ModelViewSet):
    queryset = ThirdPartyService.objects.all()
    serializer_class = ThirdPartyServiceSerializer

class DeliveryOrderViewSet(viewsets.ModelViewSet):
    queryset = DeliveryOrder.objects.all()
    serializer_class = DeliveryOrderSerializer

class DeliveryOrderDetailViewSet(viewsets.ModelViewSet):
    queryset = DeliveryOrderDetail.objects.all()
    serializer_class = DeliveryOrderDetailSerializer
