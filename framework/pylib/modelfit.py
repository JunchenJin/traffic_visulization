import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from cStringIO import StringIO
from framework.pylib.axplot import *
# subplot
# subplot(nrows, ncols, plot_number) Where nrows and ncols are used to notionally 
# split the figure into nrows * ncols sub-axes, and plot_number is used to identify the particular subplot that 
# this function is to create within the notional grid. plot_number 
# starts at 1, increments across rows first and has a maximum of nrows * ncols.
fig = plt.figure()
# Is it possible to decoupling this part? 
ax = fig.add_subplot(111)

def queryimg64(request):
    from django.http import HttpResponse
    print "Query invoked"
    linkid=request.GET["linkid"]
    intervalid=int(request.GET["intervalid"])
    print linkid
    print intervalid
    axplot(fetchdata(linkid)[intervalid][1],linkid,intervalid,ax)
    print "Finished with plot"
    # fig.savefig(response)
    sio = StringIO()
    fig.savefig(sio, format="png")
    response=HttpResponse(sio.getvalue().encode("base64").strip(),content_type='image/png')
    print "Print image"
    return response

def queryimg(request):
    from django.http import HttpResponse
    print "Query invoked"
    linkid=request.GET["linkid"]
    intervalid=int(request.GET["intervalid"])
    print linkid
    axplot(fetchdata(linkid)[intervalid][1],linkid,intervalid,ax)
    print "Finished with plot"
    response=HttpResponse(content_type='image/png')
    fig.savefig(response)
    print "Print image"
    return response
    
def fetchdata(linkid):
    from django.db import connection
    cursor=connection.cursor()
    querystring="SELECT interval_index,samples as data FROM network_ltt WHERE link_id= LINKID order by interval_index"
    querystring=querystring.replace("LINKID",str(linkid))
    cursor.execute(querystring)
    records = cursor.fetchall()
    return records 
    

    


