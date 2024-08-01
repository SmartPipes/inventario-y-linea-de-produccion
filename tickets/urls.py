from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, ReportViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'reports', ReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
