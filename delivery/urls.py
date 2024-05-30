from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeliveryTeamViewSet, DeliveryOrderViewSet, DeliveryOrderDetailViewSet

router = DefaultRouter()
router.register(r'delivery-teams', DeliveryTeamViewSet)
router.register(r'delivery-orders', DeliveryOrderViewSet)
router.register(r'delivery-order-details', DeliveryOrderDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
