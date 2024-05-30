from rest_framework import viewsets
from .models import Product, RawMaterial, Inventory, Category, State, City, Warehouse, Supplier, OperationLog, RestockRequest
from .serializers import ProductSerializer, RawMaterialSerializer, InventorySerializer, CategorySerializer, StateSerializer, CitySerializer, WarehouseSerializer, SupplierSerializer, OperationLogSerializer, RestockRequestSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class RawMaterialViewSet(viewsets.ModelViewSet):
    queryset = RawMaterial.objects.all()
    serializer_class = RawMaterialSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class OperationLogViewSet(viewsets.ModelViewSet):
    queryset = OperationLog.objects.all()
    serializer_class = OperationLogSerializer

class RestockRequestViewSet(viewsets.ModelViewSet):
    queryset = RestockRequest.objects.all()
    serializer_class = RestockRequestSerializer
    