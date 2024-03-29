from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from sample.models import Sample
from .serializers import SampleSerializer

class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

