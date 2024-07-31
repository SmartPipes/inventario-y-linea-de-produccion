from rest_framework import serializers
from .models import User, Division, DivisionUser, PaymentMethod
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

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

class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'first_name', 'last_name', 'birthdate', 'email', 'phone', 'password', 'role', 'status']
        extra_kwargs = {
            'password': {'write_only': True},
            'status': {'required': True},
            'role': {'required': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'birthdate', 'email', 'phone', 'role', 'status']
