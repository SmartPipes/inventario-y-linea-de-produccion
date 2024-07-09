from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DivisionViewSet, DivisionUserViewSet, PaymentMethodsViewSet, GetUserInfoAPIView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'divisions', DivisionViewSet)
router.register(r'division-users', DivisionUserViewSet)
router.register(r'payment-methods', PaymentMethodsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('get-user-info/', GetUserInfoAPIView.as_view(), name='get-user-info'),
]
