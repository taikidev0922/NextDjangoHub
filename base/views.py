from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters

class BulkUpdateModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    """
    モデルビューセットのための基底クラスで、bulk_updateアクションを提供します。
    """
    @action(detail=False, methods=['put'])
    def bulk_update(self, request, *args, **kwargs):
        serializer = self.bulk_update_serializer_class(data=request.data)
        if not serializer.is_valid():
            return self.handle_serializer_errors(serializer, request)

        current_time = timezone.now()
        items_to_process, errors = self.process_items(request.data, current_time)

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        result = self.queryset.model.objects.bulk_create(items_to_process, update_conflicts=True, unique_fields=['id'], update_fields=self.bulk_update_fields)
        return_serializer = self.get_serializer(result, many=True)
        response_data = [{**item, 'cookie': request.data[index]['cookie']} for index, item in enumerate(return_serializer.data)]
        return Response(response_data, status=status.HTTP_200_OK)

    def handle_serializer_errors(self, serializer, request):
        errors = serializer.errors
        response_data = []
        for index, error_dict in enumerate(errors):
            cookie_value = request.data[index].get('cookie', None)
            formatted_errors = [{'type': 'error', 'message': message} for field, messages in error_dict.items() for message in messages]
            response_data.append({'cookie': cookie_value, 'results': formatted_errors})
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

    def process_items(self, data, current_time):
        items_to_process = []
        errors = []
        for index, item in enumerate(data):
            operation = item.get('operation')
            if operation not in ['delete', 'save']:
                errors.append({
                    'cookie': item.get('cookie', None),
                    'results': [{'type': 'error', 'message': f'未知のoperation: {operation}'}]
                })
                continue

            item_data = {k: v for k, v in item.items() if hasattr(self.queryset.model, k)}
            if operation == 'delete':
                item_data['deleted_at'] = current_time
            items_to_process.append(self.queryset.model(**item_data))
        return items_to_process, errors
