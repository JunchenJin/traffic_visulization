from django.conf.urls import include, url
from django.contrib import admin


urlpatterns = [
    url(r'^(?i)simulation/', include('simulation.urls', namespace="simulation")),
    url(r'^', include('framework.urls', namespace="framework")),
    url(r'^admin/', include(admin.site.urls)),
]
