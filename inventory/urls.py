from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, RawMaterialViewSet, InventoryViewSet, CategoryViewSet, 
    StateViewSet, CityViewSet, WarehouseViewSet, SupplierViewSet, 
    OperationLogViewSet, RestockRequestViewSet, 
    ProductRawMaterialListSet, InventoryTotalStockViewSet, RestockRequestWarehouseView, RestockRequestWarehouseRawMaterialView, UserWarehouseAssignmentViewSet, UpdateInventoryView, BulkProductRawMaterialListView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'raw-materials', RawMaterialViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'states', StateViewSet)
router.register(r'city', CityViewSet)
router.register(r'warehouse', WarehouseViewSet)
router.register(r'supplier', SupplierViewSet)
router.register(r'operation-log', OperationLogViewSet)
router.register(r'restockrequest', RestockRequestViewSet)
router.register(r'product-raw-material-list', ProductRawMaterialListSet)
router.register(r'inventory-total-stock', InventoryTotalStockViewSet, basename='inventory-total-stock')
router.register(r'Restock-Request-Warehouse', RestockRequestWarehouseView)
router.register(r'Restock-Request-Warehouse-Rawm', RestockRequestWarehouseRawMaterialView)
router.register(r'user-warehouse-assignment', UserWarehouseAssignmentViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('update-inventory/', UpdateInventoryView.as_view(), name='update-inventory'),
    path('bulk-product-raw-material-list/', BulkProductRawMaterialListView.as_view(), name='bulk-product-raw-material-list'),

]
		