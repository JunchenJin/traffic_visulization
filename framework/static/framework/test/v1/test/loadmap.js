//Create a map object by selecting the div and set the center and zoom level. 
var map = L.map('map').setView([59.2492258,17.8641377], 11);


//Add a base layer to the map
L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'examples.map-i875mjb7'
}).addTo(map);

//Add a GeoJson layer, function is defined in mapconfig.js

$.getJSON("/framework/queryspeed", function(data) {
	loadGeoJson(data);
}); 
var option ={
		value: 0,
		min: 0,
		max: 24*60-30,
		step: 30,
};
var timeslider=new Customslider($("#time-slider"),option,$("#time"),updateTime);
timeslider.addlistener(updateMap);

function updateMap(value,sliderobj){
	updatestyle(value/sliderobj.option.step);	
}
