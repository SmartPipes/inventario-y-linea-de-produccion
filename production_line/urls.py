from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FactoryViewSet, PhaseViewSet, ProductionLineViewSet, ProductionPhaseViewSet, ProductionOrderViewSet, ProductionOrderDetailViewSet, ProductionOrderPhaseViewSet, FactoryManagerViewSet

router = DefaultRouter()
router.register(r'factories', FactoryViewSet)
router.register(r'phases', PhaseViewSet)
router.register(r'production-lines', ProductionLineViewSet)
router.register(r'production-phases', ProductionPhaseViewSet)
router.register(r'production-orders', ProductionOrderViewSet)
router.register(r'production-order-details', ProductionOrderDetailViewSet)
router.register(r'production-order-phases', ProductionOrderPhaseViewSet)
router.register(r'factory-managers', FactoryManagerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
