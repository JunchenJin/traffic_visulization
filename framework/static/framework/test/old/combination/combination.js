$(function()
{ 
	//Create a map object by selecting the div and latlog	
	var map = L.map('LR-map-canvas').setView([59.2492258,17.8641377], 11);
	

	//two variables to store the positions
	var GeoJsonLayer;
	
	//Add a layer to the map
	L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
	}).addTo(map);	
	var index =0;
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
	//function addMarker(e){
		//if($('#pickcheck').is(':checked')){
			//if (getODState())
				//{	
					//if(!originMarker) {
						//originMarker = new L.marker(e.latlng,{icon: OriginIcon}).addTo(map);
					//} else {
						//originMarker.setLatLng(e.latlng);	
					//}	
					
							
				//}
			//else
				//{
					//if(!destinationMarker) {
					//destinationMarker = new L.marker(e.latlng,{icon: DestinationIcon}).addTo(map);
					//} else {
						//destinationMarker.setLatLng(e.latlng);	
					//}
				//}
		//}
		//map.removeLayer(GeoJsonLayer);
	//}
	
	//map.on('click', addMarker);
	
	//function getColor(d) {
			//switch(d) {
				//case 0:
					//return '#e66101';
					//break;
				//case 1:
					//return '#5e3c99';
					//break;
				//case 2:
					//return '#1a9641';
					//break;
				//default:
					//return '#FD8D3C' ;
		//}	
	//}
	
	var defaultStyle = {
		color: '#2262CC', 
		width: 2,
		opacity: 0.8,
	};
	
	var highlightStyle = {
				color: '#FFCC00',
				weight: 5,
				opacity: 1,		
	
	}
	
	
	function onEachFeature(feature, layer) {
		var popupContent = "ID: " + feature.properties.f1;
		layer.bindPopup(popupContent);
		layer.on({click: clickFeature})
	}
	var currentSelectedFeature;
	
	
	function clickFeature(e) {
		//if(currentSelectedFeature){
			//currentSelectedFeature.setStyle(defaultStyle);
		//}
		clickedFeature = e.target;
		currentSelectedFeature=clickedFeature;
		//clickedFeature.setStyle(highlightStyle);
		var link_id=currentSelectedFeature.feature.properties.f1;
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
			})
	}				
	
	function loadGeoJson(data){
		GeoJsonLayer=L.geoJson(data, {
			style:style,
			onEachFeature:onEachFeature
		});
		GeoJsonLayer.addTo(map);
	}
	
	//var rlayer = null;
	//var line;
	function updatestyle(index_value) {
		//convert difference the cursor to starttime into step
		index=index_value;	
		//if(index>=24) {index=0;}
		//else {index+=1;}
		GeoJsonLayer.setStyle(style);	
		//shadowLayer.setStyle(shadowstyle);
	}	
$("#time-slider-congestion").slider({
        value: 0,
        min: 0,
        max: 24*60-30,
        step: 30,
        slide: f2,
    });  
function f2( event, ui ) {
        
        setTimeLabelCongestion(ui.value,ui.value+30);
        currentIntervalIndex=ui.value/30;
        updatestyle(currentIntervalIndex);
        };
		$.getJSON( "/framework/queryspeed", function( data ) {
		//shadowLayer=L.geoJson(data, {
			//style: shadowstyle
		//})
		//shadowLayer.addTo(map);
		loadGeoJson(data)
		//var overlayLayers = {
			//"Speed": GeoJsonLayer,
			////"Weight":shadowLayer,
		//};
		//L.control.layers(null, overlayLayers).addTo(map);
	  });
	
	//$('#search').on('click', function (e) {
		//var router = new L.Routing.OSRM();
		//waypoints=[]; 
		//waypoints.push ({latLng:originMarker.getLatLng()});
		//waypoints.push ({latLng:	destinationMarker.getLatLng()});
		//console.log(waypoints);
		//router.route ( waypoints
		//, function (err, routes) {
             //if (line) {
				//map.removeLayer (line); 
             //} 
             //if (err) {
                 //alert (err); 
             //} else {
                 //line = L.Routing.line(routes [0]).addTo(map);
				 //console.log(line);
             //} 
		//}); 	
    //});
	
});
