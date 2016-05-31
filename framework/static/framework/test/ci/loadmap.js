//Create a map object by selecting the div and set the center and zoom level. 
var map = L.map('map').setView([59.2492258,17.8641377], 11);
var currentLayer;
var currentIndex=0;
var colors=['#FF0000','#fd8d3c','#CCCC00','#38A800'];
var colors2=colors.slice(0).reverse();
var ciconfigoption1={"name":"Speed","splitvalues":[0,30,54,72],"colors":colors,"unit":"km/h"};
var ciconfigoption2={"name":"TTI:ttavg/ttfree","splitvalues":[0,1,1.5,3],"colors":colors2,"unit":""};
var ciconfigoption3={"name":"SPI:spavg/splimit","splitvalues":[0,0.4,0.6,0.8],"colors":colors,"unit":""};
var ciconfigoption4={"name":"PTI:tt95/ttfree","splitvalues":[0,3,6,9],"colors":colors2,"unit":""};
var ciconfigoption5={"name":"BFI:tt95/ttavg","splitvalues":[0,1.3,1.7,2.2],"colors":colors2,"unit":""};



config1 =new CIconfig(ciconfigoption1);
config2 =new CIconfig(ciconfigoption2);
config3 =new CIconfig(ciconfigoption3);
config4 =new CIconfig(ciconfigoption4);
config5 =new CIconfig(ciconfigoption5);


var currentConfig=config1;
//Add a base layer to the map

//for (var i = 0; i < config1.option.splitvalues.length; i++) {
	//	$("#ci1spinner"+(i+1)).val(config1.option.splitvalues[i+1]);		
//}

L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', { attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: 'abcd', id: 'gowithwind.1684dc1d', accessToken: 'pk.eyJ1IjoiZ293aXRod2luZCIsImEiOiJjZTFmZmZiZWYyYWJiNTRlZDgxYWMyYTJlYTZkMWQxNSJ9.jbuk1tFa1ICaDhVJE2flLw' }).addTo(map);

//L.esri.basemapLayer('Gray').addTo(map);
/*
        var host = 'http://{s}.maps.omniscale.net/v2/{id}/style.grayscale/{z}/{x}/{y}.png';

        var attribution = '&copy; 2015 &middot; <a href="http://maps.omniscale.com/">Omniscale</a> ' +
            '&middot; Map data: <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
          L.tileLayer(host, {
            id: 'your-api-key',
            attribution: attribution
          }).addTo(map);
*/
        map.attributionControl.setPrefix(false);
//Add a GeoJson layer, function is defined in mapconfig.js
$.when($.getJSON("/framework/queryspeed"), 
$.getJSON("/framework/querytti"),
$.getJSON("/framework/queryspi"),
$.getJSON("/framework/querypti"),
$.getJSON("/framework/querybfi")
).then(function (resp1, resp2,resp3,resp4,resp5) {
    var GeoJsonLayer=L.geoJson(resp1, {
		style:style,
		onEachFeature:onEachFeature,
		"config":config1
	});
	var GeoJsonLayer2=L.geoJson(resp2, {
		style:style,
		onEachFeature:onEachFeature,
		"config":config2
	});
	var GeoJsonLayer3=L.geoJson(resp3, {
		style:style,
		onEachFeature:onEachFeature,
		"config":config3
	});
	var GeoJsonLayer4=L.geoJson(resp4, {
		style:style,
		onEachFeature:onEachFeature,
		"config":config4
	});
	var GeoJsonLayer5=L.geoJson(resp5, {
		style:style,
		onEachFeature:onEachFeature,
		"config":config5
	});
	
	// we cannot directly assign a variable to a key so we did it in that way
	var baselayers={};
	baselayers[GeoJsonLayer.options.config.option.name]=GeoJsonLayer;
	baselayers[GeoJsonLayer2.options.config.option.name]=GeoJsonLayer2;
	baselayers[GeoJsonLayer3.options.config.option.name]=GeoJsonLayer3;
	baselayers[GeoJsonLayer4.options.config.option.name]=GeoJsonLayer4;
	baselayers[GeoJsonLayer5.options.config.option.name]=GeoJsonLayer5;			
	L.control.layers(baselayers,null,{position: 'topleft'}).addTo(map);
	GeoJsonLayer.addTo(map);
});
/*
$.getJSON("/framework/queryspeed", function(data) {
	var GeoJsonLayer=L.geoJson(data, {
		style:style,
		onEachFeature:onEachFeature,
		"config":config1
	});
	var GeoJsonLayer2=L.geoJson(data, {
		style:style,
		onEachFeature:onEachFeature,
		"config":config2
	});
	
	// we cannot directly assign a variable to a key so we did it in that way
	var baselayers={};
	baselayers[GeoJsonLayer.options.config.option.name]=GeoJsonLayer;
	baselayers[GeoJsonLayer2.options.config.option.name]=GeoJsonLayer2;	
	L.control.layers(baselayers).addTo(map);
	GeoJsonLayer.addTo(map);
}); 
*/
var option ={
		value: 0,
		min: 0,
		max: 24*60-30,
		step: 30,
};
var timeslider=new Customslider($("#time-slider"),option,$("#time"),updateTime);
timeslider.addlistener(updateMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
	return updateLegend(currentConfig);
};
legend.addTo(map);


map.on('baselayerchange', baselayerchange);
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Time Period</h4>' +  ('<h4 id="timelabelformap"></h4>');
};

info.addTo(map);
$("#timelabelformap").text(getInterval(0,30));







$(document).keydown(function(e) {
    switch(e.which) {

        case 83: // up
        	$("#footer").show();
        break;

        case 65: 
        	$("#footer").hide(); 
        // down
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});



