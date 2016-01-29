/////////////////////////////////////////////////////////////////////////////////////////
// document load
$(document).ready(function() {
	// reset
	$(".mama-menu").hide();
	// load top menu
	$.getJSON("controllers/topMenuController.php", function(data) { 
		console.log(data);
		$.each(data.lang, function(k, v) {}); // NOTE: all lang activated for first versions
		$.each(data.login, function(k, v) {
			$(".mama-menu-" + v).show();
		});
		if (data.user.firstName != undefined)
			$("#userName").html(data.user.firstName + " " + data.user.lastName);
	});
	// load left panel
	$.getJSON("controllers/leftPanelController.php", function(data) { 
		// console.log(data);
		$.each(data, function(k, v) {
			switch (v) {
			case "default":
				$(".mama-menu-default").show();
				break;
			case "create-account":
				$(".mama-menu-create-account").show();
				break;
			case "dashboard":
				$(".mama-menu-dashboard").show();
				break;
			}
		});
	});
	// load page content
	var page = getUrlParameter('page');
	if (page === undefined)
		page = "default";
	page = page.replace(new RegExp('/', 'g'), "_");
	page = page.replace(new RegExp('\\.', 'g'), "_");
	$.get("controllers/mainContentController.php?page=" + page + "", function(data) { 
		$("#page-wrapper").html(data);
		loadLang();
	});
});

/**
 * get current url parameters
 */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
/////////////////////////////////////////////////////////////////////////////////////////
// page localization 
$(document).ready(function() {
	loadLang();
});

/**
 * load page lang
 */
loadLang = function () {
	if (localStorage.lang == "fr")
		$("html").prop("lang", "fr");
	else
		localStorage.lang = "en";
	$("#lang-"+localStorage.lang).addClass("fa-check");
	$.localise('lang/messages', {language: localStorage.lang, loadBase: true});
	// normal txt
	$.each($(".lang"), function() {
		$('#'+$(this).prop('id')).html(window[$(this).prop('id')]); 
	});
	// placeholder
	$.each($(".lang[placeholder]"), function() {
		$(this).attr("placeholder", window[$(this).prop('lang')]);
	});
};

/**
 * update page lang
 */
setLang = function(newLang) {
	$(".setLang").removeClass("fa-check");
	switch (newLang) {
	case "fr":
		localStorage.lang = "fr";
		break;
	case "en":
	default:
		localStorage.lang = "en";
	}
	loadLang();
}

/////////////////////////////////////////////////////////////////////////////////////////
// date & time
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) 
	dd='0'+dd
if(mm<10)
	mm='0'+mm;
var lastYear = (yyyy-1) + '-' + mm + '-' + dd;
var today = yyyy + '-' + mm + '-' + dd;

/////////////////////////////////////////////////////////////////////////////////////////
// multiselect
$(document).ready(function() {
    $('.multiselect').multiselect();
});