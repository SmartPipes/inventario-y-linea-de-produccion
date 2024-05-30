from django.contrib import admin
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/production-line/', include('production_line.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/tickets/', include('tickets.urls')),
    path('api/delivery/', include('delivery.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)