from django.conf.urls import url

from . import views
from framework.pylib import modelfit


urlpatterns = [
    url(r'^$', views.congestion, name='congestion'),
    url(r'^(?i)tab/(?P<tabname>[a-z]+)$', views.tab),
    url(r'^(?i)demo-od$', views.demo_od),
#     url(r'^(?i)od$', views.od, name='od'),
#     url(r'^(?i)test$', views.test, name='test'),
#     url(r'^(?i)testiframe$', views.testiframe),
#     url(r'^(?i)iframe/(?P<link_id>[0-9]+)/$', views.iframe),
#   the following urls are used for fetching data from DB   
    url(r'^(?i)fetchnetwork$', views.fetchnetwork, name='fetchnetwork'),
    url(r'^(?i)querychart$', views.querychart, name='querychart'),
    url(r'^(?i)querypath$', views.querypath, name='querypath'),
    url(r'^(?i)querypathV1$', views.querypathV1, name='querypathV1'),
    url(r'^(?i)queryspeed$', views.queryspeed, name='queryspeed'),
    url(r'^(?i)querytti$', views.querytti, name='querytti'),
    url(r'^(?i)queryspi$', views.queryspi, name='queryspi'),
    url(r'^(?i)querypti$', views.querypti, name='querypti'),
    url(r'^(?i)querybfi$', views.querybfi, name='querybfi'),
    url(r'^(?i)fetchtt$', views.fetch_tt, name='fetchtt'),
    url(r'^(?i)queryrtthistorical$', views.queryrtthistorical, name='queryrtthistorical'),
    url(r'^(?i)fetchttfitimg64.png$', modelfit.queryimg64, name='fetchttfit'),
    url(r'^(?i)fetchttfitimg.png$', modelfit.queryimg, name='fetchttfit'),
]