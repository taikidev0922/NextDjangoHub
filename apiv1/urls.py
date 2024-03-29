from django.urls import path, include
from rest_framework import routers

from .import views

router = routers.DefaultRouter()
router.register('sample',views.SampleViewSet)

app_name = 'apiv1'
urlpatterns = [
    path('',include(router.urls))
]