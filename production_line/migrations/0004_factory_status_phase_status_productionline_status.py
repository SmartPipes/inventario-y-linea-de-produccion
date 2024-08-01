# Generated by Django 5.0.6 on 2024-06-09 23:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('production_line', '0003_rename_nombre_productionline_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='factory',
            name='status',
            field=models.CharField(choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active', max_length=20),
        ),
        migrations.AddField(
            model_name='phase',
            name='status',
            field=models.CharField(choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active', max_length=20),
        ),
        migrations.AddField(
            model_name='productionline',
            name='status',
            field=models.CharField(choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active', max_length=20),
        ),
    ]
