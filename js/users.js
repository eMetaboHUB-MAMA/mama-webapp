/////////////////////////////////////////////////////////////////////////////////////////
// dashboard - link listener on buttons
// all
var nbUsersInactive = 0;
var nbUsersNotActivated = 0;
var nbUsersUsers = 0;
var nbUsersProjectManager = 0;
var nbUsersAdmin = 0;
var nbUsersBlocked = 0;

var nbUsersTotal = 0;

var currentUserStatus = null;
var currentUserStart = 0;
var currentUserLimit = 20;
var currentUserKeyword = null;

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
	// load GET params
	if (getUrlParameter("status") !== undefined && getUrlParameter("status") != "null") {
		currentUserStatus = getUrlParameter("status");
		$("#search-users-filter-status").html($("#aUser_"+currentUserStatus).html());
	}
	if (getUrlParameter("keyword") !== undefined) {
		currentUserKeyword = getUrlParameter("keyword");
		$("#usersSearchFilter").val(currentUserKeyword);
	}
	if (currentUserKeyword != null || currentUserStatus != null) {
		$("#link-users-manage").click();
	}
	if (getUrlParameter("start") !== undefined)
		currentUserStart = getUrlParameter("start");
	if (getUrlParameter("limit") !== undefined)
		currentUserLimit = getUrlParameter("limit");
	// /////////////////////////////////////////
	// LOAD USERS STATS
	loadUsersStats();
	if (document.location.toString().indexOf("users") > -1) {
		// /////////////////////////////////////////
		// LOAD USERS LIST
		$("#users-full-list-container").empty();
		$.get('templates/users-full-list-template-' + lang + '.html', function(template) {
			$('body').append(template);
			if (currentUserStatus == null)
				currentUserStatus = "";
			loadUsersList(currentUserStart, currentUserLimit, currentUserStatus);
		});
		// /////////////////////////////////////////
		// LOAD USERS NOTIFICATIONS
		$("#events-light-list-container").empty();
		$.get('templates/events-light-list-template-' + lang + '.html', function(template) {
			$('body').append(template);
			loadEventsList(0, 10, "users");
		});
		//
		$("#usersSearchFilter").bind('keypress', function(e) {
			var code = e.keyCode || e.which;
			if (code == 13) {
				searchUsers();
			}
		});
	}
});
// ///////////////////////////////////////////////////////////////////////////////////////
// functions
/**
 */
