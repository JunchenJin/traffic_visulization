$(function()
{ 
	//Create a map object by selecting the div and latlog	
	var map = L.map('LR-map-canvas').setView([59.3294,18.0686], 13);
	
	
	//two variables to store the positions
	var originMarker;
	var destinationMarker;
	var GeoJsonLayer;
	
	
	//Add a layer to the map
	L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
	}).addTo(map);	
	
	function addMarker(e){
		if($('#pickcheck').is(':checked')){
			if (getODState())
				{	
					if(!originMarker) {
						originMarker = new L.marker(e.latlng,{icon: OriginIcon}).addTo(map);
					} else {
						originMarker.setLatLng(e.latlng);	
					}	
					
							
				}
			else
				{
					if(!destinationMarker) {
					destinationMarker = new L.marker(e.latlng,{icon: DestinationIcon}).addTo(map);
					} else {
						destinationMarker.setLatLng(e.latlng);	
					}
				}
		}
		map.removeLayer(GeoJsonLayer);
		
	}
	
	map.on('click', addMarker);
	
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
	function style(feature) {
		var pathid=feature.properties.f1;		
		return {
			color: getColor(parseInt(pathid)),
			weight: 6,
			opacity: 0.5,
			dashArray: '1',
		};
	}
	
	var legend = L.control({position: 'topright'});
	
	
    legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
		grades = [1,2,3,4,5];
		labels = [];
			
		div.innerHTML+='<b>Legend<b><br>';
		div.innerHTML+='<i  class="fa fa-map-marker  fa-2x oid"></i>Origin<br>';
		div.innerHTML+='<i  class="fa fa-map-marker  fa-2x did"></i>Destination<br>';
		

		return div;		
	};
		
    legend.addTo(map);	
	
	function loadGeoJson(data){
		GeoJsonLayer=L.geoJson(data, {
			style: style
		})
		GeoJsonLayer.addTo(map);
	}
	
	$('#clear').on('click', function (e) {
		map.removeLayer(originMarker);
		map.removeLayer(destinationMarker);
		map.removeLayer(GeoJsonLayer);
		originMarker=null;
		destinationMarker=null;
    });
	
	//var rlayer = null;
	//var line;
	$('#search').on('click', function (e) {
		$.getJSON( 
			"/framework/querypath", 
			{	
				lng1: originMarker.getLatLng().lng,
				lat1: originMarker.getLatLng().lat,
				lng2: destinationMarker.getLatLng().lng,
				lat2: destinationMarker.getLatLng().lat,
			},
			function( data ) {
				loadGeoJson(data);				
			}				
		);
		
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
