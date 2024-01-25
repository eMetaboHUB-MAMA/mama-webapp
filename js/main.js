/////////////////////////////////////////////////////////////////////////////////////////
var userData = null;
/////////////////////////////////////////////////////////////////////////////////////////
// document init
function initMama () {
	// left collaps
	if (localStorage.getItem("collapsed")!=null && localStorage.getItem("collapsed") == "true") {
		$('.row-offcanvas').toggleClass('active');
		$('.collapse').toggleClass('in').toggleClass('hidden-xs').toggleClass('visible-xs');
		$('#collapseLeftPanelBtn').removeClass('active');
		$("#collapseLeftPanelBtn i").removeClass("fa-chevron-circle-left").addClass("fa-chevron-circle-right");
		document.getElementById("page-wrapper").style.marginLeft='50px';
		document.getElementById("sidebar").style.width='50px';
	}
	// reset
	$(".mama-menu").hide();
	// load top menu
	loadTopMenu();
	// load left panel
	loadLeftPanel();
}
/////////////////////////////////////////////////////////////////////////////////////////
//document load
$(document).ready(function() {
	// left collaps
	$('[data-toggle=offcanvas]').click(function() {
		$('.row-offcanvas').toggleClass('active');
		$('.collapse').toggleClass('in').toggleClass('hidden-xs').toggleClass('visible-xs');
		if ($("#page-wrapper").css("margin-left") != "50px") {
			$("#page-wrapper").css("margin-left", "50px");
			$("#sidebar").css("width", "50px");
			$('#collapseLeftPanelBtn').removeClass('active');
			$("#collapseLeftPanelBtn i").removeClass("fa-chevron-circle-left").addClass("fa-chevron-circle-right");
			localStorage.setItem("collapsed", true);
		} else {
			$("#page-wrapper").css("margin-left", "250px");
			$("#sidebar").css("width", "250px");
			$('#collapseLeftPanelBtn').removeClass('active');
			$("#collapseLeftPanelBtn i").removeClass("fa-chevron-circle-right").addClass("fa-chevron-circle-left");
			localStorage.setItem("collapsed", false);
		}
	});
//	if (localStorage.getItem("collapsed")!=null && localStorage.getItem("collapsed") == "true") {
//		$("#collapseLeftPanelBtn").click();
//	}
//	// reset
//	$(".mama-menu").hide();
//	// load top menu
//	loadTopMenu();
//	// load left panel
//	loadLeftPanel();
	// load page content
	var page = getUrlParameter('page');
	if (page === undefined)
		page = "default";
	page = page.replace(new RegExp('/', 'g'), "_");
	page = page.replace(new RegExp('\\.', 'g'), "_");
	$.get("controllers/mainContentController.php?page=" + page + "",
			function(data) {
				$("#page-wrapper").html(data);
				loadLang();
			});
	// loadLang();
});

loadTopMenu = function() {
	$("#userName").html("");
	$.getJSON("controllers/topMenuController.php",
			function(data) {
				// console.log(data);
				$.each(data.lang, function(k, v) {
				}); // NOTE: all lang activated for first versions
				$.each(data.login, function(k, v) {
					$(".mama-menu-" + v).show();
				});
				userData = data.user;
				if (data.user.firstName != undefined) {
					$("#userName").html(data.user.firstName + " " + data.user.lastName);
//					if (localStorage.mamaFirstURL !== undefined || localStorage.mamaFirstURL !== null) {
//						var t = localStorage.mamaFirstURL ;
//						localStorage.mamaFirstURL = null;
//						document.location.href = t;
//					}
				} 
			});
}

loadLeftPanel = function() {
	$(".mama-collapse").show();
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
			case "new-analysis":
				$(".mama-menu-new-analysis").show();
				break;
//			case "new-projects":
//				$(".mama-menu-projects").show();
//				break;
			default:
				$(".mama-menu-" + v).show();
				break;
			}
		});
	});
}

/**
 * get current url parameters
 */
var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL
			.split('&'), sParameterName, i;
	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};
// ///////////////////////////////////////////////////////////////////////////////////////
// page localization
$(document).ready(function() {
	// loadLang();
});

var langLoaded = false;

/**
 * load page lang
 */
function loadLang() {
	if (localStorage.lang == "fr")
		$("html").prop("lang", "fr");
	else
		localStorage.lang = "en";
	$("#lang-" + localStorage.lang).addClass("fa-check");
	if (!langLoaded) {
		$.localise('lang/messages', {
			language : localStorage.lang,
			loadBase : true
		});
		langLoaded = true;
	}
	// normal txt
	$.each($(".lang"), function() {
		$('#' + $(this).prop('id')).html(window[$(this).prop('id')]);
	});
	// placeholder
	$.each($(".lang[placeholder]"), function() {
		$(this).attr("placeholder", window[$(this).prop('lang')]);
	});
	$.each($(".lang-class"), function() {
		$($(this)).html(window[$($(this)).attr("class").replace("lang-class","").replace(".","").replace(" ","")]);
	});
	// graph
	try { buildProjectsStats() } catch (e) {}
	try { buildUsersChart() } catch (e) {}
};

/**
 * update page lang
 */
setLang = function(newLang) {
	langLoaded = false;
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

// ///////////////////////////////////////////////////////////////////////////////////////
// date & time
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; // January is 0!
var yyyy = today.getFullYear();
if (dd < 10)
	dd = '0' + dd
if (mm < 10)
	mm = '0' + mm;
var lastYear = (yyyy - 1) + '-' + mm + '-' + dd;
var today = yyyy + '-' + mm + '-' + dd;

// ///////////////////////////////////////////////////////////////////////////////////////
// multiselect
$(document).ready(function() {
	$('.multiselect').multiselect();
});
/////////////////////////////////////////////////////////////////////////////////////////
//elements size
function resizeEventsElements() {
	if ($('#messages-light-list-container').length)
		$($("#events-light-list-container .list-group-item")).css("min-width", $($("#messages-light-list-container")[0]).css("width"));
}
$(document).ready(function() {
	resizeEventsElements();
});
$(window).resize(function() {
	waitForFinalEvent(function() {
		console.log('Resize...');
		resizeEventsElements();
	}, 15, "some unique string");
});
var waitForFinalEvent = (function() {
	var timers = {};
	return function(callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
			clearTimeout(timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();
/////////////////////////////////////////////////////////////////////////////////////////
