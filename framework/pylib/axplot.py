from datetime import time
from scipy.stats import lognorm
import numpy as np

# the objective of this class is to decouple plot with save figure

numberofbin = 70
inputrange=(0,140)
def axplot(i_data,linkid,intervalindex,ax):
    ax.cla()
    ax.hist(i_data, numberofbin,inputrange,normed=1,label='original distribution')
    # start to fit
    shape,location,scale=lognorm.fit(i_data,floc=0)
    rv=lognorm(shape,location,scale)
    x=np.linspace(0,140,100)
    ax.plot(x, rv.pdf(x),             
             'r-', lw=5, alpha=0.6, label='lognorm fit')
    ax.set_title("Link id "+ str(linkid)+" and time Interval:  " + formatinterval(intervalindex))
    ax.set_xlabel('Travel Time (s)')
    ax.set_ylabel('Probability Density') 
    ax.legend()    
    # ax.get_figure().savefig(str(linkid)+" "+ str(intervalindex)+".png")
    
def formattime(index): 
    hour=index/2
    if hour>23 :
        hour=0
    minute=(index%2)*30
    t=time(hour,minute)
    return t.isoformat()

def formatinterval(index):
    return formattime(index)+" - "+formattime(index+1)   

