from django.db import models
import uuid

class Sample(models.Model):
    class Meta:
        db_table = 'sample'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(verbose_name='タイトル',max_length=100)
    description = models.TextField(verbose_name='説明',null=True,blank=True)
    price = models.IntegerField(verbose_name='価格',null=True,blank=True)
    created_at = models.DateTimeField(verbose_name='登録日',auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日',auto_now=True)

