# Generated by Django 5.0.6 on 2024-06-03 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DeliveryOrder',
            fields=[
                ('delivery_order_id', models.AutoField(primary_key=True, serialize=False)),
                ('delivery_date', models.DateTimeField()),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('In Transit', 'In Transit'), ('Delivered', 'Delivered'), ('Cancelled', 'Cancelled')], max_length=20)),
                ('delivery_address', models.CharField(max_length=255)),
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
            ],
            options={
                'db_table': 'del_DeliveryTeams',
            },
        ),
    ]
