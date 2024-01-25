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
var nbProjectsTotalWaiting = 0;
var nbProjectsTotalCompleted = 0;
var nbProjectsTotalAccepted = 0;
var nbProjectsTotalAssigned = 0;
var nbProjectsTotalRunning = 0;
var nbProjectsTotalArchived = 0;
var nbProjectsTotalBlocked = 0;
var nbProjectsTotalRejected = 0;
var nbProjectsTotalTotal = 0;

var nbProjectsInChargeWaiting = 0;
var nbProjectsInChargeCompleted = 0;
var nbProjectsInChargeAccepted = 0;
var nbProjectsInChargeAssigned = 0;
var nbProjectsInChargeRunning = 0;
//var nbProjectsInChargeArchived = 0;
//var nbProjectsInChargeBlocked = 0;
//var nbProjectsInChargeRejected = 0;
var nbProjectsInChargeTotal = 0;
var projectsManagers = [];

var currentStatus = null;
var currentStart = 0;
var currentLimit = 20;
var currentKeyword = null;

var filterInCharge = false;
var filterInvolved = false;
var filterOwner = false;

var currentProjectId = null;

var filterMthPF = false;
var filterMthPFval = '';

// filters for mama#36
var filterPjOwner = false;
var filterPjOwnerVal = '';
var filterPjManager = false;
var filterPjManagerVal = '';
var filterPjAnalysts = false;
var filterPjAnalystsVal = '';

// ///////////////////////////////////////////////////////////////////////////////////////
// dashboard - onload stuff
$(document).ready(function () {
	// page localization
	loadLang();
	// /////////////////////////////////////////
	// load GET params
	if (getUrlParameter("status") !== undefined && getUrlParameter("status") != "null") {
		currentStatus = getUrlParameter("status");
		$("#search-analyses-filter-status").html($("#aPj_" + currentStatus).html());
	}
	// keywords in filter
	if (getUrlParameter("keyword") !== undefined) {
		currentKeyword = getUrlParameter("keyword");
		$("#projectsSearchFilter").val(currentKeyword);
	}
	// project owner
	if (getUrlParameter("pj_owner") !== undefined) {
		filterPjOwner = true;
		filterPjOwnerVal = getUrlParameter("pj_owner");
		$("#projectsOwnerFilter").val(filterPjOwnerVal);
	}
	// project manager
	if (getUrlParameter("pj_manager") !== undefined) {
		filterPjManager = true;
		filterPjManagerVal = getUrlParameter("pj_manager");
		$("#projectsManagerFilter").val(filterPjManagerVal);
	}
	// project manager
	if (getUrlParameter("pj_analysts") !== undefined) {
		filterPjAnalysts = true;
		filterPjAnalystsVal = getUrlParameter("pj_analysts");
		$("#projectsAnalystsFilter").val(filterPjAnalystsVal);
	}
	// pagination
	if (getUrlParameter("start") !== undefined) {
		currentStart = getUrlParameter("start");
	}
	if (getUrlParameter("limit") !== undefined) {
		currentLimit = getUrlParameter("limit");
	}
	// filterInCharge  / filterInvolved
	if (getUrlParameter("userFilter") !== undefined) {
		if (getUrlParameter("userFilter") == 'inCharge') {
			filterInCharge = true;
			$("#btn-userFilter-inCharge").removeClass('btn-default').addClass('btn-primary');
		} else if (getUrlParameter("userFilter") == 'involved') {
			filterInvolved = true;
			$("#btn-userFilter-involved").removeClass('btn-default').addClass('btn-primary');
		} else if (getUrlParameter("userFilter") == 'owner') {
			filterOwner = true;
			$("#btn-userFilter-owner").removeClass('btn-default').addClass('btn-primary');
		}
	}
	// filter mth PF
	if (getUrlParameter("mth_pf") !== undefined) {
		filterMthPF = true;
		filterMthPFval = getUrlParameter("mth_pf");
	}
	// /////////////////////////////////////////
	// LOAD PROJECTS STATS
	loadProjectsStats();
	// /////////////////////////////////////////
	// load PM managers
	projectsManagers = getAllProjectsManagers();
	// /////////////////////////////////////////
	// LOAD PROJECTS
	var userRights = "user"
	if (userData.right == "admin" || userData.right == "project_manager") {
		userRights = "pm";
		// MTH pf list
		// $("#mthPlatforms").append('<option selected value=""> - </option>');
		buildMTHplatforms();
		// build datepicker
		buildRangeDate();
	}
	$.get('templates/projects-full-list-' + userRights + '-template-' + lang + '.html', function (template) {
		$('body').append(template);
		loadProjectsList(currentStart, currentLimit, currentStatus);
	});
	//
	$("#projectsSearchFilter").bind('keypress', function (e) {
		var code = e.keyCode || e.which;
		launchSearchIfPressEnter(code);
	});
	$("#projectsOwnerFilter").bind('keypress', function (e) {
		var code = e.keyCode || e.which;
		launchSearchIfPressEnter(code);
	});
	$("#projectsManagerFilter").bind('keypress', function (e) {
		var code = e.keyCode || e.which;
		launchSearchIfPressEnter(code);
	});
	$("#projectsAnalystsFilter").bind('keypress', function (e) {
		var code = e.keyCode || e.which;
		launchSearchIfPressEnter(code);
	});
	function launchSearchIfPressEnter(code) {
		if (code == 13) {
			searchProjects();
		}
	}
	// splash current URL param into download link
	$("#link-donwload-xls-file").attr("href", $("#link-donwload-xls-file").attr("href") + document.location.search.replace("?page=projects", ""))
});
// ///////////////////////////////////////////////////////////////////////////////////////
// functions
/**
 */
