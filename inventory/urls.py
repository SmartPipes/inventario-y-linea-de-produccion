from django.urls import path
from inventory.views import ListProduct

app_name = "inventory"

urlpatterns = [
    path('list/product/', ListProduct.as_view(), name='list_product'),
]