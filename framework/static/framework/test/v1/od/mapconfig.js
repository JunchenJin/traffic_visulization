//two variables to store the positions
var originMarker;
var destinationMarker;
var GeoJsonLayer;
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
		if(GeoJsonLayer){
			map.removeLayer(GeoJsonLayer);
		}	
	}
	
	
}

map.on('click', addMarker);


var legend = L.control({position: 'bottomright'});


legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend');
	div.innerHTML+='<label>Legend</label><br>';
	div.innerHTML+='<i  class="fa fa-map-marker  fa-3x oid"></i><label>Origin</label><br>';
	div.innerHTML+='<i  class="fa fa-map-marker  fa-3x did"></i><label>Destination</label><br>';
	return div;		
};
	
legend.addTo(map);	

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
			case "blue":
				return '#3300CC';	
				break;
	}	
}	

	function style(feature) {
		var pathid=feature.properties.f1;		
		return {
			color: getColorByName("blue"),
			weight: 6,
			opacity: 0.5,
			dashArray: '1',
		};
	}

function loadGeoJson(data){
	GeoJsonLayer=L.geoJson(data, {
		style: style
	});
	GeoJsonLayer.addTo(map);
}



var OriginIcon = L.icon({
		iconUrl: '/static/v1/img/origin.png',

		iconSize:     [25, 39], // size of the icon
		iconAnchor:   [12.5, 39], // point of the icon which will correspond to marker's location
});
	
var DestinationIcon = L.icon({
		iconUrl: '/static/v1/img/destination.png',

		iconSize:     [25, 39], // size of the icon
		iconAnchor:   [12.5, 39], // point of the icon which will correspond to marker's location
});

//two variables to store the positions
var origin;
var destination;


$('#pickcheck').change(function () {
    if ($('#pickcheck').is(':checked')) {
        $('#od-trigger').bootstrapToggle('enable');		
    } else {
		$('#od-trigger').bootstrapToggle('disable');
    }
});

var o_selected = true;	

function getODState() {
	return this.o_selected;
	};

$('#od-trigger').change(function () {
	//this is the value after the button after switch
    if ($('#od-trigger').is(':checked')) {
		o_selected = true;
    } else {
		o_selected = false;
    }
});


