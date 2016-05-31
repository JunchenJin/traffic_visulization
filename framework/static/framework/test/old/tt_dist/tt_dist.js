$(function()
{ 
	//Create a map object by selecting the div and latlog	
	var map = L.map('LR-map-canvas').setView([59.3043292,18.0003342], 11);
	
	
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
	
	function getColor(d) {
			switch(d) {
				case 0:
					return '#e66101';
					break;
				case 1:
					return '#5e3c99';
					break;
				case 2:
					return '#1a9641';
					break;
				default:
					return '#FD8D3C' ;
		}	
	}
	
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
		if(currentSelectedFeature){
			currentSelectedFeature.setStyle(defaultStyle);
		}
		clickedFeature = e.target;
		currentSelectedFeature=clickedFeature;
		clickedFeature.setStyle(highlightStyle);
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
			style:defaultStyle,
			onEachFeature:onEachFeature
		});
		GeoJsonLayer.addTo(map);
	}
	
	//var rlayer = null;
	//var line;

	$.getJSON( 
		"/framework/fetchnetwork", 
		function( data ) {
			loadGeoJson(data);				
		}				
	)
	
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
