from django.contrib import admin
from django.urls import path,include,re_path
from django.views.generic import TemplateView,RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',TemplateView.as_view(template_name='index.html')),
    path('api/v1/auth/',include('dj_rest_auth.urls')),
    path('api/v1/',include('apiv1.urls')),
    re_path('',RedirectView.as_view(url='/'))
]
