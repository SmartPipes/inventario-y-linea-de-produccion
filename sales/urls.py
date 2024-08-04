from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, PaymentViewSet, SaleViewSet, CartDetailViewSet, SaleDetailViewSet, BulkSaleDetailView

router = DefaultRouter()
router.register(r'carts', CartViewSet)
router.register(r'sales', SaleViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'cart-details', CartDetailViewSet)
router.register(r'sale-details', SaleDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('bulk-sale-details/', BulkSaleDetailView.as_view(), name='bulk-sale-details'),
]
