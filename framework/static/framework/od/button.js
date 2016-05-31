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
			"/querypathV1", 
			{	
				lng1: originMarker.getLatLng().lng,
				lat1: originMarker.getLatLng().lat,
				lng2: destinationMarker.getLatLng().lng,
				lat2: destinationMarker.getLatLng().lat,
			},
			function( data ) {
				loadGeoJson(data);
				$("#length").text(data.properties.f1/1000+" km");
				currentPath=data.properties.f2;
				drawChart(data.properties.f3);
				search=false;
				finishLoading();
				$('#pickcheck').prop('checked', false).trigger("change");
			}				
		);
	}
});

var currentPath;
function estimateDepart(){
	t=$('#timepicker').datetimepicker('getDate');
	interval=t.getHours()*2+Math.floor(t.getMinutes()/30);
	rtt=currentdata[interval];
	console.log("interval: "+interval+" RTT :"+ rtt);
	departtime=t-Math.floor(rtt)*1000;
	return new Date(departtime);	
}
$("#rttresult").hide();
$("#estimate").on('click', function (e){
	result=estimateDepart();
	$("#rttresult").show();
	$("#departtime").text(result.toTimeString().split(" ")[0]);
});
