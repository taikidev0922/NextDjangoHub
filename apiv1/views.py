from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from sample.models import Sample
from .serializers import SampleSerializer,BulkSampleListSerializer
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from rest_framework import generics

class SampleFilter(filters.FilterSet):
    class Meta:
        model = Sample
        fields = '__all__'

    price_lte = filters.NumberFilter(field_name='price', lookup_expr='lte')


class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = SampleFilter

    @extend_schema(request=BulkSampleListSerializer, responses={200: BulkSampleListSerializer})
    @action(detail=False, methods=['put'])
    def bulk_update(self, request, *args, **kwargs):
        serializer = BulkSampleListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        sample_data = [{k: v for k, v in attrs.items() if hasattr(Sample, k)} for attrs in request.data]
        samples = [Sample(**data) for data in sample_data]
        result = Sample.objects.bulk_create(samples,update_conflicts=True,unique_fields=['id'],update_fields=['title','description','price'])
        returnSerializer = BulkSampleListSerializer(data=result)
        returnSerializer.is_valid()
        response_data = [{**item, 'cookie': request.data[index]['cookie']} for index, item in enumerate(returnSerializer.data)]
        return Response(response_data,status=status.HTTP_200_OK)
