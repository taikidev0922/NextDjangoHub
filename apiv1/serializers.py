from rest_framework import serializers
from sample.models import Sample
from rest_framework.validators import UniqueTogetherValidator

class SampleSerializer(serializers.ModelSerializer):
    cookie = serializers.IntegerField(required=False)
    class Meta:
        model = Sample
        fields = '__all__'
        # 単体
        extra_kwargs = {
            'title':{
                'max_length':10,
                'error_messages':{
                    'blank':'タイトルは必須です',
                }
            },
            'price':{
                'error_messages':{
                    'null':'価格は必須です',
                    'blank':'価格は必須です',
                }
            },
            'description':{
                'max_length':15,
            }
        }


class BulkSampleListSerializer(serializers.ListSerializer):
    child = SampleSerializer()

