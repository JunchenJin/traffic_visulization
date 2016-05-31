//This script is used for the demo application where historical histogram is drawn

$('#clear').on('click', function(e) {
    if (originMarker) {
        map.removeLayer(originMarker);
        originMarker = null;
    }
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }
    if (GeoJsonLayer) {
        map.removeLayer(GeoJsonLayer);
        GeoJsonLayer = null;
    }
    $("#linechart").html("");
    $("#histogram").html("");
    $("#length").text("");
    currentdata = null;
    histdata=null;
});

//this is a variable to determine whether the menu is toggled by click search button
var search = false;

$('#search').on('click', function(e) {
    if (!originMarker || !destinationMarker) {
        alert("Select OD first!");
    } else {
        search = true;
        if (GeoJsonLayer) {
            map.removeLayer(GeoJsonLayer);
        }
        if (!$("#menu").hasClass('toggled')) {
            toggleMenu();
        }
        startLoading();
        $.getJSON("/querypathV1", {
            lng1 : originMarker.getLatLng().lng,
            lat1 : originMarker.getLatLng().lat,
            lng2 : destinationMarker.getLatLng().lng,
            lat2 : destinationMarker.getLatLng().lat,
        }, function(data) {
            loadGeoJson(data);
            $("#length").text(data.properties.f1 / 1000 + " km");
            currentPath = data.properties.f2;
            search = false;
            finishLoading();
            $('#pickcheck').prop('checked', false).trigger("change");
            drawChart(data.properties.f3);
            $.getJSON("/queryrtthistorical", {
                linkids : JSON.stringify(currentPath)
            }, function(response) {
                histdata = response;
                updateHist(histdata);
            });
        });
    }
});

$('#tabs a').click(function(e) {
    e.preventDefault();
    $(this).tab('show');
    if ($(this).attr("href")=="#tab2") {
        console.log("Redraw histogram");
        if (histdata) {
        updateHist(histdata);
    }
    } else{
        console.log("Redraw line chart");
        updateChart();
    }
});

var currentPath;
function estimateDepart() {
    t = $('#timepicker').datetimepicker('getDate');
    interval = t.getHours() * 2 + Math.floor(t.getMinutes() / 30);
    rtt = currentdata[interval];
    console.log("interval: " + interval + " RTT :" + rtt);
    departtime = t - Math.floor(rtt) * 1000;
    return new Date(departtime);
}


$("#rttresult").hide();
$("#estimate").on('click', function(e) {
    result = estimateDepart();
    $("#rttresult").show();
    $("#departtime").text(result.toTimeString().split(" ")[0]);
});
