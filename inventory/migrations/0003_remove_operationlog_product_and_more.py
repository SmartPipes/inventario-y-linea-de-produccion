import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0002_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OperationLog',
            fields=[
                ('operation_log_id', models.AutoField(primary_key=True, serialize=False)),
                ('quantity', models.SmallIntegerField()),
                ('datetime', models.DateTimeField(auto_now_add=True)),
                ('type_operation', models.CharField(choices=[('Add', 'Add'), ('Remove', 'Remove')], max_length=6)),
                ('inventory_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.inventory')),
                ('op_log_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user')),
                ('warehouse', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.warehouse')),
            ],
            options={
                'db_table': 'inv_operation_log',
            },
        ),
    ]
