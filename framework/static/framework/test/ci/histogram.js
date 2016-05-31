var rawdata;
//Create slider for histgram
$("#hist-slider").slider({
	value: 360,
	min: 0,
	max: 24*60-30,
	step: 30,
	slide: updateHistTime,
});  
var currentIntervalIndex=12;
$("#hist-time").text(getInterval(currentIntervalIndex,30));
var rawdata;

function getdata(){
    return values;
}
//This one is used in the clickfeature function
function getIntervalIndex(){
    return currentIntervalIndex;
}

function updateHistTime( event, ui ) {
		currentIntervalIndex=ui.value/30;
		$("#hist-time").text(getInterval(currentIntervalIndex,30));
		if(rawdata){
            var values = rawdata[currentIntervalIndex].data;
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
    .attr("x",40)
    .attr("y", 2.5)
    .attr("dy", "0.75em")
    //.attr("transform", "rotate(-90)")
    .text("Count");
}

function updateChart(values){
    var svg= d3.select("#histogram").select("svg").remove();
    drawChart(values);
}