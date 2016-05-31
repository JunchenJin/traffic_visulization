customhistogram=function (div,option){
	this.div=div;
	this.option.margin={top: 0, right: 20, bottom: 40, left: 20};
	this.option.xmax=140;
	this.option.xmin=0;
	this.option.ymax=200;
	this.option.ymin=0;
	this.option.bins=28;
	
};

customhistogram.prototype.drawframe=function(){
	var vw = window.innerWidth/100;
    var formatCount = d3.format(",.0f");
    // when the transition is slower than the loading, the histogram can be small, so the bug is fixed below
    var histwidth=window.innerWidth*0.4-parseInt($("#histogram").css("padding-right").replace("px", ""))*2;
	
    var margin =this.option.margin,
        width =  histwidth- margin.left - margin.right,
        height = this.div.height()- margin.top - margin.bottom;
    var x = d3.scale.linear()
        .domain([this.option.xmin,this.option.xmax])
        .range([0, width]);
};

customhistogram.prototype.setdata=function(data){
	
    this.x=x;
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(this.option.bins))
        (rawdata);

    var y = d3.scale.linear()
        .domain([this.option.ymin,this.option.ymax])
        .range([height,0]);    
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    this.svg = d3.select("#histogram").append("svg")
		.attr("id","hist-svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
		.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    this.bar = this.svg.selectAll(".bar")
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
    
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);    
    this.svg.append("text")
	    .attr("class", "x_label")
	    .attr("text-anchor", "middle")
	    .attr("x", width/2)
	    .attr("y", height + margin.bottom)
	    .text("Travel Time (seconds)"); 
    this.svg.append("text")
	    .attr("class", "y_label")
	    .attr("text-anchor", "end")
	    .attr("x",2*vw)
	    .attr("y", 0.2*vw)
	    .attr("dy", "0.75em")
	    .text("Count");
};


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
    .text("Travel Time (seconds)"); 
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