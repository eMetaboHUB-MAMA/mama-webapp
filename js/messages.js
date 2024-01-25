/////////////////////////////////////////////////////////////////////////////////////////
// dashboard - link listener on buttons
// all
var nbMessage = 0;
//
var currentStart = 0;
var currentLimit = 20;
var currentKeyword = null;

var filterUsers = false;
var filterInCharge = false;
var filterInvolved = false;
var filterOwner = false;

var currentFilter = null;

var currentMessageId = null;

// ///////////////////////////////////////////////////////////////////////////////////////
// dashboard - onload stuff
$(document).ready(function() {
	// page localization
	loadLang();
	// /////////////////////////////////////////
	// load GET params
	if (getUrlParameter("keyword") !== undefined) {
		currentKeyword = getUrlParameter("keyword");
		$("#messagesSearchFilter").val(currentKeyword);
	}
	if (getUrlParameter("start") !== undefined)
		currentStart = getUrlParameter("start");
	if (getUrlParameter("limit") !== undefined)
		currentLimit = getUrlParameter("limit");
	// filterInCharge  / filterInvolved
	if (getUrlParameter("userFilter") !== undefined) {
		if (getUrlParameter("userFilter")=='users') {
			filterUsers = true;
			$("#btn-userFilter-users").removeClass('btn-default').addClass('btn-primary');
		} else if (getUrlParameter("userFilter")=='inCharge') {
			filterInCharge = true;
			$("#btn-userFilter-inCharge").removeClass('btn-default').addClass('btn-primary');
		} else if (getUrlParameter("userFilter")=='involved') {
			filterInvolved = true;
			$("#btn-userFilter-involved").removeClass('btn-default').addClass('btn-primary');
		} else if (getUrlParameter("userFilter")=='owner') {
			filterOwner = true;
			$("#btn-userFilter-owner").removeClass('btn-default').addClass('btn-primary');
		}
	}
	// /////////////////////////////////////////
	// LOAD MESSAGES STATS
	loadMessagesStats("");
	// /////////////////////////////////////////
	// LOAD MESSAGES
	$.get('templates/messages-full-list-template-' + lang + '.html', function(template) {
		$('body').append(template);
		loadMessagesList(currentStart, currentLimit, "");
	});
	//
	if (!(userData.right == "admin" || userData.right == "project_manager")) {
		$("#btn-userFilter-inCharge").hide();
		$("#btn-userFilter-involved").hide();
	} 
	$("#messageModal_linkToMessage").hide();
	
	$("#messagesSearchFilter").bind('keypress', function(e) {
		var code = e.keyCode || e.which;
		if (code == 13) {
			searchMessages();
		}
	});
});
// ///////////////////////////////////////////////////////////////////////////////////////
// functions
/**
 */
