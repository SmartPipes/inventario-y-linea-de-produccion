from django.conf import settings
from django.shortcuts import render
from django.views.generic import ListView
from inventory.models import Product

class ListProduct(ListView):
    model = Product
    template_name = "inventory/list_product.html"
    context_object_name = "products"

    def get_queryset(self):
        return Product.objects.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['MEDIA_URL'] = settings.MEDIA_URL
        return context
