from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ThirdPartyServiceViewSet, DeliveryOrderViewSet, DeliveryOrderDetailViewSet

router = DefaultRouter()
router.register(r'third-party-service', ThirdPartyServiceViewSet)
router.register(r'delivery-orders', DeliveryOrderViewSet)
router.register(r'delivery-order-details', DeliveryOrderDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
