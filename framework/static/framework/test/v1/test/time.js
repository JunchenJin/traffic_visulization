// Update the label of a div based on input value
function updateTime(value0,sliderobj){
    sliderobj.labeldiv.text(getInterval(value0/30,sliderobj.option.step));
}



// Output: a string of time
// Input: hour and minutes
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

function getInterval(interval,step){
	value0=interval*step;
	value1=value0+step;
    var minutes0 = parseInt(value0 % 60, 10),
        hours0 = parseInt(value0 / 60 % 24, 10),
        minutes1 = parseInt((value1) % 60, 10),
        hours1 = parseInt(value1/ 60 % 24, 10);
    var startTime = getTime(hours0, minutes0);
    var endTime = getTime(hours1, minutes1);
    return startTime+':00 ' + ' - ' + endTime+':00 ';
}
