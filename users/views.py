# views.py del módulo users

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User, Division, DivisionUser, PaymentMethod
from .serializers import UserSerializer, DivisionSerializer, DivisionUserSerializer, PaymentMethodSerializer, UserDetailSerializer,LoginSerializer

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
            
class LoginView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user is not None:
                if user.is_active:
                    user_data = {
                        "id": user.id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "phone": user.phone,
                        "role": user.role,
                        "status": user.status
                    }
                    return Response(user_data, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "User is inactive"}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
