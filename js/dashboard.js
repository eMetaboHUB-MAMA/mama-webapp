/////////////////////////////////////////////////////////////////////////////////////////
// dashboard - link listener on buttons
// all
var nbProjectsWaiting = 0;
var nbProjectsCompleted = 0;
var nbProjectsAccepted = 0;
var nbProjectsAssigned = 0;
var nbProjectsRunning = 0;
var nbProjectsArchived = 0;
var nbProjectsBlocked = 0;
var nbProjectsRejected = 0;
var nbProjectsTotal = 0;
// admin / PM
//var nbProjectsTotalWaiting = 0;
//var nbProjectsTotalCompleted = 0;
//var nbProjectsTotalAssigned = 0;
//var nbProjectsTotalArchived = 0;
//var nbProjectsTotalBlocked = 0;
//var nbProjectsTotalRejected = 0;
//var nbProjectsTotalTotal = 0;

var nbProjectsInChargeWaiting = 0;
var nbProjectsInChargeCompleted = 0;
var nbProjectsInChargeAccepted = 0;
var nbProjectsInChargeAssigned = 0;
var nbProjectsInChargeRunning = 0;
//var nbProjectsInChargeArchived = 0;
//var nbProjectsInChargeBlocked = 0;
//var nbProjectsInChargeRejected = 0;
var nbProjectsInChargeTotal = 0;

// ///////////////////////////////////////////////////////////////////////////////////////
// dashboard - onload stuff
$(document).ready(function() {
	// page localization
	loadLang();
	// /////////////////////////////////////////
	// link listener on buttons
	var isClicking = false;
	$(".panel.mainBtnOpt").css("cursor", "pointer").click(function() {
		var e = $(this);
		var doClick = false;
		if (!isClicking)
			doClick = true;
		isClicking = true;
		if (doClick) {
			document.location = ($(e).find("a").attr("href"));
		}
		isClicking = false;
	});
	// /////////////////////////////////////////
	// LOAD PROJECTS STATS
	loadProjectsStats();
	// /////////////////////////////////////////
	// LOAD PROJECTS
	$.get('templates/projects-light-list-template-' + lang + '.html', function(template) {
		$('body').append(template);
		loadProjectsList(0, 10);
	});
	// /////////////////////////////////////////
	// LOAD NOTIFICATIONS
	$("#events-light-list-container").empty();
	$.get('templates/events-light-list-template-' + lang + '.html', function(template) {
		$('body').append(template);
		loadEventsList(0, 10);
	});
	// /////////////////////////////////////////
	// LOAD MESSAGES
	$("#messages-light-list-container").empty();
	$.get('templates/messages-light-list-template-' + lang + '.html', function(template) {
		$('body').append(template);
		loadMessagesList(0, 10);
	});
});
// ///////////////////////////////////////////////////////////////////////////////////////
// functions
/**
 */
