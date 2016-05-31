var GeoJsonLayer;
	
function getGeoJsonLayer(){
	return GeoJsonLayer;	
}

	//Create a function to load data from database to GeoJsonLayer 
function loadGeoJson(data){
	GeoJsonLayer=L.geoJson(data, {
		style:style,
		onEachFeature:onEachFeature
	});
	GeoJsonLayer.addTo(map);
}


var index =0;

function getCurrentIndex() {
	return index;
}

function setIndex(value) {
	index= value
}
	
//Define the style for features 
function style(feature) {
	var speed_array=feature.properties.f2;
	var current_speed=parseInt(speed_array[getCurrentIndex()]);
	return {
		color: getColorBySpeed(current_speed),//colors are set below
		weight: 5,
		opacity: 1,
		dashArray: '1',
	};
}
//update the style of map, used by slider
function updatestyle(value) {
	setIndex(value);	
	GeoJsonLayer.setStyle(style);	
}


// Define functions to return color by name and speed level
function getColorByName(d) {
		switch(d) {
			case "red":
				return '#FF0000';
				break;
			case "white":
				return '#ffffbf';
				break;
			case "green":
				return '#00CC00';
				break;
			case "orange":
				return '#fd8d3c';
			case "brown":
				return '#CCCC00';	
				break;
	}	
}	

var speed_legend=[30,50,72];
var colors=["red","orange","brown","green"];
//var labels = ["Heavy","Midium","Light","Free"];
var labels = ["0 - 30","30 - 54","54 - 72","72 +"];
function getColorBySpeed(d) {
		if (d<speed_legend[0]) { return getColorByName(colors[0]) } else
		if (d<speed_legend[1]) { return getColorByName(colors[1]) } else
		if (d<speed_legend[2]) { return getColorByName(colors[2]) } else
		return getColorByName(colors[3]);
}
	
	
	
// Design the legend of the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend');
	
	//div.innerHTML+='<b>Congestion Level<b><br>';
	div.innerHTML+='<b>Speed Unit:km/h<b><br>';	
	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < labels.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getColorByName(colors[i]) + '"></i> ' +labels[i]
			+ '<br>';
	}
	return div;		
};

legend.addTo(map);


// Add listeners pop up the id for each feature on the map
function onEachFeature(feature, layer) {
	var popupContent = "ID: " + feature.properties.f1;
	layer.bindPopup(popupContent);
	layer.on({click: clickFeature})
}
var currentSelectedFeature;

// When clicking a feature, show the histogram
function clickFeature(e) {
	clickedFeature = e.target;
	/*
	if(currentSelectedFeature){
		currentSelectedFeature._path.setAttribute("marker-start","");
		currentSelectedFeature._path.setAttribute("marker-end","");
	}

	currentSelectedFeature._path.setAttribute("marker-start","url(#markerCircle)");
	currentSelectedFeature._path.setAttribute("marker-end","url(#markerCircle)");
	*/
	currentSelectedFeature=clickedFeature;	
	var link_id=currentSelectedFeature.feature.properties.f1;
	
	//Show the menu if it is hidden
	if(!$("#menu").hasClass('toggled')) {
		toggleMenu();
	}
	
	$("#currentID").text(link_id);
	if(d3.select("#histogram").select("svg")){
				d3.select("#histogram").select("svg").remove();
	}
	$( "#histogram" ).addClass("loading");
	$.getJSON( 
		"/fetchtt", 
		{	
				link_id: link_id
		},
		function( response) { 
			$( "#histogram" ).removeClass("loading");
			rawdata=response;
			values = rawdata[getIntervalIndex()].data;
			updateChart(values);
		});
}