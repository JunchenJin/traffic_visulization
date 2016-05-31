/*
Define my custom slider with arguments such as slider-div,
initial value,minimum,maximum,step and update methods

Refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript  
*/

// A more advanced library will be add K:V listeners for a slider 
// such as label:func1,map:func2,chart:func3,others:func4 

 
 

Customslider = function(sliderdiv,option,labeldiv,labelfunction){
	this.sliderdiv=sliderdiv;
	this.labeldiv=labeldiv;	
	this.listeners=[];
	this.listeners.push(labelfunction);
	this.option=option;
	var self=this;
	labelfunction(option.value,self);
	this.sliderdiv.slider(option);
	this.sliderdiv.on( 
		"slide", 
		function( event, ui ) {
			for(var i in self.listeners){
			  self.listeners[i](ui.value,self);
			}
		}
	);
	console.log('Slider instantiated');
};

Customslider.prototype.addlistener=function(func){
	this.listeners.push(func);
};
