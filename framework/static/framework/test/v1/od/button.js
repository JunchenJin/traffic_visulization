$('#clear').on('click', function (e) {
	if(originMarker){
		map.removeLayer(originMarker);
		originMarker=null;	
	}
	if(destinationMarker){
		map.removeLayer(destinationMarker);
		destinationMarker=null;	
	}
	if(GeoJsonLayer){
		map.removeLayer(GeoJsonLayer);
		GeoJsonLayer=null;	
	}
	$("#linechart").html("");
	$("#length").text("");
	currentdata=null;	
});

//this is a variable to determine whether the menu is toggled by click search button
var search=false;

$('#search').on('click', function (e) {
	if(!originMarker||!destinationMarker){alert("Select OD first!"); }
	else{
		search=true;
		if(GeoJsonLayer){
			map.removeLayer(GeoJsonLayer);		
		}
		if(!$("#menu").hasClass('toggled')) {
			toggleMenu();
		}
		startLoading();
		$.getJSON( 
			"/framework/querypathV1", 
			{	
				lng1: originMarker.getLatLng().lng,
				lat1: originMarker.getLatLng().lat,
				lng2: destinationMarker.getLatLng().lng,
				lat2: destinationMarker.getLatLng().lat,
			},
			function( data ) {
				loadGeoJson(data);
				$("#length").text(data.properties.f1/1000+" km");
				
				console.log(idarray=data.properties.f2);
				drawChart(data.properties.f3);
				search=false;
				finishLoading();
				$('#pickcheck').prop('checked', false).trigger("change");				
			}				
		);
	}
});
