from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, RawMaterialViewSet, InventoryViewSet, CategoryViewSet, StateViewSet, CityViewSet, WarehouseViewSet, SupplierViewSet, OperationLogViewSet, RestockRequestViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'raw-materials', RawMaterialViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'state', StateViewSet)
router.register(r'city', CityViewSet)
router.register(r'warehouse', WarehouseViewSet)
router.register(r'supplier', SupplierViewSet)
router.register(r'operation_log', OperationLogViewSet)
router.register(r'restockrequest', RestockRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
