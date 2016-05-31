from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def simulation(request):
    return render(request,"simulation/simulation.html")