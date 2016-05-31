// Design the legend of the map

updateLegend=function(config){
	var div = L.DomUtil.create('div', 'info legend');
	var element=$("<b></b>").text(config.option.name+" Unit: "+config.option.unit);
	div.innerHTML +=element.prop('outerHTML')+"<br>";	
	var labels=config.option.splitvalues;
	for (var i = 0; i < labels.length; i++) {
		var item= $("<i></i>");		
		item.css( "background", config.option.colors[i]);
		div.innerHTML +=item.prop('outerHTML');
		if(i<labels.length-1)
		{ 
			div.innerHTML+= labels[i]+" - "+labels[i+1]+"<br>";
		} else{
			div.innerHTML+=labels[i]+" + ";
		}
	}
	return div;
};

