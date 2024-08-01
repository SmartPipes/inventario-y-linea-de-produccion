# password_reset/urls.py
from django.urls import path
from .views import reset_password_confirm

urlpatterns = [
    path('<uid>/<token>/', reset_password_confirm, name='reset_password_confirm'),
]
