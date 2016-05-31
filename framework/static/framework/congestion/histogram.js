
//Create slider for histgram
$("#hist-slider").slider({
	value: 360,
	min: 0,
	max: 24*60-30,
	step: 30,
	slide: updateHistTime,
});  
var currentIntervalIndex=12;

//This one is used in the clickfeature function
function getIntervalIndex(){
    return currentIntervalIndex;
}

setTimeLabel(360,390,$("#hist-time"));

function updateHistTime( event, ui ) {
		setTimeLabel(ui.value,ui.value+30,$("#hist-time"));
		currentIntervalIndex=ui.value/30;
		if(rawdata){
            var values = rawdata[getIntervalIndex()].data;
            updateChart(values);
		}
};

// redraw the histogram when the window is resized
$(window).on("resize", function() {
	if(rawdata){
		var values = rawdata[getIntervalIndex()].data;
		updateChart(values);
	}
});

// draw charts based on values
function percentile(arr, p) {
    if (arr.length === 0) return 0;
    if (typeof p !== 'number') throw new TypeError('p must be a number');
    if (p <= 0) return arr[0];
    if (p >= 1) return arr[arr.length - 1];

    var index = arr.length * p,
        lower = Math.floor(index),
        upper = lower + 1,
        weight = index % 1;

    if (upper >= arr.length) return arr[lower];
    return arr[lower] * (1 - weight) + arr[upper] * weight;
}

function drawChart(values){
	var vw = window.innerWidth/100;
    var formatCount = d3.format(",.0f");
    // when the transition is slower than the loading, the histogram can be small, so the bug is fixed below
    var histwidth=window.innerWidth*0.4-parseInt($("#histogram").css("padding-right").replace("px", ""))*2;
	
    var margin = {top: 0, right: 20, bottom: 40, left: 20},
        width =  histwidth- margin.left - margin.right,
        height = $("#histogram").height()- margin.top - margin.bottom;
    
    var x = d3.scale.linear()
        .domain([0, 140])
        .range([0, width]);
    // var per95 = percentile(values.sort(function(a, b){return a-b;}),0.95);
    // var x = d3.scale.linear()
        // .domain([0, Math.max(Math.ceil(per95),140)])
        // .range([0, width]);
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(28))
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
		.attr("id","hist-svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
		//.attr("viewBox","0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom))
		//.attr("preserveAspectRatio","xMidYMid")
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
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height + margin.bottom)
    .text("Link travel time (seconds)"); 
    svg.append("text")
    .attr("class", "y_label")
    .attr("text-anchor", "end")
    .attr("x",2*vw)
    .attr("y", 0.2*vw)
    .attr("dy", "0.75em")
    //.attr("transform", "rotate(-90)")
    .text("Count");
}

function updateChart(values){
    var svg= d3.select("#histogram").select("svg").remove();
    drawChart(values);
}