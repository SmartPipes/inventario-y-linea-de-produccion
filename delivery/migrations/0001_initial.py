# Generated by Django 5.0.6 on 2024-05-30 10:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventory', '0001_initial'),
        ('sales', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DeliveryOrder',
            fields=[
                ('delivery_order_id', models.AutoField(primary_key=True, serialize=False)),
                ('delivery_date', models.DateTimeField()),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Transit', 'In Transit'), ('Delivered', 'Delivered'), ('Cancelled', 'Cancelled')], max_length=20)),
                ('delivery_address', models.CharField(max_length=255)),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='delivery_orders', to='sales.sale')),
            ],
            options={
                'db_table': 'del_DeliveryOrders',
            },
        ),
        migrations.CreateModel(
            name='DeliveryOrderDetail',
            fields=[
                ('delivery_order_detail_id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.PositiveIntegerField()),
                ('delivery_order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='delivery_order_details', to='delivery.deliveryorder')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='delivery_order_details', to='inventory.product')),
            ],
            options={
                'db_table': 'del_DeliveryOrdersDetails',
            },
        ),
        migrations.CreateModel(
            name='DeliveryTeam',
            fields=[
                ('delivery_team_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('members', models.ManyToManyField(related_name='delivery_teams', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'del_DeliveryTeams',
            },
        ),
        migrations.AddField(
            model_name='deliveryorder',
            name='delivery_team',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='delivery_orders', to='delivery.deliveryteam'),
        ),
    ]
