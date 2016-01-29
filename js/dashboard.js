/////////////////////////////////////////////////////////////////////////////////////////
// dashboard - link listener on buttons
$(document).ready(function() {
	var isClicking = false;
	$(".panel.mainBtnOpt").css("cursor", "pointer").click(function() {
		var e = $(this); 
		var doClick = false;
		if (!isClicking)
			doClick = true;
		isClicking = true;
		if (doClick)
			$(e).find("a").click();
		isClicking = false;
	});
});
/////////////////////////////////////////////////////////////////////////////////////////
// page localization 
$(document).ready(function() {
	loadLang();
});