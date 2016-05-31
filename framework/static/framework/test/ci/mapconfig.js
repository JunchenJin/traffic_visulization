// Two global variables are needed: currentLayer and currentIndex
// a global state object can be defined containing: current layer,index,legend,style


function baselayerchange(e){
    currentLayer=e.layer;
    currentConfig=currentLayer.options.config;
    updatestyle(currentIndex);
    this.removeControl(legend);
    legend.onAdd = function (map) {
		return updateLegend(currentConfig);
	};
	legend.addTo(map);	
    console.log("current layer is "+e.name);
}

function updateMap(value,sliderobj){
	currentIndex=value/sliderobj.option.step;
	updatestyle(currentIndex);
	$("#timelabelformap").text(getInterval(value0/30,sliderobj.option.step));	
}

	//Create a function to load data from database to GeoJsonLayer 

//Define the style for features 
function style(feature) {
	var value_array=feature.properties.f2;
	var current_speed=value_array[currentIndex];
	return {
		color: currentConfig.getColorFromValue(current_speed),//colors are set below
		weight: 5,
		opacity: 1,
		dashArray: '1',
	};
}
//update the style of map, used by slider
function updatestyle(value) {
	currentLayer.setStyle(style);	
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

var speed_legend=[8,15,20];
var colors=["red","orange","brown","green"];
var labels = ["Heavy","Midium","Light","Free"];
function getColorBySpeed(d) {
		if (d<speed_legend[0]) { return getColorByName(colors[0]) } else
		if (d<speed_legend[1]) { return getColorByName(colors[1]) } else
		if (d<speed_legend[2]) { return getColorByName(colors[2]) } else
		return getColorByName(colors[3]);
}
	
	
	
// Design the legend of the map


// Add listeners pop up the id for each feature on the map
function onEachFeature(feature, layer) {
	var popupContent = "ID: " + feature.properties.f1;
	layer.bindPopup(popupContent);
	layer.on({click: clickFeature});
}
var currentSelectedFeature;

// When clicking a feature, show the histogram
function clickFeature(e) {
	clickedFeature = e.target;
	currentSelectedFeature=clickedFeature;
	var link_id=currentSelectedFeature.feature.properties.f1;
	$("#currentID").text(link_id);
	
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
		"/framework/fetchtt", 
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