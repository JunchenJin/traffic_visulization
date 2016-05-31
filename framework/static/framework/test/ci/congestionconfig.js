// TODO change the split function
CIconfig=function(option){
	this.option=option;
};

CIconfig.prototype.setClassScheme=function(classscheme){
	this.option.splitvalues=classscheme;
};
CIconfig.prototype.setColorScheme=function(colorscheme){
	this.option.colors=colorscheme;
};

CIconfig.prototype.getClassIndex=function(value) {
	classsplit=this.option.splitvalues;
	for (var i = 1; i < classsplit.length; i++) {
        if (value<=classsplit[i]) {
            return i-1;
        } else {
        	if(i==classsplit.length-1){
        		return i;
        	}
        }
    }
};

CIconfig.prototype.getColorFromValue=function(value) {
	return this.option.colors[this.getClassIndex(value)];
};
// TODO: define several layers for congestion

// First test with four classes of colors and later, if you have time, you can add for adaptive class number
$("#ci1").on('click',function(){
	config1.setClassScheme([0,$("#ci1spinner1").val(),$("#ci1spinner2").val(),$("#ci1spinner3").val()]);
	updatestyle(currentIndex);
    map.removeControl(legend);
    legend.onAdd = function (map) {
		return updateLegend(currentConfig);
	};
	legend.addTo(map);
});	
	