function loadMessagesStats(filter) {
	var verbe = "get";
	var resource = "messages-count";
	var extraFilter = "";
	var filterMode = false;
	if (filter !== undefined && filter !== null && filter != "") {
		extraFilter += "&filter="+filter;
		filterMode = true;
	}
	if (currentKeyword != null) {
		extraFilter += "&keywords=" + currentKeyword;
		filterMode = true;
	}
	if (filterUsers) {
		extraFilter += '&projectPlaceFilter=users&noUsers=false';
		filterMode = true;
	} else if (filterInCharge) {
		extraFilter += '&projectPlaceFilter=inCharge&noUsers=true';
		filterMode = true;
	} else if (filterInvolved) {
		extraFilter += '&projectPlaceFilter=involved&noUsers=true';
		filterMode = true;
	} else if (filterOwner) {
		extraFilter += '&projectPlaceFilter=owner&noUsers=true';
		filterMode = true;
	}
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(messagesStats) {
			if (messagesStats.hasOwnProperty('success')
					&& messagesStats.success == false) {
				// TODO show error message info
			} else {
				nbMessage = messagesStats;
				if (nbMessage == 0 && !filterMode) {
					$("#noMessagesContent").show();
					$(".listMessagesContent").hide();
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
function loadMessagesList(start, limit, filter) {
	$("#messages-full-list-container").empty();
	var verbe = "get";
	var resource = "messages";
	var extraFilter = "&start=" + start + "&limit=" + limit;
	var filterMode = false;
	if (filter !== undefined && filter !== null && filter != "") {
		extraFilter += "&filter="+filter;
		filterMode = true;
	}
	if (currentKeyword != null) {
		extraFilter += "&keywords=" + currentKeyword;
		filterMode = true;
	}
	if (filterUsers) {
		extraFilter += '&projectPlaceFilter=users&noUsers=false';
		filterMode = true;
	} else if (filterInCharge) {
		extraFilter += '&projectPlaceFilter=inCharge&noUsers=true';
		filterMode = true;
	} else if (filterInvolved) {
		extraFilter += '&projectPlaceFilter=involved&noUsers=true';
		filterMode = true;
	} else if (filterOwner) {
		extraFilter += '&projectPlaceFilter=owner&noUsers=true';
		filterMode = true;
	}
	extraFilter += "&order=desc"
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
				if (messages.length === 0 && !filterMode) {
					$("#noMessagesDiv").show();
					$("#tableListMessages").hide();
				} else {
					$("#noMessagesDiv").hide();
					$.each(messages, function() {
						if (this.fromUser !== null && userData.email != this.fromUser.email) {
							var hash = md5(this.fromUser.email.toLowerCase());
							var avatar = ("https://secure.gravatar.com/avatar/" + hash + "?s=25&d=identicon" )
							this.fromUser['avatar'] = avatar;
						}
						if (this.toUser !== null && userData.email != this.toUser.email ) {
							this.toUser['avatar'] = ("https://secure.gravatar.com/avatar/" + md5(this.toUser.email.toLowerCase()) + "?s=25&d=identicon" );
						}
						this['message'] = $("<div>").append(this.message).text();
						this['createdLocalDate'] = convertJsonDateToHumanReadable(this.created.date);
						// user in charge
					});
					$("#messages-full-list-template").tmpl(messages).appendTo("#messages-full-list-container");
					var totNb = nbMessage; 
					// if filter, other max
//					if (filter == "blocked")
//						totNb = nbMessagesBlocked;
//					else if (filter == "rejected")
//						totNb = nbMessagesRejected;
					// mop
					if (totNb > limit) {
						buildPagination(start, limit, filter, "messagesPagination", "loadMessagesList", totNb);
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
///////////////////////////////////////////////////////////////////////////////

/**
 * 
 */
reloadPage = function (newFilter) {
	var newLocation = "?page=messages";
	if (newFilter !== undefined)
		newLocation += "&filter=" + newFilter;
	else if (currentFilter !== null)
		newLocation += "&filter=" + currentFilter;
	// user filter
	if (filterUsers) {
		newLocation += '&projectPlaceFilter=users&noUsers=false'
	} else if (filterInCharge) {
		newLocation += '&projectPlaceFilter=inCharge&noUsers=true'
	} else if (filterInvolved) {
		newLocation += '&projectPlaceFilter=involved&noUsers=true'
	} else if (filterOwner) {
		newLocation += '&projectPlaceFilter=owner&noUsers=true'
	}
	// keyword
	if ($("#messagesSearchFilter").val().trim() !="")
		newLocation += "&keyword=" + $("#messagesSearchFilter").val().trim();
	document.location = newLocation;
}

/**
 * 
 */
searchMessages = function() {
	reloadPage(currentFilter);
}

/**
 * 
 */
addRemoveUserFilter = function (filter) {
	var newLocation = "?page=messages";
	if (filter == 'users' && !filterUsers) {
		newLocation += '&userFilter=users'
	} else if (filter == 'inCharge' && !filterInCharge) {
		newLocation += '&userFilter=inCharge'
	} else if (filter == 'involved' && !filterInvolved) {
		newLocation += '&userFilter=involved'
	} else if (filter == 'owner' && !filterOwner) {
		newLocation += '&userFilter=owner'
	}
	
	// filter
	if (currentFilter !== null)
		newLocation += "&filter=" + currentFilter;
	// keyword
	if ($("#messagesSearchFilter").val().trim() !="")
		newLocation += "&keyword=" + $("#messagesSearchFilter").val().trim();
	document.location = newLocation;
}

//var lastMessageStart = 0;
//var lastMessageLimit = 10;
//showMoreMessageMessages = function() {
//	lastMessageStart += lastEventLimit;
//	loadMessageMessagesList(lastMessageStart, lastMessageLimit, lastMessageId);
//}