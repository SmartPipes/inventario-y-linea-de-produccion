from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product, RawMaterial, Inventory, Category, State, City, Warehouse, Supplier, OperationLog, RestockRequest, RawMaterialSupplier, ProductRawMaterialList
from .serializers import ProductSerializer, RawMaterialSerializer, InventorySerializer, CategorySerializer, StateSerializer, CitySerializer, WarehouseSerializer, SupplierSerializer, OperationLogSerializer, RestockRequestSerializer, RawMaterialSupplierSerializer, ProductRawMaterialListSerializer, InventorySummarySerializer, InventoryTotalStockSerializer
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

class InventoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Inventory.objects.none()  # Esto es necesario para que el router pueda registrar este ViewSet
    serializer_class = InventorySummarySerializer

    def list(self, request):
        queryset = Inventory.objects.values(
            'inventory_id', 'item_id', 'item_type', 'warehouse'
        ).annotate(
            stock=Sum('stock')
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = InventorySummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = InventorySummarySerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        
        # Obtener el nuevo stock del request data
        new_stock = int(data.get('stock'))
        user_id = request.user.id  # Asumiendo que el usuario está autenticado y el ID está disponible

        # Actualizar el inventario en la base de datos utilizando un cursor
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SET @current_user_id = %s;", [user_id]
                )
                cursor.execute(
                    "UPDATE inv_inventory SET stock = %s WHERE inventory_id = %s;",
                    [new_stock, instance.inventory_id]
                )

            # Actualizar el objeto en memoria para reflejar el cambio
            instance.stock = new_stock
            instance.save()

            serializer = self.get_serializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(serializer.data)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

class RawMaterialSupplierViewSet(viewsets.ModelViewSet):
    queryset = RawMaterialSupplier.objects.all()
    serializer_class = RawMaterialSupplierSerializer
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
