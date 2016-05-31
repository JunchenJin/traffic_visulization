var chart;
var currentdata;
$(window).on("resize", updateChart);
function updateChart(){
    if(chart){
        $("#linechart").css('max-height', ($("#menu").height()-50)+'px') ;
        chart.resize(
            {weight:window.innerWidth*0.4-parseInt($("#linechart").css("padding-right").replace("px", ""))*2,
            height:$("#linechart").height()}
        );
    }
}
function drawChart(values){
	currentdata=values;
	chart = c3.generate({
    bindto: '#linechart',
    size: {
        height:$("#linechart").height(),
        width: window.innerWidth*0.4-parseInt($("#linechart").css("padding-right").replace("px", ""))*2,
    },
    padding: {
        top: 15,
        right: 40,
        bottom: 30,
        left: 60,
    },
    data: {
    	 x: 'x',
        json: {
            'Route Travel Time (s)': values,
            'x':TimeArray,
        }
    },
    axis: {
        x: {    
        	type: 'timeseries',            
            tick: {
                // this also works for non timeseries data
                format: '%H:%M',
                values: TickArray,
            },
            label:{
            	text:'Hour of Day',
            	position: 'outer-center',
           	}
        },
        y: {
            label:{ 
            text:'Route Travel Time(s)'
            }
        }
    },
    legend: {
        show: false
    }
    
    });   
	//$(".c3-axis-x-label").attr("dy","2.5em");
}


function getTime(hour, minutes) {
    return new Date(2015, 1, 1, hour,minutes, 0,0);
}

function getTimeByIndex(i){
	//i from 0 to 47
	var hour=(i-i%2)/2;
	var minutes=i%2*30;
	return getTime(hour,minutes);
}

var TimeArray=[] ;
for (i = 0; i < 48; i++) { 
    TimeArray.push(getTimeByIndex(i));
} 

var TickArray=[];
for (i = 0; i < 48; i=i+8) { 
    TickArray.push(getTimeByIndex(i));
}

