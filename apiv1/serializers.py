from rest_framework import serializers
from sample.models import Sample
from rest_framework.validators import UniqueTogetherValidator

class SampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sample
        fields = ['id','title','description','price']
        # 単体
        extra_kwargs = {
            'title':{
                'max_length':10,
                'error_messages':{
                    'blank':'タイトルは空にできません。',
                }
            },
            'description':{
                'max_length':15,
            }
        }
        # 組み合わせ
        validators = [
            UniqueTogetherValidator(
                queryset=Sample.objects.all(),
                fields=('title','description'),
                message='タイトルと備考の組み合わせは既に存在します'
            )
        ]

    # 特定の項目にカスタム
    def validate_price(self, value):
        if value < 100:
            raise serializers.ValidationError('hogeerror')
        return value

    # 全体
    def validate(self,value):
        title = value.get('title')
        if 'hgoe' in title:
            raise serializers.ValidationError('titleにhogeが指定されています')
        return value

