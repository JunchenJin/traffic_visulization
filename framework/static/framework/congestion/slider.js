


$("#time-slider").slider({
	value: 0,
	min: 0,
	max: 24*60-30,
	step: 30,
	slide: updateTime,
});  
setTimeLabel(0,30,$("#time"));
// define slide function
function updateTime( event, ui ) {
		setTimeLabel(ui.value,ui.value+30,$("#time"));
		currentIntervalIndex=ui.value/30;
		updatestyle(currentIntervalIndex);
};

function setTimeLabel(value0, value1,element){
    var minutes0 = parseInt(value0 % 60, 10),
        hours0 = parseInt(value0 / 60 % 24, 10),
        minutes1 = parseInt(value1 % 60, 10),
        hours1 = parseInt(value1 / 60 % 24, 10);
    var startTime = getTime(hours0, minutes0);
    var endTime = getTime(hours1, minutes1);
    element.text(startTime+':00 ' + ' - ' + endTime+':00 ');
}

function getTime(hours, minutes) {
    hours = hours+ "";
    minutes = minutes + "";
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
