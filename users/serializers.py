from rest_framework import serializers
from .models import User, Division, DivisionUser, PaymentMethod

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