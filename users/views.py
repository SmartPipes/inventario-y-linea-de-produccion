from rest_framework import viewsets
from .models import User, Division, DivisionUser
from .serializers import UserSerializer, DivisionSerializer, DivisionUserSerializer

class DivisionViewSet(viewsets.ModelViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class DivisionUserViewSet(viewsets.ModelViewSet):
    queryset = DivisionUser.objects.all()
    serializer_class = DivisionUserSerializer
