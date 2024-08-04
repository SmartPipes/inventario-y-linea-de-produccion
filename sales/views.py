from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, Payment, Sale, CartDetail, SaleDetail
from .serializers import CartSerializer, PaymentSerializer, SaleSerializer, CartDetailSerializer, SaleDetailSerializer, BulkSaleDetailSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class CartDetailViewSet(viewsets.ModelViewSet):
    queryset = CartDetail.objects.all()
    serializer_class = CartDetailSerializer

class SaleDetailViewSet(viewsets.ModelViewSet):
    queryset = SaleDetail.objects.all()
    serializer_class = SaleDetailSerializer

class BulkSaleDetailView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = BulkSaleDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
