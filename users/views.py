# views.py del módulo users

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User, Division, DivisionUser, PaymentMethod
from .serializers import UserSerializer, DivisionSerializer, DivisionUserSerializer, PaymentMethodSerializer, UserDetailSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class DivisionViewSet(viewsets.ModelViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer

class DivisionUserViewSet(viewsets.ModelViewSet):
    queryset = DivisionUser.objects.all()
    serializer_class = DivisionUserSerializer

class PaymentMethodsViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

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
