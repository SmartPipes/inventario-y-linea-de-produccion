from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class Division(models.Model):
    division_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    manager_user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_divisions')

    class Meta:
        db_table = 'use_Division'

    def __str__(self):
        return self.name

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    birthdate = models.DateField()
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10, blank=True)
    password = models.CharField(max_length=200)
    role = models.CharField(max_length=10, choices=[('Admin', 'Admin'), ('User', 'User')])
    status = models.CharField(max_length=10, choices=[('Active', 'Active'), ('Inactive', 'Inactive')])
    division = models.ForeignKey(Division, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    class Meta:
        db_table = 'use_Users'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class DivisionUser(models.Model):
    division_user_id = models.AutoField(primary_key=True)
    division = models.ForeignKey(Division, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    assigned_date = models.DateField(auto_now_add=True)
    removed_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = 'use_DivisionUser'
        unique_together = (('division', 'user'),)

    def __str__(self):
        return f"{self.division.name} - {self.user.email}"
