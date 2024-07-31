from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product, RawMaterial, Inventory, Category, State, City, Warehouse, Supplier, OperationLog, RestockRequest, ProductRawMaterialList, RestockRequestWarehouse, RestockRequestWarehouseRawMaterial, UserWarehouseAssignment
from .serializers import ProductSerializer, RawMaterialSerializer, InventorySerializer, CategorySerializer, StateSerializer, CitySerializer, WarehouseSerializer, SupplierSerializer, OperationLogSerializer, RestockRequestSerializer, ProductRawMaterialListSerializer, InventoryTotalStockSerializer, RestockRequestWarehouseSerializer, RestockRequestWarehouseRawMaterialSerializer, UserWarehouseAssignmentSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.db import connection

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RawMaterialViewSet(viewsets.ModelViewSet):
    queryset = RawMaterial.objects.all()
    serializer_class = RawMaterialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class UserWarehouseAssignmentViewSet(viewsets.ModelViewSet):
    queryset = UserWarehouseAssignment.objects.all()
    serializer_class = UserWarehouseAssignmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class OperationLogViewSet(viewsets.ModelViewSet):
    queryset = OperationLog.objects.all()
    serializer_class = OperationLogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RestockRequestViewSet(viewsets.ModelViewSet):
    queryset = RestockRequest.objects.all()
    serializer_class = RestockRequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductRawMaterialListSet(viewsets.ModelViewSet):
    queryset = ProductRawMaterialList.objects.all()
    serializer_class = ProductRawMaterialListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class InventoryTotalStockViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Inventory.objects.values('item_id', 'item_type').annotate(total_stock=Sum('stock')).order_by('item_id')
        serializer = InventoryTotalStockSerializer(queryset, many=True)
        return Response(serializer.data)

class RestockRequestWarehouseView(viewsets.ModelViewSet):
    queryset = RestockRequestWarehouse.objects.all()
    serializer_class = RestockRequestWarehouseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RestockRequestWarehouseRawMaterialView(viewsets.ModelViewSet):
    queryset = RestockRequestWarehouseRawMaterial.objects.all()
    serializer_class = RestockRequestWarehouseRawMaterialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    