function loadUsersStats(filter) {
	var verbe = "get";
	var resource = "users-stats";
	var extraFilter = "";
	if (currentUserKeyword != null)
		extraFilter += "&keywords=" + encodeURIComponent(currentUserKeyword);
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(usersStats) {
			if (usersStats.hasOwnProperty('success')
					&& usersStats.success == false) {
				// TODO show error message info
			} else {
				nbUsersInactive = usersStats['usersInactive'];
				nbUsersNotActivated = usersStats['usersNotActivated'];
				nbUsersUsers = usersStats['usersUsers'];
				nbUsersProjectManager = usersStats['usersProjectManager'];
				nbUsersAdmin = usersStats['usersAdmin'];
				nbUsersBlocked = usersStats['usersBlocked'];

				nbUsersTotal = nbUsersInactive + nbUsersNotActivated + nbUsersUsers + nbUsersProjectManager + nbUsersAdmin + nbUsersBlocked;
				buildUsersChart ();
				//
				$(".panel-warning.panel-users").find(".huge").html(nbUsersNotActivated);
				$(".panel-green.panel-users").find(".huge").html(nbUsersUsers);
				$(".panel-info.panel-users").find(".huge").html(nbUsersProjectManager);
				$(".panel-primary.panel-users").find(".huge").html(nbUsersAdmin);
				$(".panel-red.panel-users").find(".huge").html(nbUsersBlocked);
				$(".panel-lightGray.panel-users").find(".huge").html(nbUsersInactive);
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
function loadUsersList(start, limit, status) {
	$("#users-full-list-container").empty();
	var verbe = "get";
	var resource = "users";
	var extraFilter = "&start=" + start + "&limit=" + limit;
	if (status !== undefined && status !== null) {
		extraFilter += "&status="+status;
	}
	if (currentUserKeyword != null)
		extraFilter += "&keywords=" + encodeURIComponent(currentUserKeyword);
	extraFilter += "&order=desc"
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(users) {
			if (users.hasOwnProperty('success')
					&& users.success == false) {
				// TODO show error message info
			} else {
				if (users.length === 0) {
					$("#noUsersDiv").show();
					$("#tableListUsers").hide();
				} else {
					$("#noUsersDiv").hide();
					$("#tableListUsers").show();
					$.each(users, function(){
						if (this.email == null) return;
						var hash = md5(this.email.toLowerCase());
						var avatar = ("https://secure.gravatar.com/avatar/" + hash + "?s=50&d=identicon" )
						this['avatar'] = avatar;
						$("#noUsersDiv").hide();
						this['createdLocalDate'] = convertJsonDateToHumanReadable(this.created.date);
						if (this.updated !=null) {
							this['updatedLocalDate'] = convertJsonDateToHumanReadable(this.updated.date);;
						}
						this['userStatus'] = "";
						this['userStatusSelectAdmin'] = "";
						this['userStatusSelectProjectManager'] = "";
						this['userStatusSelectUser'] = "";
						this['userStatusSelectBlocked'] = "";
						this['userStatusSelectNotValidated'] = "";
						this['userStatusSelectInactive'] = "";
						this['updateUserDisabled'] = '';
						switch (this.status) {
						case "active":
							switch (this.right) {
							case "admin":
								this['userStatus'] = "primary";
								this['userStatusSelectAdmin'] = "selected";
								break;
							case "project_manager":
								this['userStatus'] = "info";
								this['userStatusSelectProjectManager'] = "selected";
								break;
							case "user":
							default:
								this['userStatus'] = "success";
								this['userStatusSelectUser'] = "selected";
								break;
							}
							break;
						case "inactive":
							this['userStatus'] = "lightGray";
							this['userStatusSelectInactive'] = "selected";
							this['updateUserDisabled'] = 'disabled';
							break;
						case "blocked":
							this['userStatus'] = "danger";
							this['userStatusSelectBlocked'] = "selected";
							break;
						case "not_validated":
						default:
							this['userStatus'] = "warning";
							this['userStatusSelectNotValidated'] = "selected";
							break;
						}
					});
					$("#users-full-list-template").tmpl(users).appendTo("#users-full-list-container");
					// pagination
					var totNb = nbUsersTotal;
					// if filter, other max
					if (status == "not_validated")
						totNb = nbUsersNotActivated;
					else if (status == "user")
						totNb = nbUsersUsers;
					else if (status == "projects_manager")
						totNb = nbUsersProjectManager;
					else if (status == "admin")
						totNb = nbUsersAdmin;
					else if (status == "blocked")
						totNb = nbUsersBlocked;
					else if (status == "inactive")
						totNb = nbUsersInactive;
					if (totNb > limit) {
						buildPagination(start, limit, status, "usersPagination", "loadUsersList", totNb);
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
showMoreUsersEvents = function() {
	lastEventStart += lastEventLimit;
	loadEventsList(lastEventStart, lastEventLimit, "users");
}
/////////////////////////////////////////////////////////////////////////////////////////
updateUserStatusRight = function (userID, elem) {
	var newStatusRight = $(elem).val();
	var verbe = "put";
	var resource = "user-right";
	var params = "";
	params += "&statusRight=" + newStatusRight;
	// run
	$.ajax({
		type : "post",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + "&userID=" + userID,
		dataType : "json",
		async : true,
		data : params,
		success : function(json) {
			if (json.success) {
				// show success info message
				var newClass = "lightGray"
				if (newStatusRight == "blocked") { newClass = "danger"; }
				else if (newStatusRight == "user") { newClass = "success"; }
				else if (newStatusRight == "project_manager") { newClass = "info"; }
				else if (newStatusRight == "admin") { newClass = "primary"; }
				$("#tr_user_" + userID).attr("class", newClass);
			} else {
				// show error message info
				alert("[error] sorry could not upsate user status / rights");
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// show error message info
			alert("[error] sorry could not upsate user status / rights");
		}
	});
	
}

reloadUsersPage = function (newStatus) {
	var newLocation = "?page=users";
	if (newStatus !== undefined)
		newLocation += "&status=" + newStatus;
	else if (currentUserStatus !== null)
		newLocation += "&status=" + currentUserStatus;
	// keyword
	if ($("#usersSearchFilter").val().trim() !="")
		newLocation += "&keyword=" + $("#usersSearchFilter").val().trim();
	document.location = newLocation;
}

searchUsers = function() {
	reloadUsersPage(currentUserStatus);
}

//showProject = function(id) {
//	document.location = "?page=projects&showProject=" + id;
//}
/////////////////////////////////////////////////////////////////////////////////////////
//buildProjectsPagination = function (start, limit, filter) {
//	// reset
//	$("#projectsPagination").empty();
//	// compute
//	var maxInDB = nbProjectsTotal;  // TODO if filter ...
//	var maxPage = parseInt((maxInDB / limit), 10) + 1;
//	var currentPage = parseInt((start / limit), 10) + 1;
//	// first elem
//	if (start == 0)
//		$("#projectsPagination").append('<li class="disabled"><a href="#">&laquo;</a></li>');
//	else 
//		$("#projectsPagination").append('<li><a href="#" onclick="loadProjectsList(0, '+limit+');">&laquo;</a></li>');
//	// elem ...
//	if ((currentPage) > 3) {
//		$("#projectsPagination").append('<li class="disabled"><a href="#">&hellip;</a></li>');
//	}
//	// elem n-2
//	if (currentPage > 2) {
//		prev = (currentPage - 3) * limit;
//		$("#projectsPagination").append('<li><a href="#" onclick="loadProjectsList('+prev+', '+limit+');">'+(currentPage - 2)+'</a></li>');
//	}
//	// elem n-1
//	if (currentPage > 1) {
//		prev = (currentPage - 2) * limit;
//		$("#projectsPagination").append('<li><a href="#" onclick="loadProjectsList('+prev+', '+limit+');">'+(currentPage - 1)+'</a></li>');
//	}
//	// elem n (active)
//	$("#projectsPagination").append('<li class="active"><a href="#">'+currentPage+'</a></li>');
//	// elem n+1
//	if ((currentPage+2) < maxPage) {
//		prev = (currentPage) * limit;
//		$("#projectsPagination").append('<li><a href="#" onclick="loadProjectsList('+prev+', '+limit+');">'+(currentPage + 1)+'</a></li>');
//	}
//	// elem n+2
//	if ((currentPage+3) < maxPage) {
//		prev = (currentPage + 1) * limit;
//		$("#projectsPagination").append('<li><a href="#" onclick="loadProjectsList('+prev+', '+limit+');">'+(currentPage + 2)+'</a></li>');
//	}
//	// elem ...
//	if ((currentPage+4) < maxPage) {
//		$("#projectsPagination").append('<li class="disabled"><a href="#">&hellip;</a></li>');
//	}
//	// elem last
//	if ((currentPage+1) == maxPage)
//		$("#projectsPagination").append('<li class="disabled"><a href="#">&raquo;</a></li>');
//	else 
//		$("#projectsPagination").append('<li><a href="#" onclick="loadProjectsList('+(maxInDB - limit)+', '+limit+');">&raquo;</a></li>');
//}
///////////////////////////////////////////////////////////////////////////////////////////
//var DateDiff = {
//	inSeconds : function(d1, d2) {
//		var t2 = d2.getTime();
//		var t1 = d1.getTime();
//		return parseInt((t2 - t1) / (1000));
//	},
//	inMinutes : function(d1, d2) {
//		var t2 = d2.getTime();
//		var t1 = d1.getTime();
//		return parseInt((t2 - t1) / (60 * 1000));
//	},
//	inHours : function(d1, d2) {
//		var t2 = d2.getTime();
//		var t1 = d1.getTime();
//		return parseInt((t2 - t1) / (3600 * 1000));
//	},
//	inDays : function(d1, d2) {
//		var t2 = d2.getTime();
//		var t1 = d1.getTime();
//		return parseInt((t2 - t1) / (24 * 3600 * 1000));
//	},
//	inWeeks : function(d1, d2) {
//		var t2 = d2.getTime();
//		var t1 = d1.getTime();
//		return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
//	},
//	inMonths : function(d1, d2) {
//		var d1Y = d1.getFullYear();
//		var d2Y = d2.getFullYear();
//		var d1M = d1.getMonth();
//		var d2M = d2.getMonth();
//		return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
//	},
//	inYears : function(d1, d2) {
//		return d2.getFullYear() - d1.getFullYear();
//	}
//}

// ///////////////////////////////////////////////////////////////////////////////////////
// if you read this, you are an awesome person!
