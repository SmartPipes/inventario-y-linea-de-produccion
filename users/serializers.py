from rest_framework import serializers
from .models import User, Division, DivisionUser, PaymentMethod
from django.contrib.auth.hashers import make_password

class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': False}}

    def create(self, validated_data):
        # Encripta la contraseña antes de crear el usuario
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Si la contraseña está en los datos validados y es diferente de la actual, encripta la nueva contraseña
        password = validated_data.get('password', None)
        if password and instance.password != password:
            validated_data['password'] = make_password(password)
        else:
            validated_data.pop('password', None)  # No actualizar la contraseña si no se ha proporcionado una nueva
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Incluir la contraseña en la representación
        representation['password'] = instance.password
        return representation

class DivisionUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DivisionUser
        fields = '__all__'

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'birthdate', 'role', 'status', 'is_active']
        
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)