# activation/urls.py
from django.urls import path
from .views import activation_page

urlpatterns = [
    path('<uid>/<token>/', activation_page, name='activation_page'),
    
]
