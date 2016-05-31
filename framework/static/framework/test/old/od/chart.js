require.config({
            paths: {
                echarts: '/static/od/echarts-dist'
            }
        });
        
// use
require(
            [
                'echarts',
                'echarts/chart/line' // require the specific chart type
            ],
            function (ec) {
                // Initialize after dom ready
                var myChart = ec.init(document.getElementById('echarts')); 
				// Load data into the ECharts instance 
				$.getJSON( "/framework/querychart", function( data ) {
					length = data.length;
					legend_data=[];					
					series_data=[];
					for (i=0;i<length;i++)
					{
						legend_data.push("Path "+(i+1));
						single_line_data = {
								name:legend_data[i],
								type:'line',
								data:data[i].tt_array,
						},
						series_data.push(single_line_data);
					}
					
					option = {
						//title : {
							//text: 'Travel time distribution',
						//},
						tooltip : {
							trigger: 'axis'
						},
						legend: {
							data:legend_data
						},
						toolbox: {
							show : false,
							feature : {
								mark : {show: true},
								dataView : {show: true, readOnly: false},
								magicType : {show: true, type: ['line', 'bar']},
								restore : {show: true},
								saveAsImage : {show: true}
							}
						},
						calculable : false,
						xAxis : [
							{
								type : 'category',
								boundaryGap : false,
								data : data[0].time_array,
								name:"Day \n in a Month",
							}
						],
						yAxis : [
							{
								name:"Travel Time",
								type : 'value',
								axisLabel : {
									formatter: '{value} Min'
								},
								min:40,
								max:70,
							}
						],
						series : series_data
					};
					myChart.setOption(option); 	
				  });
                
            }
        );