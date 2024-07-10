from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, RawMaterialViewSet, InventoryViewSet, CategoryViewSet, 
    StateViewSet, CityViewSet, WarehouseViewSet, SupplierViewSet, 
    OperationLogViewSet, RestockRequestViewSet, RawMaterialSupplierViewSet, 
    ProductRawMaterialListSet, InventoryTotalStockViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'raw-materials', RawMaterialViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'states', StateViewSet)
router.register(r'cities', CityViewSet)
router.register(r'warehouses', WarehouseViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'operation-logs', OperationLogViewSet)
router.register(r'restock-requests', RestockRequestViewSet)
router.register(r'raw-material-suppliers', RawMaterialSupplierViewSet)
router.register(r'product-raw-material-list', ProductRawMaterialListSet)
router.register(r'inventory-total-stock', InventoryTotalStockViewSet, basename='inventory-total-stock')

urlpatterns = [
    path('', include(router.urls)),
]
		