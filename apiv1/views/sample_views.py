from sample.models import Sample
from ..serializers import SampleSerializer,BulkSampleListSerializer
from base.views import BulkUpdateModelViewSet
from django_filters import rest_framework as filters


class SampleFilter(filters.FilterSet):
    class Meta:
        model = Sample
        fields = '__all__'

    price_lte = filters.NumberFilter(field_name='price', lookup_expr='lte')

class SampleViewSet(BulkUpdateModelViewSet):
    queryset = Sample.objects.filter(deleted_at__isnull=True)
    serializer_class = SampleSerializer
    bulk_update_serializer_class = BulkSampleListSerializer  # bulk_update用のシリアライザー
    bulk_update_fields = ['title', 'description', 'price', 'deleted_at']  # bulk_updateで更新するフィールド
    filterset_class = SampleFilter