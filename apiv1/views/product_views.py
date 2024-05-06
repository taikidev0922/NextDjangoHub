from apiv1.serializers import ProductSerializer, ProductListSerializer
from base.views import BulkUpdateModelViewSet
from django_filters import rest_framework as filters
from orders.models import Product

class ProductFilter(filters.FilterSet):
    class Meta:
        model = Product
        fields = '__all__'

class ProductViewSet(BulkUpdateModelViewSet):
    queryset = Product.objects.filter(deleted_at__isnull=True)
    serializer_class = ProductSerializer
    bulk_update_serializer_class = ProductListSerializer  # bulk_update用のシリアライザー
    bulk_update_fields = ['name', 'description', 'price', 'deleted_at']  # bulk_updateで更新するフィールド
    filterset_class = ProductFilter

