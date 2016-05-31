
//Create a map object by selecting the div and latlog	
//Create a map object by selecting the div and set the center and zoom level.

// Mark the link as active

 
var map = L.map('map').setView([59.2492258,17.8641377], 11);

//Add a layer to the map
startLoading();
L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', { attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: 'abcd', id: 'gowithwind.1684dc1d', accessToken: 'pk.eyJ1IjoiZ293aXRod2luZCIsImEiOiJjZTFmZmZiZWYyYWJiNTRlZDgxYWMyYTJlYTZkMWQxNSJ9.jbuk1tFa1ICaDhVJE2flLw' }).addTo(map).on('load', finishLoading); 


function startLoading(){
	$("#loader").show();
}	

function finishLoading(){
	$("#loader").hide();
}	
$('#timepicker').val("08:00:00");
$('#timepicker').timepicker({"timeFormat":"HH:mm:ss","showSecond":false});