$("#menu-toggle-btn").click(function(e) {
	e.preventDefault();
	toggleMenu();
});

function toggleMenu(){
	$("#menu").toggleClass("toggled");
	$("#map").toggleClass("toggled");
	$("#menu-toggle-btn").toggleClass("toggled");
	$("#linechart").toggleClass("toggled");
	$("#histogram").toggleClass("toggled");
	// If the menu is toggled not by searching button
	if(!search){
		if(currentdata){
			drawChart(currentdata);
		}
	}
}