function loadProjectsStats() {
	var verbe = "get";
	var resource = "projects-stats";
	var extraFilter = "";
	var filterMode = false;
	// keyword
	if (currentKeyword != null) {
		extraFilter += "&keywords=" + currentKeyword;
		filterMode = true;
	}
	// filter project owner
	if (filterPjOwner) {
		extraFilter += '&pj_owner=' + getUrlParameter("pj_owner");;
		filterMode = true;
	}
	// filter project manager
	if (filterPjManager) {
		extraFilter += '&pj_manager=' + getUrlParameter("pj_manager");;
		filterMode = true;
	}
	// filter project analysts
	if (filterPjAnalysts) {
		extraFilter += '&pj_analysts=' + getUrlParameter("pj_analysts");;
		filterMode = true;
	}
	// current user involment in projet
	if (filterInCharge) {
		extraFilter += '&userFilter=inCharge';
		filterMode = true;
	} else if (filterInvolved) {
		extraFilter += '&userFilter=involved';
		filterMode = true;
	} else if (filterOwner) {
		extraFilter += '&userFilter=owner';
		filterMode = true;
	}
	// date from / date to 
	if ($("#range-date-start").val() != "" && $("#range-date-start").val() !== undefined) {
		extraFilter += '&from=' + $("#range-date-start").val();
		filterMode = true;
	} else if ((getUrlParameter("from") !== undefined)) {
		extraFilter += '&from=' + getUrlParameter("from");
		filterMode = true;
	}
	if ($("#range-date-end").val() != "" && $("#range-date-end").val() !== undefined) {
		extraFilter += '&to=' + $("#range-date-end").val();
		filterMode = true;
	} else if ((getUrlParameter("to") !== undefined)) {
		extraFilter += '&to=' + getUrlParameter("to");
		filterMode = true;
	}
	// MTH PF
	if ((getUrlParameter("mth_pf") !== undefined)) {
		extraFilter += '&mth_pf=' + getUrlParameter("mth_pf");
		filterMode = true;
	}
	// run
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + extraFilter,
		dataType: "json",
		async: true,
		success: function (projectsStats) {
			if (projectsStats.hasOwnProperty('success')
				&& projectsStats.success == false) {
				// TODO show error message info
			} else {
				// console.log(projectsStats);
				if (projectsStats.userRight == "project_manager" || projectsStats.userRight == "admin") {
					nbProjectsWaiting = projectsStats['allProjectsWaiting'];
					nbProjectsCompleted = projectsStats['allProjectsCompleted'];
					nbProjectsAccepted = projectsStats['allProjectsAccepted'];
					nbProjectsAssigned = projectsStats['allProjectsAssigned'];
					nbProjectsRunning = projectsStats['allProjectsRunning'];
					nbProjectsArchived = projectsStats['allProjectsArchived'];
					nbProjectsBlocked = projectsStats['allProjectsBlocked'];
					nbProjectsRejected = projectsStats['allProjectsRejected'];
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
				}
				nbProjectsTotal = nbProjectsWaiting + nbProjectsCompleted + nbProjectsAccepted + nbProjectsAssigned + nbProjectsRunning + nbProjectsArchived + nbProjectsBlocked + nbProjectsRejected;
				// 
				if (nbProjectsTotal == 0 && !filterMode) {
					$("#noProjectsContent").show();
					$(".listProjectsContent").hide();
				}
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}

/**
 */
function loadProjectsList(start, limit, status) {
	$("#projects-full-list-container").empty();
	var verbe = "get";
	var resource = "projects";
	var filterMode = false;
	var extraFilter = "&start=" + start + "&limit=" + limit;
	if (status !== undefined && status !== null) {
		extraFilter += "&status=" + status;
		filterMode = true;
	}
	// keywords filter (project title)
	if (currentKeyword != null) {
		extraFilter += "&keywords=" + currentKeyword;
		filterMode = true;
	}
	// project owner
	if (filterPjOwnerVal != null) {
		extraFilter += "&pj_owner=" + filterPjOwnerVal;
		filterMode = true;
	}
	// project manager
	if (filterPjManagerVal != null) {
		extraFilter += "&pj_manager=" + filterPjManagerVal;
		filterMode = true;
	}
	// project analysts
	if (filterPjAnalystsVal != null) {
		extraFilter += "&pj_analysts=" + filterPjAnalystsVal;
		filterMode = true;
	}
	// current user involvment in projets
	if (filterInCharge) {
		extraFilter += '&userFilter=inCharge';
		filterMode = true;
	} else if (filterInvolved) {
		extraFilter += '&userFilter=involved';
		filterMode = true;
	} else if (filterOwner) {
		extraFilter += '&userFilter=owner';
		filterMode = true;
	}
	// date from / date to
	if ($("#range-date-start").val() != "" && $("#range-date-start").val() !== undefined) {
		extraFilter += '&from=' + $("#range-date-start").val();
		filterMode = true;
	} else if ((getUrlParameter("from") !== undefined)) {
		extraFilter += '&from=' + getUrlParameter("from");
		filterMode = true;
	}
	if ($("#range-date-end").val() != "" && $("#range-date-end").val() !== undefined) {
		extraFilter += '&to=' + $("#range-date-end").val();
		filterMode = true;
	} else if ((getUrlParameter("to") !== undefined)) {
		extraFilter += '&to=' + getUrlParameter("to");
		filterMode = true;
	}
	// MTH PF
	if ($("#mthPlatforms").val() !== "" && $("#mthPlatforms").val() !== undefined && $("#mthPlatforms").val() !== null) {
		extraFilter += '&mth_pf=' + $("#mthPlatforms").val() + "";
		filterMode = true;
	} else if ((getUrlParameter("mth_pf") !== undefined)) {
		extraFilter += '&mth_pf=' + getUrlParameter("mth_pf");
		filterMode = true;
	}
	extraFilter += "&order=desc"
	// run
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + extraFilter,
		dataType: "json",
		async: true,
		success: function (projects) {
			if (projects != null && projects.hasOwnProperty('success')
				&& projects.success == false) {
				// TODO show error message info
			} else {
				if (projects.length === 0 && (!filterMode)) {
					$("#noProjectsDiv").show();
					$("#tableListProjects").hide();
				} else {
					$("#noProjectsDiv").hide();
					$.each(projects, function () {
						this['titleAlt'] = ((this['title']).replace(/'/g, "\\\'"));
						this['createdLocalDate'] = convertJsonDateToHumanReadableShort(this.created.date);
						if (this.updated != null) {
							this['updatedLocalDate'] = convertJsonDateToHumanReadableShort(this.updated.date);
						}
						// user in charge
						this['listOfPM'] = projectsManagers;
						// user involved
						var analystsInChargeList = "";
						$.each(this.analystsInvolved, function (k, v) {
							if (analystsInChargeList != "")
								analystsInChargeList += ", ";
							analystsInChargeList += "" + v.fullName;
						});
						this['analystsInChargeList'] = analystsInChargeList;
					});
					$("#projects-full-list-template").tmpl(projects).appendTo("#projects-full-list-container");
					$(".multiselect-involved").multiselect({
						enableFiltering: true,
						enableCaseInsensitiveFiltering: true,
						maxHeight: 500,
						numberDisplayed: 2,
						buttonWidth: '100px',
						// texts localization
						filterPlaceholder: _multiselect_mth_analyst_filterPlaceholder,
						nonSelectedText: _multiselect_mth_analyst_nonSelectedText,
						nSelectedText: _multiselect_mth_analyst_nSelectedText,
						allSelectedText: _multiselect_mth_analyst_allSelectedText
					});

					var $contextMenu = $("#contextMenu");
					$("body").on("click", ".context-menu-pj", function (e) {
						currentProjectId = Number($(this).attr('id').replace('btn-action-', ""));
						// console.log(currentProjectId);
						$contextMenu.css({
							display: "block",
							left: e.pageX - 150,
							top: e.pageY
						});
						return false;
					});
					$("body").on("click", function () {
						$contextMenu.hide();
						currentProjectId = null;
					});

					var totNb = nbProjectsTotal;
					// if filter, other max
					if (status == "blocked")
						totNb = nbProjectsBlocked;
					else if (status == "rejected")
						totNb = nbProjectsRejected;
					else if (status == "waiting")
						totNb = nbProjectsWaiting;
					else if (status == "assigned")
						totNb = nbProjectsAssigned;
					else if (status == "accepted")
						totNb = nbProjectsAccepted;
					else if (status == "completed")
						totNb = nbProjectsCompleted;
					else if (status == "running")
						totNb = nbProjectsRunning;
					else if (status == "archived")
						totNb = nbProjectsArchived;
					// mop
					if (totNb > limit) {
						buildPagination(start, limit, status, "projectsPagination", "loadProjectsList", totNb);
					}
				}
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
// ///////////////////////////////////////////////////////////////////////////////////////
var currentProjectInModalId = null;
function showProject(projectID) {
	$("#showMoreEventsBtn").show();
	var verbe = "get";
	var resource = "project&projectID=" + projectID;
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource,
		dataType: "json",
		async: true,
		success: function (project) {
			if (project !== null && project.hasOwnProperty('success')
				&& project.success == false) {
				// TODO show error message info
			} else {
				// console.log(project);
				$.each(project, function (k, v) {
					$("#project-" + k).html(v);
				});
				$("#project-owner").html(project.owner.fullName);
				// NOTE: the email target is NOT in a <a> markup, in order to avoid easy email sending
				$("#project-owner-email").html(project.owner.email);
				// new mama#47 - more owner infos
				$("#project-owner-phone").html(project.owner.phone);
				$("#project-owner-workplace_address").html(project.owner.workplace_address);
				currentProjectInModalId = project.id;
				$("#project-demand .label").hide();
				$("#trSampleNb .label").hide();
				$("#trSampleNb").hide();
				if (project.demandTypeCatalogAllowance) {
					$(".demandTypeCatalogAllowance").show();
					$("#trSampleNb").show();
					if (project.samplesNumber !== null) {
						$(".project-sampleNumber-" + project.samplesNumber.replace(/ /g, '_')).show();
					}
				}
				if (project.demandTypeEqProvisioning)
					$(".demandTypeEqProvisioning").show();
				if (project.demandTypeFeasibilityStudy)
					$(".demandTypeFeasibilityStudy").show();
				if (project.demandTypeTraining)
					$(".demandTypeTraining").show();
				if (project.demandTypeDataProcessing)
					$(".demandTypeDataProcessing").show();
				if (project.demandTypeOther)
					$(".demandTypeOther").show();
				var keywords = "";
				$.each(project.thematicWords, function (k, v) {
					keywords += '<span class="label label-default">' + v.word + '</span>&nbsp;';
				});
				$("#trKeyWords").html(keywords);
				var subkeywords = "";
				$.each(project.subThematicWords, function (k, v) {
					subkeywords += '<span class="label label-default">' + v.word + '</span>&nbsp;';
				});
				$("#trSubKeyWords").html(subkeywords);
				var platforms = "";
				$.each(project.mthPlatforms, function (k, v) {
					platforms += '<span class="label label-default">' + v.name + '</span>&nbsp;';
				});
				$("#trPlatforms").html(platforms);

				if (project.scientificContextFile !== null && project.scientificContextFile !== "") {
					$("#project-scientificContextFile").parent().show();
					var linkFile = '<a href="' + project.scientificContextFileURL + '" target="_blank">' + project.scientificContextFile + '</a>'
					$("#project-scientificContextFile").html(linkFile);
				} else {
					$("#project-scientificContextFile").parent().hide();
					$("#project-scientificContextFile").html("");
				}

				$(".trBlockedOrRejected").hide();
				if (project.status == "rejected" && project.hasOwnProperty("analysisRequestExtraData")) {
					$(".trRejected").show();
					try {
						switch (project.analysisRequestExtraData.rejectedReason) {
							case "too_expensive":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_expensive);
								break;
							case "too_long_delays":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_delays);
								break;
							case "outside_our_skill_sphere":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_outside_our_skill);
								break;
							case "non_prioritary_rad":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_non_prioritary);
								break;
							case "incompatible_deadline":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_incompatible_deadline);
								break;
							case "too_many_samples":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_too_many_samples);
								break;
							case "transfered_to_privilegied_mth_partner":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_transfered_to_privilegied);
								break;
							case "not_funded":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_not_funded);
								break;
							case "saved_twice":
								$("#trRejected").html(_modal_stopProject_rejectedSelect_opt_saved_twice);
								break;
						}
					} catch (e) { }
					$("#trStopped").html(project.analysisRequestExtraData.stoppedReason);
				} else if (project.status == "blocked" && project.hasOwnProperty("analysisRequestExtraData")) {
					$(".trBlocked").show();
					try {
						switch (project.analysisRequestExtraData.blockedReason) {
							case "waiting_for_samples":
								$("#trBlocked").html(_modal_stopProject_pausedSelect_opt_waiting_for_samples);
								break;
							case "waiting_for_service_user_answer":
								$("#trBlocked").html(_modal_stopProject_pausedSelect_opt_waiting_for_service_user_answer);
								break;
							case "waiting_for_provisioning":
								$("#trBlocked").html(_modal_stopProject_pausedSelect_opt_waiting_for_provisioning);
								break;
							//						case "transfered_to_privilegied_mth_partner": 
							//							$("#trBlocked").html(_modal_stopProject_blockedSelect_opt_transfered_to_privilegied);
							//							break;
						}
					} catch (e) { }
					$("#trStopped").html(project.analysisRequestExtraData.stoppedReason);
				}

				$("#projectModal").modal("show");
				// background - load projects events
				lastProjectId = project.id;
				// events
				lastEventStart = 0;
				lastEventLimit = 10;
				$("#events-light-list-container").empty();
				$.get('templates/events-light-list-template-' + lang + '.html', function (template) {
					$('body').append(template);
					loadProjectEventsList(0, 10, project.id);
				});
				// messages
				lastMessageStart = 0;
				lastMessageLimit = 10;
				$("#messages-light-list-container").empty();
				$.get('templates/messages-light-list-inPjModal-template-' + lang + '.html', function (template) {
					$('body').append(template);
					loadProjectMessagesList(0, 10, project.id);
				});
				// new message
				$("#divWriteProjectMessage").parent().show()
				$("#divWriteProjectMessage").empty().append('<textarea id="writeProjectMessage" class="form-control wysihtml5" rows="3"></textarea>');
				$('#writeProjectMessage').wysihtml5({
					"font-styles": false,
					"emphasis": true,
					"lists": false,
					"html": false,
					"link": false,
					"image": false,
					"color": false,
					"blockquote": false
				});
				$("a[title='Indent']").remove();
				$("a[title='Outdent']").remove();
				$("a[title='CTRL+S']").remove();
				setTimeout(function () {
					$($(".wysihtml5-toolbar")[0]).append('<li class="pull-right"><small id="writeProjectMessageCount"></small></li>');
					setInterval(function () {
						$("#writeProjectMessageCount").html(2048 - $("#writeProjectMessage").val().length);
					}, 100);
				}, 250);
				// create send message btn callback method
				$("#writeProjectMessageBtn").attr("onclick", "postMessageToProject(" + project.id + ");");
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
editProject = function (id) {
	document.location = "?page=edit-project&editProject=" + id;
}
// ///////////////////////////////////////////////////////////////////////////////////////
function loadProjectEventsList(start, limit, projectID) {
	//	$("#events-light-list-container").empty();
	var verbe = "get";
	var resource = "events";
	var extraFilter = "&start=" + start + "&limit=" + limit;
	extraFilter += "&filter=projects&projectID=" + projectID;
	extraFilter += "&order=desc"
	// run
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + extraFilter,
		dataType: "json",
		async: true,
		success: function (events) {
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
					$.each(events, function (k, v) {
						v = eventStatUpdate(v, now);
					});
					$("#events-light-list-template").tmpl(events).appendTo("#events-light-list-container");
					$('[data-toggle="tooltip"]').tooltip();
				}
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
var lastProjectId = -1;
var lastEventStart = 0;
var lastEventLimit = 10;
function showMoreProjectEvents() {
	lastEventStart += lastEventLimit;
	loadProjectEventsList(lastEventStart, lastEventLimit, lastProjectId);
}
// ///////////////////////////////////////////////////////////////////////////////////////
/**
 * Update the personne responsable of a project
 */
function updateInCharge(projectID) {
	var verbe = "put";
	var resource = "project";
	// test current project status
	var isWaiting = $("#projectTr" + projectID).hasClass("waiting");
	if (isWaiting) {
		var text = window['listProjects_action_setManager_confirmDialog'];
		var continuePost = confirm(text);
		if (!continuePost) {
			// reset selected value
			$($("tr#projectTr" + projectID + " td")[6]).find("select").val("");
			// exit
			return false;
		}
	}
	// run
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&projectID=" + projectID,
		dataType: "json",
		data: "analystInCharge=" + Number($("#projectTr" + projectID + " .btn-mini").val()),
		async: true,
		success: function (events) {
			if (events.hasOwnProperty('success')
				&& events.success == false) {
				// TODO show error message info
			} else {
				if ($("#projectTr" + projectID).hasClass("waiting")) {
					$("#projectTr" + projectID).removeClass("waiting");
					$("#projectTr" + projectID).addClass("assigned");
					// TODO add 'reject' and 'accepted' buttons
				}
			}
		},
		error: function (xhr) {
			console.log(xhr);
		}
	});
}

/**
 * 
 */
function updateInvolved(projectID, elems) {
	var verbe = "put";
	var resource = "project";
	// run
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&projectID=" + projectID,
		dataType: "json",
		data: "analystsInvolved=" + (elems),
		async: true,
		success: function (events) {
			if (events.hasOwnProperty('success')
				&& events.success == false) {
				// TODO show error message info
			} else {
				// quite!
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}

/**
 * 
 */
function reloadPage(newStatus) {
	var newLocation = "?page=projects";
	if (newStatus !== undefined)
		newLocation += "&status=" + newStatus;
	else if (currentStatus !== null)
		newLocation += "&status=" + currentStatus;
	// user status
	if (filterInCharge) {
		newLocation += '&userFilter=inCharge'
	} else if (filterInvolved) {
		newLocation += '&userFilter=involved'
	} else if (filterOwner) {
		newLocation += '&userFilter=owner'
	}
	// keyword
	if ($("#projectsSearchFilter").val().trim() != "") {
		newLocation += "&keyword=" + $("#projectsSearchFilter").val().trim();
	}
	// project owner
	if ($("#projectsOwnerFilter").val().trim() != "") {
		newLocation += "&pj_owner=" + $("#projectsOwnerFilter").val().trim();
	}
	// project manager
	if ($("#projectsManagerFilter").val().trim() != "") {
		newLocation += "&pj_manager=" + $("#projectsManagerFilter").val().trim();
	}
	// project analysts
	if ($("#projectsAnalystsFilter").val().trim() != "") {
		newLocation += "&pj_analysts=" + $("#projectsAnalystsFilter").val().trim();
	}
	// mthpf
	if (filterMthPF) {
		newLocation += '&mth_pf=' + filterMthPFval;
	}
	// date filter
	if ($("#range-date-start").val() != "") {
		newLocation += '&from=' + $("#range-date-start").val();
	}
	if ($("#range-date-end").val() != "") {
		newLocation += '&to=' + $("#range-date-end").val();
	}
	document.location = newLocation;
}

/**
 * 
 */
function searchProjects() {
	reloadPage(currentStatus);
}

/**
 * 
 */
function addRemoveUserFilter(filter, val) {
	var newLocation = "?page=projects";

	// user role in project
	if (filter == 'inCharge' && !filterInCharge) {
		newLocation += '&userFilter=inCharge'
	} else if (filter == 'involved' && !filterInvolved) {
		newLocation += '&userFilter=involved'
	} else if (filter == 'owner' && !filterOwner) {
		newLocation += '&userFilter=owner'
	}

	// status
	if (currentStatus !== null) {
		newLocation += "&status=" + currentStatus;
	}

	// keyword
	if ($("#projectsSearchFilter").val().trim() != "") {
		newLocation += "&keyword=" + $("#projectsSearchFilter").val().trim();
	}

	// project owner
	if ($("#projectsOwnerFilter").val().trim() != "") {
		newLocation += "&pj_owner=" + $("#projectsOwnerFilter").val().trim();
	}
	// project manager
	if ($("#projectsManagerFilter").val().trim() != "") {
		newLocation += "&pj_manager=" + $("#projectsManagerFilter").val().trim();
	}
	// project analysts
	if ($("#projectsAnalystsFilter").val().trim() != "") {
		newLocation += "&pj_analysts=" + $("#projectsAnalystsFilter").val().trim();
	}

	// MTH platform
	if (filter == 'mth_pf') {
		newLocation += "&mth_pf=" + val;
		if (filterInCharge) {
			newLocation += '&userFilter=inCharge'
		} else if (filterInvolved) {
			newLocation += '&userFilter=involved'
		} else if (filterOwner) {
			newLocation += '&userFilter=owner'
		}
	} else {
		if (filterMthPF) {
			newLocation += '&mth_pf=' + filterMthPFval;
		}
	}

	// date filter
	if ($("#range-date-start").val() != "") {
		newLocation += '&from=' + $("#range-date-start").val();
	}
	if ($("#range-date-end").val() != "") {
		newLocation += '&to=' + $("#range-date-end").val();
	}

	// reload
	document.location = newLocation;
}

/**
 * 
 */
function setProjectStatus(projectID, newStatus) {
	// mama#32 - ask reject confirmation before update
	if (newStatus === "rejected") {
		if (!confirm(_confirm_popup_reject_project)) {
			return false;
		}
	}
	// init
	var verbe = "put";
	var resource = "project";
	// run
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&projectID=" + projectID,
		dataType: "json",
		data: "status=" + newStatus,
		async: true,
		success: function (events) {
			if (events.hasOwnProperty('success')
				&& events.success == false) {
				// TODO show error message info
			} else {
				$(".btn-pj-" + projectID).hide();
				$("#projectTr" + projectID).removeClass("waiting");
				$("#projectTr" + projectID).removeClass("assigned");
				$("#projectTr" + projectID).removeClass("accepted");
				$("#projectTr" + projectID).removeClass("completed");
				$("#projectTr" + projectID).removeClass("running");
				$("#projectTr" + projectID).removeClass("archived");
				$("#projectTr" + projectID).removeClass("blocked");
				$("#projectTr" + projectID).removeClass("rejected");
				$("#projectTr" + projectID).addClass(newStatus);
				// TODO add 'reject' and 'accepted' buttons
				if (newStatus === "blocked" || newStatus === "rejected") {
					blockProject(projectID, newStatus);
				}
				if (newStatus === "waiting") {
					$("#select-updateInCharge-" + projectID).val("")
				}
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////
function loadProjectMessagesList(start, limit, projectID) {
	//	$("#events-light-list-container").empty();
	var verbe = "get";
	var resource = "messages";
	var extraFilter = "&start=" + start + "&limit=" + limit;
	extraFilter += "&projectID=" + projectID;
	extraFilter += "&order=desc"
	// run
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + extraFilter,
		dataType: "json",
		async: true,
		success: function (events) {
			if (events.hasOwnProperty('success')
				&& events.success == false) {
				// TODO show error message info
			} else {
				if (events.length === 0) {
					// hide more button
					$("#showMoreMessageBtn").hide();
				} else {
					if (events.length < limit) {
						// hide more button
						$("#showMoreMessageBtn").hide();
					}
					$("#noMessageToShow").hide();
					var now = new Date();
					$.each(events, function (k, v) {
						v['messageClean'] = $("<div>").append(v.message).text().replace('"', "&quot;");
						v = eventStatUpdate(v, now);
					});
					$("#messages-light-list-template").tmpl(events).appendTo("#messages-light-list-container");
					$('[data-toggle="tooltip"]').tooltip();
				}
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////
var lastMessageStart = 0;
var lastMessageLimit = 10;
showMoreProjectMessages = function () {
	lastMessageStart += lastEventLimit;
	loadProjectMessagesList(lastMessageStart, lastMessageLimit, lastProjectId);
}
/////////////////////////////////////////////////////////////////////////////////////////
function buildRangeDate() {
	if (getUrlParameter("from") !== undefined) {
		$("#range-date-start").val(getUrlParameter("from"));
	}
	if (getUrlParameter("to") !== undefined) {
		$("#range-date-end").val(getUrlParameter("to"));
	}
	$(document).ready(function () {
		$('.datepicker').datepicker();
	});
}
$('#range-date-update').bind("click", function (e) {
	reloadPage();
});
/////////////////////////////////////////////////////////////////////////////////////////
/**
 * 
 * @param pid
 * @returns
 */
function blockProject(pid, newStatus) {
	$(".blockedOrRejectedCase").hide();
	if (newStatus == "blocked") {
		$("#blockedCase").show();
		$(".blockedCase").show();
	} else if (newStatus == "rejected") {
		$("#rejectedCase").show();
		$(".rejectedCase").show();
	}
	$("#blockedCase_list").val("");
	$("#rejectedCase_list").val("");
	$("#blockedOrRejectedCase_warning").hide();
	$("#blockedOrRejectedCase_txtWarning").hide();
	$("#blockedOrRejectedCase_txt").html("");
	$("#blockedOrRejectedCase_txt").val("");
	$("#closeBlockedModalBtn").attr('onclick', 'closeBlockedModal(' + pid + ');')
	$("#blockedModal").modal('show');
}

/**
 * 
 * @returns
 */
function closeBlockedModal(projectID) {
	const verbe = "put";
	const resource = "stop-project";
	// new 1.0.3: field `reasons` if mandatory
	const rejectList = $("#blockedCase_list").val();
	const blockList = $("#rejectedCase_list").val();
	let reasonsTxt = $("#blockedOrRejectedCase_txt").val();
	reasonsTxt = $.trim(reasonsTxt);
	let goClose = true;
	if (rejectList === null && blockList === null) {
		$("#blockedOrRejectedCase_warning").show();
		goClose = false
	} else {
		$("#blockedOrRejectedCase_warning").hide();
	}
	// mama#34 - reject / paused "reason text" is now optional
	// if (reasonsTxt === "") {
	// 	$("#blockedOrRejectedCase_txtWarning").show();
	// 	goClose = false;
	// } else {
	// 	$("#blockedOrRejectedCase_txtWarning").hide();
	// }
	if (!goClose) {
		return false;
	}
	// run
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&projectID=" + projectID,
		dataType: "json",
		data: "blockedCase=" + ($("#blockedCase_list").val()) +
			"&rejectedCase=" + ($("#rejectedCase_list").val()) +
			"&stoppedReason=" + (encodeURIComponent($("#blockedOrRejectedCase_txt").val())),
		async: true,
		success: function (events) {
			if (events.hasOwnProperty('success')
				&& events.success == false) {
				// TODO show error message info
			} else {
				$("#blockedModal").modal('hide');
			}
		},
		error: function (xhr) {
			console.log(xhr);
		}
	});

};
/////////////////////////////////////////////////////////////////////////////////////////
function printProject(main) {
	var minHead = "";
	minHead += '<meta charset="utf-8">';
	minHead += '<meta http-equiv="X-UA-Compatible" content="IE=edge">';
	minHead += '<meta name="viewport" content="width=device-width, initial-scale=1">';
	minHead += '<meta name="description" content="">';
	minHead += '<meta name="author" content="MetaboHUB">';
	minHead += '<title>MAMA - MetaboHUB Analyses MAnager</title>';
	minHead += '<link rel="icon" type="image/ico" href="images/ico/favicon.ico">';
	minHead += '<script src="js/jquery-2.1.4.min.js"></script>';
	minHead += '<script src="js/jquery.tmpl.min.js"></script>';
	minHead += '<link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">';
	minHead += '<link href="bower_components/metisMenu/dist/metisMenu.min.css" rel="stylesheet">';
	minHead += '<link href="dist/css/timeline.min.css" rel="stylesheet">';
	minHead += '<link href="dist/css/sb-admin-2.min.css" rel="stylesheet">';
	minHead += '<link href="dist/css/sb-admin-2.overwrite.min.css" rel="stylesheet">';
	minHead += '<link href="bower_components/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">';
	minHead += '<script src="dist/js/sb-admin-2.min.js"></script>';
	minHead += '<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>';
	minHead += '<script src="bower_components/metisMenu/dist/metisMenu.min.js"></script>';
	//	minHead +='<script src="bower_components/hightcharts/highcharts.min.js"></script>';
	//	minHead +='<script src="bower_components/hightcharts/modules/exporting.min.js"></script>';
	minHead += '<link href="dist/css/bootstrap-datepicker.min.css" media="screen" rel="stylesheet" type="text/css">';
	minHead += '<script src="dist/js/bootstrap-datepicker.min.js" type="text/javascript"></script>';
	minHead += '<link rel="stylesheet" type="text/css" href="dist/bootstrap3-wysihtml5.min.css">';
	minHead += '<script src="dist/bootstrap3-wysihtml5.all.min.js"></script>';
	minHead += '<!--[if lt IE 9]>';
	minHead += '	<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>';
	minHead += '	<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>';
	minHead += '<![endif]-->';
	minHead += '<script src="js/jquery.localisation.min.js" type="text/javascript"></script>';
	minHead += '<script type="text/javascript" src="dist/js/bootstrap-multiselect.js"></script>';
	minHead += '<link rel="stylesheet" href="dist/css/bootstrap-multiselect.min.css" type="text/css">';
	minHead += '<script type="text/javascript" src="bower_components/moment/moment.min.js"></script>';
	minHead += '<script type="text/javascript" src="bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>';
	minHead += '<link rel="stylesheet" href="bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css">';
	minHead += '<script src="js/main.min.js" type="text/javascript"></script>';
	minHead += '<script src="js/commons.min.js" type="text/javascript"></script>';
	minHead += '<script src="js/md5.min.js" type="text/javascript"></script>';
	minHead += '<link href="css/mama-css.overwrite.min.css" media="screen" rel="stylesheet" type="text/css">';
	var specialScript = '<script type="text/javascript">';
	specialScript += '$(".modal-footer").hide();';
	specialScript += '$(".panel-collapse.collapse").removeClass("collapse");';
	specialScript += '$("#divWriteProjectMessage").parent().hide();';
	specialScript += '$($(".panel-collapse.collapse")[0]).parent().find("a").click()';
	if (main) {
		specialScript += '$("#collapseProjectEvents").parent().hide();';
		specialScript += '$("#collapseProjectMessages").parent().hide();';
	}
	specialScript += '</script>';
	//$("#projectModal.modal-content").print();
	var newWin = window.frames["contentToPrint"];
	newWin.document.write('<head>' + minHead + '</head><body onload="window.print()">' + $("#projectModal .modal-content").html() + specialScript + '</body>');
	newWin.document.close();
	//window.frames["contentToPrint"].print();
}
/////////////////////////////////////////////////////////////////////////////////////////
