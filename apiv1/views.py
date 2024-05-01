from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from sample.models import Sample
from .serializers import SampleSerializer,BulkSampleListSerializer
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from rest_framework import generics
from django.utils import timezone
from base.views import BulkUpdateModelViewSet


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



# class SampleViewSet(viewsets.ModelViewSet):
#     queryset = Sample.objects.filter(deleted_at__isnull=True)
#     serializer_class = SampleSerializer
#     permission_classes = [IsAuthenticated]
#     filter_backends = [filters.DjangoFilterBackend]
#     filterset_class = SampleFilter

#     @action(detail=False, methods=['put'])
#     def bulk_update(self, request, *args, **kwargs):
#         serializer = BulkSampleListSerializer(data=request.data)
#         if not serializer.is_valid():
#             errors = serializer.errors
#             response_data = []
#             # 各入力データに対してエラーを整形
#             for index, error_dict in enumerate(errors):
#                 cookie_value = request.data[index].get('cookie', None)
#                 formatted_errors = []
#                 for field, messages in error_dict.items():
#                     if isinstance(messages, list):
#                         for message in messages:
#                             formatted_errors.append({'type': 'error', 'message': message})
#                 response_data.append({'cookie': cookie_value, 'results': formatted_errors})
#             return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

#         # operationがdeleteの場合の処理を追加
#         current_time = timezone.now()
#         for item in request.data:
#             if item.get('operation') == 'delete':
#                 sample_id = item.get('id')
#                 Sample.objects.filter(id=sample_id).update(deleted_at=current_time)

#         # operationがsaveの場合のみ更新または作成を行う
#         sample_data = []
#         for attrs in request.data:
#             if attrs.get('operation') == 'save':
#                 filtered_data = {k: v for k, v in attrs.items() if hasattr(Sample, k)}
#                 sample_data.append(filtered_data)

#         samples_to_process = []
#         for item in request.data:
#             operation = item.get('operation')
#             sample_data = {k: v for k, v in item.items() if hasattr(Sample, k)}
#             if operation == 'delete':
#                 sample_data['deleted_at'] = current_time
#             samples_to_process.append(Sample(**sample_data))
#         result = Sample.objects.bulk_create(samples_to_process, update_conflicts=True, unique_fields=['id'], update_fields=['title', 'description', 'price','deleted_at'])
#         returnSerializer = BulkSampleListSerializer(data=result)
#         returnSerializer.is_valid()
#         response_data = [{**item, 'cookie': request.data[index]['cookie']} for index, item in enumerate(returnSerializer.data)]
#         return Response(response_data, status=status.HTTP_200_OK)
