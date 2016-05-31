//Create a map object by selecting the div and set the center and zoom level. 
var map = L.map('map').setView([59.2492258,17.8641377], 11);

/*
//Add a base layer to the map
L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
*/
L.esri.basemapLayer('Gray').addTo(map);
L.esri.basemapLayer('GrayLabels').addTo(map);
//Add a GeoJson layer, function is defined in mapconfig.js
$.getJSON( "/queryspeed", 
	function( data ) {
		loadGeoJson(data);
	}
);




