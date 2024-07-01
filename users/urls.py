from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DivisionViewSet, DivisionUserViewSet, PaymentMethodsViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'divisions', DivisionViewSet)
router.register(r'division-users', DivisionUserViewSet)
router.register(r'payment-methods', PaymentMethodsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('users/get-user-info/', UserViewSet.as_view({'post': 'get_user_info'}), name='get-user-info'),
]
