var OriginIcon = L.icon({
		iconUrl: '/static/img/origin.png',

		iconSize:     [25, 39], // size of the icon
		iconAnchor:   [12.5, 39], // point of the icon which will correspond to marker's location
});
	
var DestinationIcon = L.icon({
		iconUrl: '/static/img/destination.png',

		iconSize:     [25, 39], // size of the icon
		iconAnchor:   [12.5, 39], // point of the icon which will correspond to marker's location
});

//two variables to store the positions
var origin;
var destination;


$('#pickcheck').change(function () {
    if ($('#pickcheck').is(':checked')) {
        $('#od-trigger').bootstrapToggle('enable');
		console.log("is checked");
    } else {
		console.log("is not checked");
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
	console.log("origin selected ?",getODState());
});

