from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from sample.models import Sample
from .serializers import SampleSerializer
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.decorators import action


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
    filterset_class = SampleFilter

    @action(detail=False, methods=['put'], name='Bulk Update',permission_classes=[IsAuthenticatedOrReadOnly])
    def bulk_update(self, request, *args, **kwargs):
        print('hogehoge',request)
        data = request.data
        # リクエストデータがリストであることを確認
        if not isinstance(data, list):
            return Response({'error': 'Request data should be a list of objects.'}, status=status.HTTP_400_BAD_REQUEST)

        # 更新処理
        updated_instances = []
        for item in data:
            instance_id = item.get('id')
            if not instance_id:
                continue  # IDがない場合はスキップ
            try:
                serializer = SampleSerializer(data=item)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    updated_instances.append(serializer.data)
            except Sample.DoesNotExist:
                continue  # 存在しないIDの場合はスキップ

        return Response(updated_instances, status=status.HTTP_200_OK)

