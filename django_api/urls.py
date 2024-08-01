# django_api/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/users/', include('users.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/production-line/', include('production_line.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/delivery/', include('delivery.urls')),
    path('activate/', include('activation.urls')),
    path('password-reset/', include('password_reset.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
