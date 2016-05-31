
initializePicker(48,30);
function initializePicker(max,step){
	for (i = 0; i < max; i++) { 
		var opt = document.createElement('option');
		opt.text=getInterval(i,step);
		opt.value=i;
    	$('#intervalpicker').append(opt);
	}
}

$('#Fit').on('click', function (e) {
	if(!$("#currentID").text()||!$("#intervalpicker").val()){alert("Click map and select interval!"); }
	else{
		$.ajax({
		  type: "GET",
		  url: "/framework/fetchttfitimg64.png",
		  data: {linkid: $("#currentID").text(),
		  	intervalid:$("#intervalpicker").val()
		  	},
		  ContentType: 'image/png',
		  success:function( response) { 
		  	$('#image').html('<img src="data:image/png;base64,' + response + '" />');
		}
	});	
	}
});



