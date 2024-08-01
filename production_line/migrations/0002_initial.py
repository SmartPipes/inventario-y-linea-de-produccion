# Generated by Django 5.0.6 on 2024-06-03 00:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventory', '0002_initial'),
        ('production_line', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='factorymanager',
            name='manager',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='productionline',
            name='factory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='production_line.factory'),
        ),
        migrations.AddField(
            model_name='productionline',
            name='production_line_creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_production_lines', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='productionorder',
            name='factory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='production_line.factory'),
        ),
        migrations.AddField(
            model_name='productionorder',
            name='requested_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='productionorder',
            name='warehouse_to_deliver',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='deliver_orders', to='inventory.warehouse'),
        ),
        migrations.AddField(
            model_name='productionorder',
            name='warehouse_to_retrieve',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='retrieve_orders', to='inventory.warehouse'),
        ),
        migrations.AddField(
            model_name='productionorderdetail',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.product'),
        ),
        migrations.AddField(
            model_name='productionorderdetail',
            name='production_order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='production_line.productionorder'),
        ),
        migrations.AddField(
            model_name='productionorderphase',
            name='phase',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='production_line.phase'),
        ),
        migrations.AddField(
            model_name='productionorderphase',
            name='production_order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='production_line.productionorder'),
        ),
        migrations.AddField(
            model_name='productionphase',
            name='phase',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='production_line.phase'),
        ),
        migrations.AddField(
            model_name='productionphase',
            name='productionLine',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='production_line.productionline'),
        ),
        migrations.AlterUniqueTogether(
            name='factorymanager',
            unique_together={('factory', 'manager')},
        ),
        migrations.AlterUniqueTogether(
            name='productionorderdetail',
            unique_together={('production_order', 'product')},
        ),
        migrations.AlterUniqueTogether(
            name='productionorderphase',
            unique_together={('production_order', 'phase')},
        ),
        migrations.AlterUniqueTogether(
            name='productionphase',
            unique_together={('productionLine', 'phase')},
        ),
    ]
