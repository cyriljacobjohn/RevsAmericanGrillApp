# Generated by Django 4.1.3 on 2022-12-04 20:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ManagerApp', '0005_simpleaccount_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='simpleaccount',
            name='password',
            field=models.CharField(default='', max_length=150),
        ),
    ]