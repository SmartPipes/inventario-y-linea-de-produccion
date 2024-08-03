# views.py del módulo users
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from .models import User, Division, DivisionUser, PaymentMethod
from .serializers import UserSerializer, DivisionSerializer, DivisionUserSerializer, PaymentMethodSerializer, UserDetailSerializer, UserCreateSerializer, UserUpdateSerializer
from django_filters import rest_framework as filters

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class DivisionFilter(filters.FilterSet):
    manager_user = filters.NumberFilter(field_name='manager_user')

    class Meta:
        model = Division
        fields = ['manager_user']

class DivisionViewSet(viewsets.ModelViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = DivisionFilter

class DivisionUserFilter(filters.FilterSet):
    user = filters.NumberFilter(field_name='user')

    class Meta:
        model = DivisionUser
        fields = ['user']

class DivisionUserViewSet(viewsets.ModelViewSet):
    queryset = DivisionUser.objects.all()
    serializer_class = DivisionUserSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = DivisionUserFilter

class PaymentMethodFilter(filters.FilterSet):
    client_id = filters.NumberFilter(field_name='client_id')

    class Meta:
        model = PaymentMethod
        fields = ['client_id']

class PaymentMethodsViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = PaymentMethodFilter

class DefaultPaymentMethodView(generics.ListAPIView):
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return PaymentMethod.objects.filter(client_id=user.id, is_default=True)

class GetUserInfoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Detectar si el contenido es texto plano o JSON
        if request.content_type == 'text/plain':
            email = request.body.decode('utf-8')
        else:
            email = request.data.get('email')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            serializer = UserDetailSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
