$("#menu-toggle-btn").click(function(e) {
	e.preventDefault();
	toggleMenu();
});

function toggleMenu(){
	$("#menu").toggleClass("toggled");
	$("#map").toggleClass("toggled");
	$("#menu-toggle-btn").toggleClass("toggled");
	$("#histogram").toggleClass("toggled");
}