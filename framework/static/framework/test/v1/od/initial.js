
//Create a map object by selecting the div and latlog	
//Create a map object by selecting the div and set the center and zoom level.

// Mark the link as active

 
var map = L.map('map').setView([59.2492258,17.8641377], 11);

//Add a layer to the map
startLoading();
L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'examples.map-i875mjb7'
}).addTo(map).on('load', finishLoading); 

function startLoading(){
	$("#loader").show();
}	

function finishLoading(){
	$("#loader").hide();
}	
$('#timepicker').val("08:00:00");
$('#timepicker').timepicker({"timeFormat":"HH:mm:ss","showSecond":false});