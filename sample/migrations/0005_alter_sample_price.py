# Generated by Django 4.2.11 on 2024-04-25 07:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sample', '0004_alter_sample_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sample',
            name='price',
            field=models.IntegerField(default=777, verbose_name='価格'),
            preserve_default=False,
        ),
    ]
