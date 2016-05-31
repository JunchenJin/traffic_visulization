from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def congestion(request):
    return render(request, 'framework/congestion.html')
def demo_od(request):
    return render(request, 'framework/demo-od.html')

def tab(request,tabname):
    return render(request,'framework/'+tabname+".html",{"tabname":tabname})
# def od(request):
#     return render(request, 'od.html')
# def test(request):
#     return render(request, 'v1/test.html')
# 
# def testiframe(request):
#     return render(request, 'v1/testiframe.html')
# 
# def iframe(request,link_id):
#     return render(request, 'v1/baseiframe.html',{'link_id': link_id})
# 
# def simulation(request):
#     return render(request, 'v1/simulation.html')
#     
# def indexV2(request):
#     return render(request, 'base.html')
# def dynamic_traffic(request):
#     return render(request, 'dynamic_traffic.html')
# def tt_dist(request):
#     return render(request, 'tt_dist.html')
# 
# def combination(request):
#     return render(request, 'combination.html')

def querychart(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    cursor.execute("select * from self_fetch_tt_json()")
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

def querypath(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_path_json(lng1,lat1,lng2,lat2,2)";
    querystring=querystring.replace("lng1",request.REQUEST["lng1"]);
    querystring=querystring.replace("lat1",request.REQUEST["lat1"]);
    querystring=querystring.replace("lng2",request.REQUEST["lng2"]);
    querystring=querystring.replace("lat2",request.REQUEST["lat2"]);
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

def querypathV1(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_path_jsonV1(lng1,lat1,lng2,lat2)";
    querystring=querystring.replace("lng1",request.REQUEST["lng1"]);
    querystring=querystring.replace("lat1",request.REQUEST["lat1"]);
    querystring=querystring.replace("lng2",request.REQUEST["lng2"]);
    querystring=querystring.replace("lat2",request.REQUEST["lat2"]);
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')


def queryrtthistorical(request):
    from django.db import connection
    import json
    import numpy as np
    cursor=connection.cursor()
    querystring="SELECT rtt/60 FROM self_get_rttandweight_daily(ARRAY $1)"
    print 'start to get parameter'
    print request;
#     The data sent in the request is an array, remember to use 
#     linkids : JSON.stringify(currentPath) in JavaScript
    linkids=request.GET["linkids"]
    print linkids
    querystring=querystring.replace("$1",str(linkids))
    print querystring
    cursor.execute(querystring)
    records=[element for (element,) in cursor.fetchall()]
    rangemax=np.percentile(records,99)
    filtered_records=[value for value in records if value<rangemax]
    content=json.dumps({"max":rangemax,"data":filtered_records})
    return HttpResponse(content,content_type='application/json')
    
def queryspeed(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_street_speed_json()";
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

def querytti(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_tti_json()";
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

def querysri(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_sri_json()";
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

def queryspi(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_spi_json()";
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

def querypti(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_pti_json()";
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')
def querybfi(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_bfi_json()";
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

def fetchnetwork(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
    querystring="select * from self_fetch_street_network()";
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

def fetch_tt(request):
    from django.db import connection
    import json
    cursor=connection.cursor()
#     V1 means that direct querying from the aggregated table
    querystring="select * from self_fetch_tt_dailyV1(id)";
    querystring=querystring.replace("id",request.REQUEST["link_id"]);
    cursor.execute(querystring)
    records = cursor.fetchone()
    content=json.dumps(records[0])
    return HttpResponse(content,content_type='application/json')

