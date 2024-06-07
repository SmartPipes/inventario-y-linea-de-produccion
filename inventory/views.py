from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product, RawMaterial, Inventory, Category, State, City, Warehouse, Supplier, OperationLog, RestockRequest
from .serializers import ProductSerializer, RawMaterialSerializer, InventorySerializer, CategorySerializer, StateSerializer, CitySerializer, WarehouseSerializer, SupplierSerializer, OperationLogSerializer, RestockRequestSerializer
from rest_framework.response import Response
from rest_framework import status
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
