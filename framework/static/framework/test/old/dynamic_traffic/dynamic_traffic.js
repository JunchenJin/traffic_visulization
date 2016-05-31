$(function()
{ 
	//Create a map object by selecting the div and latlog	
	var map = L.map('TB-map-canvas').setView([59.2492258,17.8641377], 11);
	
	//Add a layer to the map
	L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
	}).addTo(map);
	
	var shadowColor='#A901DB';
	
	//function getColor(d) {
			//switch(d) {
				//case 5:
					//return '#d7191c';
					//break;
				//case 4:
					//return '#fdae61';
					//break;
				//case 3:
					//return '#ffffbf';
					//break;
				//case 2:
					//return '#a6d96a';
					//break;
				//case 1:
					//return '#1a9641';
					//break;
				//default:
					//return '#FD8D3C' ;
		//}	
	//}
	
	function getColor(d) {
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
					break;
		}	
	}	

	var speed_legend=[8,15,20];
	var colors=["red","white","green"]
	function getColorV2(d) {
			if (d<speed_legend[0]) { return getColor(colors[0]) } else
			if (d<speed_legend[1]) { return getColor(colors[1]) } else
			return getColor(colors[2]);}
	
	var legend = L.control({position: 'bottomright'});
	
    legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
		labels = ["Heavy","Light","Free"];
		div.innerHTML+='<b>Congestion Level<b><br>'
			
		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < speed_legend.length; i++) {
			div.innerHTML +=
				'<i style="background:' + getColor(colors[i]) + '"></i> ' +labels[i]
				+ '<br>';
		}
		return div;		
	};

    legend.addTo(map);

	
	var index =0;
	//the function below is called for each feature;
	function style(feature) {
		//var speedlevelarray=feature.properties.speedarray.replace(/[{()}]/g, '').split(',');
		//var currentspeedlevel=parseInt(speedlevelarray[index]);
		var tt_array=feature.properties.f2;
		var current_tt=parseInt(tt_array[index]);
		return {
			color: getColorV2(current_tt),
			weight: 5,
			opacity: 1,
			dashArray: '1',
		};
	}
	//function shadowstyle(feature) {
		//var speedlevelarray=feature.properties.speedarray.replace(/[{()}]/g, '').split(',');
		//var currentspeedlevel=parseInt(speedlevelarray[index]);
		//return {
			//color: shadowColor,
			//weight: currentspeedlevel*currentspeedlevel,
			//opacity: 0.5,
			//dashArray: '1',
		//};
	//}
	

	$.getJSON( "/framework/queryspeed", function( data ) {
		//shadowLayer=L.geoJson(data, {
			//style: shadowstyle
		//})
		//shadowLayer.addTo(map);
		GeoJsonLayer=L.geoJson(data, {
			style: style
		})
		GeoJsonLayer.addTo(map);
		//var overlayLayers = {
			//"Speed": GeoJsonLayer,
			////"Weight":shadowLayer,
		//};
		//L.control.layers(null, overlayLayers).addTo(map);
	  });
	
	function updatestyle(cursor_value) {
		//convert difference the cursor to starttime into step
		index=(cursor_value-starttime)/tickLen;		
		//if(index>=24) {index=0;}
		//else {index+=1;}
		GeoJsonLayer.setStyle(style);	
		//shadowLayer.setStyle(shadowstyle);
	}	
	
	// The values below are designed to calculate the index to use in the geojson.
	var d = new Date(2015, 4, 20, 0, 0, 0, 0);
	var n = d.valueOf();
	var starttime=n;
	var duration=24*3600*1000;
	var tickLen = 1800*1000;
	var timestep =500;
	
	
    var playbackOptions = {        
		cursor:n,
		starttime:n,
		endtime:n+duration,
		tickLen: tickLen,
		speed: 1,
		timestep:timestep,
    };
    // Initialize playback
    var playback = new L.Playback(map, updatestyle, playbackOptions);    
    // Initialize custom control including slider, callback functions	
    var control = new L.Playback.Control(playback);
    control.addTo(map);		
	
	
});