function loadProjectsStats(filter) {
	var verbe = "get";
	var resource = "projects-stats";
	var extraFilter = "";
	if (filter !== undefined) {
		extraFilter += "&filter="+filter;
	}
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(projectsStats) {
			if (projectsStats.hasOwnProperty('success')
					&& projectsStats.success == false) {
				// TODO show error message info
			} else {
//				console.log(projectsStats);
				if (projectsStats.userRight == "project_manager" || projectsStats.userRight == "admin") {
					nbProjectsWaiting = projectsStats['allProjectsWaiting'];
					nbProjectsCompleted = projectsStats['allProjectsCompleted'];
					nbProjectsAccepted = projectsStats['allProjectsAccepted'];
					nbProjectsAssigned = projectsStats['allProjectsAssigned'];
					nbProjectsRunning = projectsStats['allProjectsRunning'];
					nbProjectsArchived = projectsStats['allProjectsArchived'];
					nbProjectsBlocked = projectsStats['allProjectsBlocked'];
					nbProjectsRejected = projectsStats['allProjectsRejected'];
//					nbProjectsTotal = nbProjectsWaiting + nbProjectsCompleted + nbProjectsAssigned + nbProjectsRunning + nbProjectsArchived + nbProjectsBlocked + nbProjectsRejected;
					
					nbProjectsInChargeCompleted = projectsStats['inChargeProjectsCompleted'];
					nbProjectsInChargeAccepted = projectsStats['inChargeProjectsAccepted'];
					nbProjectsInChargeAssigned = projectsStats['inChargeProjectsAssigned'];
					nbProjectsInChargeRunning = projectsStats['inChargeProjectsRunning'];
					nbProjectsInChargeBlocked = projectsStats['inChargeProjectsBlocked'];
					nbProjectsInChargeTotal = nbProjectsInChargeCompleted + nbProjectsInChargeAccepted + nbProjectsInChargeAssigned + nbProjectsInChargeRunning + nbProjectsInChargeBlocked;
					
					var myWaitingProject = projectsStats['userProjectsWaiting'];
					var myAcceptedProject = projectsStats['userProjectsAccepted'];
					var myAssignedProject = projectsStats['userProjectsAssigned'];
					var myCompletedProject = projectsStats['userProjectsCompleted'];
					var myRunningProject = projectsStats['userProjectsRunning'];
					
					$(".panel-primary.panel-projects").find(".huge").html(nbProjectsInChargeTotal);
					$(".panel-waiting.panel-projects").find(".huge").html(nbProjectsWaiting);
					$(".panel-accepted.panel-projects").find(".huge").html(nbProjectsAccepted);
					$(".panel-assigned.panel-projects").find(".huge").html(nbProjectsAssigned);
					$(".panel-completed.panel-projects").find(".huge").html(nbProjectsCompleted);
					$(".panel-info.panel-projects").find(".huge").html(nbProjectsRunning);
					
					$("#spanMyWaitingProjects").html(myWaitingProject);
					$("#spanMyAcceptedProjects").html(myAcceptedProject);
					$("#spanMyAssignedProjects").html(myAssignedProject);
					$("#spanMyCompletedProjects").html(myCompletedProject);
					$("#spanMyRunningProjects").html(myRunningProject);
					try {
						buildProjectsStats();
					} catch(e) {}
					nbProjectsTotal = nbProjectsWaiting + nbProjectsCompleted + nbProjectsAssigned + nbProjectsArchived + nbProjectsBlocked + nbProjectsRejected;
				} else {
					// user is user (lal)
					nbProjectsWaiting = projectsStats['userProjectsWaiting'];
					nbProjectsCompleted = projectsStats['userProjectsCompleted'];
					nbProjectsAccepted = projectsStats['userProjectsAccepted'];
					nbProjectsAssigned = projectsStats['userProjectsAssigned'];
					nbProjectsRunning = projectsStats['userProjectsRunning'];
					nbProjectsArchived = projectsStats['userProjectsArchived'];
					nbProjectsBlocked = projectsStats['userProjectsBlocked'];
					nbProjectsRejected = projectsStats['userProjectsRejected'];
					nbProjectsTotal = nbProjectsWaiting + nbProjectsCompleted + nbProjectsAccepted + nbProjectsRunning + nbProjectsAssigned + nbProjectsArchived + nbProjectsBlocked + nbProjectsRejected;
					//
					$(".panel-waiting.panel-projects").find(".huge").html(nbProjectsWaiting);
					$(".panel-accepted.panel-projects").find(".huge").html(nbProjectsAccepted);
					$(".panel-completed.panel-projects").find(".huge").html(nbProjectsCompleted);
					$(".panel-assigned.panel-projects").find(".huge").html(nbProjectsAssigned);
					$(".panel-completed.panel-projects").find(".huge").html(nbProjectsCompleted);
					$(".panel-info.panel-projects").find(".huge").html(nbProjectsRunning);
					// 
				}
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}

/**
 */
function loadProjectsList(start, limit, filter) {
	$("#projects-light-list-container").empty();
	var verbe = "get";
	var resource = "projects";
	var extraFilter = "&start=" + start + "&limit=" + limit;
	if (filter !== undefined) {
		extraFilter += "&filter="+filter;
	}
	extraFilter += "&order=desc"
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(projects) {
			if (projects.hasOwnProperty('success')
					&& projects.success == false) {
				// TODO show error message info
			} else {
				if (projects.length === 0) {
					$("#noProjectsDiv").show();
					$("#tableListProjects").hide();
				} else {
					$("#projects-light-list-template").tmpl(projects)
							.appendTo("#projects-light-list-container");
					if (projects.length >= limit) {
						var totNb = nbProjectsTotal; // TODO if filter, other max
						buildPagination(start, limit, filter, "projectsPagination", "loadProjectsList", totNb);
					}
				}
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}

/**
 */
function loadEventsList(start, limit, filter) {
//	$("#events-light-list-container").empty();
	var verbe = "get";
	var resource = "events";
	var extraFilter = "&start=" + start + "&limit=" + limit;
	if (filter !== undefined) {
		extraFilter += "&filter="+filter;
	}
	extraFilter += "&order=desc"
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(events) {
			if (events.hasOwnProperty('success')
					&& events.success == false) {
				// TODO show error message info
			} else {
				if (events.length === 0) {
					// hide more button
					$("#showMoreEventsBtn").hide();
				} else { 
					if (events.length < limit) {
						// hide more button
						$("#showMoreEventsBtn").hide();
					}
					$("#noEventToShow").hide();
					var now = new Date();
					$.each(events, function(k, v) {
						v = eventStatUpdate(v, now);
					});
					$("#events-light-list-template").tmpl(events).appendTo("#events-light-list-container");
					$('[data-toggle="tooltip"]').tooltip();
					resizeEventsElements();
				}
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////
var lastEventStart = 0;
var lastEventLimit = 10;
showMoreEvents = function() {
	lastEventStart += lastEventLimit;
	loadEventsList(lastEventStart, lastEventLimit);
}
showProject = function(id) {
	document.location = "?page=projects&showProject=" + id;
}

/////////////////////////////////////////////////////////////////////////////////////////
/**
 */
function loadMessagesList(start, limit, filter) {
//	$("#messages-light-list-container").empty();
	var verbe = "get";
	var resource = "messages";
	var extraFilter = "&start=" + start + "&limit=" + limit;
	if (filter !== undefined) {
		extraFilter += "&filter="+filter;
	}
	extraFilter += "&order=desc";
	extraFilter += "&userFilter=receiver";
	extraFilter += "&projectFilter=receiver";
	extraFilter += "&projectPlaceFilter=all";
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(messages) {
			if (messages.hasOwnProperty('success')
					&& messages.success == false) {
				// TODO show error message info
			} else {
				if (messages.length === 0) {
					$("#goToMessagesBtn").hide();
				} else { 
					$("#noMessageToShow").hide();
					var now = new Date();
					$.each(messages, function(k, v) {
						v['messageClean'] = $("<div>").append(v.message).text().replace('"', "&quot;");
						v = eventStatUpdate(v, now);
					});
					$("#messages-light-list-template").tmpl(messages).appendTo("#messages-light-list-container");
					$('[data-toggle="tooltip"]').tooltip();
				}
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////////////////////////////
// if you read this, you are an awesome person!
