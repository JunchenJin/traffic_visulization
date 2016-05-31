//$("#time-slider").slider({
        //range: true,
        //min: 0,
        //max: 1439,
        //values: [540, 1020],
        //slide: slideTime
    //});
var currentIntervalIndex=12;
$("#time-slider").slider({
        value: 360,
        min: 0,
        max: 24*60-30,
        step: 30,
        slide: function( event, ui ) {
            setTimeLabel(ui.value,ui.value+30);
            currentIntervalIndex=ui.value/30;
            if(rawdata){
            values = rawdata[getIntervalIndex()].data;
            updateChart(values);}
        }
    });
    

setTimeLabel(360,390);


function getIntervalIndex(){
    return currentIntervalIndex;
}


function setTimeLabel(value0, value1){
    minutes0 = parseInt(value0 % 60, 10),
        hours0 = parseInt(value0 / 60 % 24, 10),
        minutes1 = parseInt(value1 % 60, 10),
        hours1 = parseInt(value1 / 60 % 24, 10);
    startTime = getTime(hours0, minutes0);
    endTime = getTime(hours1, minutes1);
    $("#time").text(startTime+':00 ' + ' - ' + endTime+':00 ');
}

function getTime(hours, minutes) {
    //var time = null;
    hours = hours+ "";
    minutes = minutes + "";
    //if (hours < 12) {
        //time = "AM";
    //}
    //else {
        //time = "PM";
    //}
    //if (hours == 0) {
        //hours = 12;
    //}
    //if (hours > 12) {
        //hours = hours - 12;
    //}
    if (hours.length == 1){
        hours = "0" + hours;
    }
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
}

var rawdata;

function getdata(){
    return values;
}


//$.getJSON( "/static/data/tt_daily.json", function( response) { 
    //rawdata=response;
    //values = rawdata[getIntervalIndex()].data;
    //drawChart(values);
//})

function drawChart(values){
    var formatCount = d3.format(",.0f");
    
    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    var x = d3.scale.linear()
        .domain([0, 140])
        .range([0, width]);
    
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(30))
        (values);
    
    //var y = d3.scale.linear()
        //.domain([0, d3.max(data, function(d) { return d.y; })])
        //.range([height, 0]);
    var y = d3.scale.linear()
        .domain([0, 200])
        .range([height,0]);    
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var svg = d3.select("#histogram").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
    
    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); });
    
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);    
    svg.append("text")
    .attr("class", "x_label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 30)
    .text("Travel Time (seconds)"); 
    svg.append("text")
    .attr("class", "y_label")
    .attr("text-anchor", "end")
    .attr("x",30)
    .attr("y", 6)
    .attr("dy", "0.75em")
    //.attr("transform", "rotate(-90)")
    .text("Count");
}

function updateChart(values){
    var svg= d3.select("#histogram").select("svg").remove();
    drawChart(values);
}