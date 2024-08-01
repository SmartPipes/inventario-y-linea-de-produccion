# Generated by Django 5.0.6 on 2024-06-23 21:25

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('delivery', '0003_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ThirdPartyService',
            fields=[
                ('service_id', models.AutoField(primary_key=True, serialize=False)),
                ('service_name', models.CharField(max_length=50)),
                ('contact_number', models.CharField(max_length=10)),
                ('tracking_url', models.URLField()),
            ],
            options={
                'verbose_name': 'Third Party Service',
                'verbose_name_plural': 'Third Party Services',
                'db_table': 'del_third_party_services',
            },
        ),
        migrations.RemoveField(
            model_name='deliveryorder',
            name='delivery_team',
        ),
        migrations.AlterModelOptions(
            name='deliveryorder',
            options={'verbose_name': 'Delivery Order', 'verbose_name_plural': 'Delivery Orders'},
        ),
        migrations.AlterModelOptions(
            name='deliveryorderdetail',
            options={'verbose_name': 'Delivery Order Detail', 'verbose_name_plural': 'Delivery Order Details'},
        ),
        migrations.AddField(
            model_name='deliveryorder',
            name='client',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='delivery_orders', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='deliveryorder',
            name='notes',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='deliveryorder',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('in_transit', 'In Transit'), ('delivered', 'Delivered'), ('cancelled', 'Cancelled')], max_length=20),
        ),
        migrations.AlterModelTable(
            name='deliveryorder',
            table='del_delivery_orders',
        ),
        migrations.AlterModelTable(
            name='deliveryorderdetail',
            table='del_delivery_order_details',
        ),
        migrations.AddField(
            model_name='deliveryorder',
            name='third_party_service',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='delivery_orders', to='delivery.thirdpartyservice'),
        ),
        migrations.DeleteModel(
            name='DeliveryTeam',
        ),
    ]
