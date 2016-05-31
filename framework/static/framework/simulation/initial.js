$(function() {
	// Setup leaflet map
	var map = new L.Map('map');

	var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

	// Center map and default zoom level
	map.setView([59.2492258,17.8641377], 11);

	// Adds the background layer to the map
	map.addLayer(basemapLayer);

	// Colors for AwesomeMarkers
	var _colorIdx = 0,
	    _colors = ['orange', 'green', 'blue', 'purple', 'darkred', 'cadetblue', 'red', 'darkgreen', 'darkblue', 'darkpurple'];

	function _assignColor() {
		return _colors[_colorIdx++ % 10];
	}

	// =====================================================
	// =============== Playback ============================
	// =====================================================

	// Playback options
	var playbackOptions = {
		// layer and marker options
		layer : {
			pointToLayer : function(featureData, latlng) {
				var result = {};

				if (featureData && featureData.properties && featureData.properties.path_options) {
					result = featureData.properties.path_options;
				}

				if (!result.radius) {
					result.radius = 5;
				}

				return new L.CircleMarker(latlng, result);
			}
		},

		marker : function() {
			return {
				icon : L.AwesomeMarkers.icon({
					prefix : 'fa',
					icon : 'truck',
					markerColor : _colors[0]//_assignColor()
				})
			};
		},
		legend:{
			0:'orange',
			1:'green'
		}
	};
	var develop = true;
	if (develop) {
		$.ajax({
			xhrFields : {
				withCredentials : true
			},
			type : "GET",
			url : "http://localhost:8080/simulation-3/resource/testjson"
			//The url below does not work as the CORS header is not set when the service is published in 
			//java embeded httpserver
			//url: "http://localhost:9876/resource/testjson"
		}).done(function(data) {
			// Initialize playback
			var playback = new L.Playback(map, data.features, null, playbackOptions);

			// Initialize custom control
			var control = new L.Playback.Control(playback);
			control.addTo(map);
		});
	} else {
		// Initialize playback
		var playback = new L.Playback(map, demoTracks, null, playbackOptions);

		// Initialize custom control
		var control = new L.Playback.Control(playback);
		control.addTo(map);

		// Add data
		playback.addData(blueMountain);
	}

});
