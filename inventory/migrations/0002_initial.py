# Generated by Django 5.0.6 on 2024-05-31 09:10

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
        migrations.AddField(
            model_name='attachedfile',
            name='user_uploader',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='operationlog',
            name='op_log_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='operationlog',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.product'),
        ),
        migrations.AddField(
            model_name='attachedfile',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.product'),
        ),
        migrations.AddField(
            model_name='productimage',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.product'),
        ),
        migrations.AddField(
            model_name='productrawmateriallist',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.product'),
        ),
        migrations.AddField(
            model_name='rawmaterial',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.category'),
        ),
        migrations.AddField(
            model_name='productrawmateriallist',
            name='raw_material',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.rawmaterial'),
        ),
        migrations.AddField(
            model_name='rawmaterialsupplier',
            name='raw_material',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.rawmaterial'),
        ),
        migrations.AddField(
            model_name='restockrequest',
            name='raw_material',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.rawmaterial'),
        ),
        migrations.AddField(
            model_name='restockrequest',
            name='requested_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='restockrequestwarehouse',
            name='restock_request',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.restockrequest'),
        ),
        migrations.AddField(
            model_name='restockrequestwarehouserawmaterial',
            name='raw_material',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.rawmaterial'),
        ),
        migrations.AddField(
            model_name='restockrequestwarehouserawmaterial',
            name='restock_request_warehouse',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.restockrequestwarehouse'),
        ),
        migrations.AddField(
            model_name='city',
            name='state',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inventory_cities', to='inventory.state'),
        ),
        migrations.AddField(
            model_name='rawmaterialsupplier',
            name='supplier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.supplier'),
        ),
        migrations.AddField(
            model_name='userwarehouseassignment',
            name='manager_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='warehouse',
            name='city',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.city'),
        ),
        migrations.AddField(
            model_name='userwarehouseassignment',
            name='warehouse',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.warehouse'),
        ),
        migrations.AddField(
            model_name='restockrequestwarehouse',
            name='warehouse',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restock_request_warehouse', to='inventory.warehouse'),
        ),
        migrations.AddField(
            model_name='restockrequest',
            name='warehouse',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.warehouse'),
        ),
        migrations.AddField(
            model_name='operationlog',
            name='warehouse',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.warehouse'),
        ),
        migrations.AddField(
            model_name='inventory',
            name='warehouse',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.warehouse'),
        ),
        migrations.AlterUniqueTogether(
            name='productrawmateriallist',
            unique_together={('product', 'raw_material')},
        ),
        migrations.AlterUniqueTogether(
            name='restockrequestwarehouserawmaterial',
            unique_together={('restock_request_warehouse', 'raw_material')},
        ),
        migrations.AlterUniqueTogether(
            name='rawmaterialsupplier',
            unique_together={('raw_material', 'supplier')},
        ),
        migrations.AlterUniqueTogether(
            name='restockrequestwarehouse',
            unique_together={('restock_request', 'warehouse')},
        ),
        migrations.AlterUniqueTogether(
            name='inventory',
            unique_together={('item_id', 'item_type', 'warehouse')},
        ),
    ]
