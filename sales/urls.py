from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, PaymentViewSet, SaleViewSet, CartDetailViewSet, SaleDetailViewSet

router = DefaultRouter()
router.register(r'carts', CartViewSet)
router.register(r'sales', SaleViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'cart-details', CartDetailViewSet)
router.register(r'sale-details', SaleDetailViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
