# Generated by Django 5.0.6 on 2024-05-30 10:45

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventory', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('cart_id', models.AutoField(primary_key=True, serialize=False)),
                ('cart_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], max_length=20)),
            ],
            options={
                'db_table': 'sal_Carts',
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('payment_id', models.AutoField(primary_key=True, serialize=False)),
                ('payment_method', models.CharField(max_length=50)),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='sales.cart')),
            ],
            options={
                'db_table': 'sal_Payments',
            },
        ),
        migrations.CreateModel(
            name='Sale',
            fields=[
                ('sale_id', models.AutoField(primary_key=True, serialize=False)),
                ('sale_date', models.DateTimeField(auto_now_add=True)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('buyer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sales', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'sal_Sales',
            },
        ),
        migrations.AddField(
            model_name='cart',
            name='sale',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='carts', to='sales.sale'),
        ),
        migrations.CreateModel(
            name='SaleDetail',
            fields=[
                ('sale_detail_id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.PositiveIntegerField()),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sale_details', to='inventory.product')),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sale_details', to='sales.sale')),
            ],
            options={
                'db_table': 'sal_SalesDetails',
            },
        ),
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('invoice_id', models.AutoField(primary_key=True, serialize=False)),
                ('invoice_date', models.DateTimeField(auto_now_add=True)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('sale_detail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoices', to='sales.saledetail')),
            ],
            options={
                'db_table': 'sal_Invoices',
            },
        ),
        migrations.CreateModel(
            name='CartDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cart_details', to='sales.cart')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cart_details', to='inventory.product')),
            ],
            options={
                'db_table': 'sal_CartDetails',
                'unique_together': {('cart', 'product')},
            },
        ),
    ]
