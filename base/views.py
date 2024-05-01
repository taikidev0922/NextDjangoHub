from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.decorators import action

class BulkUpdateModelViewSet(viewsets.ModelViewSet):
    """
    モデルビューセットのための基底クラスで、bulk_updateアクションを提供します。
    """
    @action(detail=False, methods=['put'])
    def bulk_update(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.bulk_update_serializer_class(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        current_time = timezone.now()
        items_to_process = []
        errors = []
        for index, item in enumerate(request.data):
            if 'operation' not in item:
                errors.append({
                    'cookie': item.get('cookie', None),
                    'results': [{'type': 'error', 'message': 'operationは必須です'}]
                })
                continue

            operation = item.get('operation')
            item_data = {k: v for k, v in item.items() if hasattr(self.queryset.model, k)}
            if operation == 'delete':
                item_data['deleted_at'] = current_time
            elif operation == 'save':
                pass  # No specific action needed, just append to items_to_process below.
            else:
                errors.append({
                    'cookie': item.get('cookie', None),
                    'results': [{'type': 'error', 'message': f'未知のoperation: {operation}'}]
                })

            # Always append to items_to_process regardless of the operation, unless it's an unknown operation.
            if operation in ['delete', 'save']:
                items_to_process.append(self.queryset.model(**item_data))

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        result = self.queryset.model.objects.bulk_create(items_to_process, update_conflicts=True, unique_fields=['id'], update_fields=self.bulk_update_fields)
        return_serializer = self.get_serializer(result, many=True)
        response_data = [{**item, 'cookie': request.data[index]['cookie']} for index, item in enumerate(return_serializer.data)]
        return Response(response_data, status=status.HTTP_200_OK)