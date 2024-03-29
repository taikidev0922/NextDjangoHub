from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from sample.models import Sample
from .serializers import SampleSerializer
from django_filters import rest_framework as filters

class SampleFilter(filters.FilterSet):
    class Meta:
        model = Sample
        fields = '__all__'

    price_lte = filters.NumberFilter(field_name='price', lookup_expr='lte')


class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.DjangoFilterBackend]
    # filterset_fields = '__all__'
    filterset_class = SampleFilter
