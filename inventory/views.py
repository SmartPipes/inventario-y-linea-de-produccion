from rest_framework import viewsets, mixins
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product, RawMaterial, Inventory, Category, State, City, Warehouse, Supplier, OperationLog, RestockRequest, ProductRawMaterialList, RestockRequestWarehouse, RestockRequestWarehouseRawMaterial, UserWarehouseAssignment
from .serializers import ProductSerializer, RawMaterialSerializer, InventorySerializer, CategorySerializer, StateSerializer, CitySerializer, WarehouseSerializer, SupplierSerializer, OperationLogSerializer, RestockRequestSerializer, ProductRawMaterialListSerializer, InventoryTotalStockSerializer, RestockRequestWarehouseSerializer, RestockRequestWarehouseRawMaterialSerializer, UserWarehouseAssignmentSerializer, UpdateInventorySerializer, BulkProductRawMaterialListSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.db import connection

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('product_id')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RawMaterialViewSet(viewsets.ModelViewSet):
    queryset = RawMaterial.objects.all().order_by('raw_material_id')
    serializer_class = RawMaterialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all().order_by('inventory_id')
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('category_id')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class StateViewSet(viewsets.ModelViewSet):
    queryset = State.objects.all().order_by('state_id')
    serializer_class = StateSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all().order_by('city_id')
    serializer_class = CitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all().order_by('warehouse_id')
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class UserWarehouseAssignmentViewSet(viewsets.ModelViewSet):
    queryset = UserWarehouseAssignment.objects.all()
    serializer_class = UserWarehouseAssignmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('supplier_id')
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class OperationLogViewSet(viewsets.ModelViewSet):
    queryset = OperationLog.objects.all().order_by('operation_log_id')
    serializer_class = OperationLogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RestockRequestViewSet(viewsets.ModelViewSet):
    queryset = RestockRequest.objects.all().order_by('restock_request_id')
    serializer_class = RestockRequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductRawMaterialListSet(viewsets.ModelViewSet):
    queryset = ProductRawMaterialList.objects.all().order_by('id')
    serializer_class = ProductRawMaterialListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class InventoryTotalStockViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Inventory.objects.values('item_id', 'item_type').annotate(total_stock=Sum('stock')).order_by('item_id')
        serializer = InventoryTotalStockSerializer(queryset, many=True)
        return Response(serializer.data)

class RestockRequestWarehouseView(viewsets.ModelViewSet):
    queryset = RestockRequestWarehouse.objects.all().order_by('id')
    serializer_class = RestockRequestWarehouseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RestockRequestWarehouseRawMaterialView(viewsets.ModelViewSet):
    queryset = RestockRequestWarehouseRawMaterial.objects.all().order_by('id')
    serializer_class = RestockRequestWarehouseRawMaterialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class UpdateInventoryView(APIView):
    def post(self, request):
        serializer = UpdateInventorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.update_or_create_inventory()
            return Response({'message': 'Inventory updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BulkProductRawMaterialListView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = BulkProductRawMaterialListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response({"detail": "product_id query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            materials_to_delete = ProductRawMaterialList.objects.filter(product_id=product_id)
            materials_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductRawMaterialList.DoesNotExist:
            return Response({"detail": "No materials found for the given product_id"}, status=status.HTTP_404_NOT_FOUND)