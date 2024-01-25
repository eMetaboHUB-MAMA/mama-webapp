/////////////////////////////////////////////////////////////////////////////////////////
// dashboard - link listener on buttons
// all
var nbAppointment = 0;
//
var currentStart = 0;
var currentLimit = 20;
var currentKeyword = null;

var currentFilter = null;

var currentAppointmentId = null;

// ///////////////////////////////////////////////////////////////////////////////////////
// dashboard - onload stuff
$(document).ready(function() {
	// page localization
	loadLang();
	// /////////////////////////////////////////
	// load GET params
	if (getUrlParameter("keyword") !== undefined) {
		currentKeyword = getUrlParameter("keyword");
		$("#appointmentsSearchFilter").val(currentKeyword);
	}
	if (getUrlParameter("start") !== undefined)
		currentStart = getUrlParameter("start");
	if (getUrlParameter("limit") !== undefined)
		currentLimit = getUrlParameter("limit");
	if (getUrlParameter("filter") !== undefined && getUrlParameter("filter") != "null") {
		currentFilter = getUrlParameter("filter");
		$("#search-appointments-filter-dest").html($("#search-appointments-filter-" + currentFilter).text() );
	}
//	}
	// /////////////////////////////////////////
	// LOAD MESSAGES STATS
	loadAppointmentsStats();
	// /////////////////////////////////////////
	// LOAD MESSAGES
	$.get('templates/appointments-full-list-template-' + lang + '.html', function(template) {
		$('body').append(template);
		loadAppointmentsList(currentStart, currentLimit, "");
	});
	//
	if (!(userData.right == "admin" || userData.right == "project_manager")) {
		$("#btn-userFilter-inCharge").hide();
		$("#btn-userFilter-involved").hide();
	} 
	$("#appointmentModal_linkToAppointment").hide();
	
	$("#appointmentsSearchFilter").bind('keypress', function(e) {
		var code = e.keyCode || e.which;
		if (code == 13) {
			searchAppointments();
		}
	});
});
// ///////////////////////////////////////////////////////////////////////////////////////
// functions
/**
 */
function loadAppointmentsStats() {
	var verbe = "get";
	var resource = "appointments-count";
	var extraFilter = "";
	var filterMode = false;
	if (currentKeyword != null) {
		extraFilter += "&keywords=" + currentKeyword;
		filterMode = true;
	}
	if (currentFilter != null) {
		extraFilter += "&filter=" + currentFilter;
		filterMode = true;
	}
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(appointmentsStats) {
			if (appointmentsStats.hasOwnProperty('success')
					&& appointmentsStats.success == false) {
				// TODO show error appointment info
			} else {
				nbAppointment = appointmentsStats;
				if (nbAppointment == 0 && !filterMode) {
					$("#noAppointmentsContent").show();
					$(".listAppointmentsContent").hide();
				}
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// TODO show error appointment info
		}
	});
}

/**
 */
function loadAppointmentsList(start, limit, filter) {
	$("#appointments-full-list-container").empty();
	var verbe = "get";
	var resource = "appointments";
	var filterMode = false;
	var extraFilter = "&start=" + start + "&limit=" + limit;
	if (filter !== undefined && filter !== null) {
		extraFilter += "&filter="+filter;
		filterMode = true;
	}
	if (currentKeyword != null) {
		extraFilter += "&keywords=" + currentKeyword;
		filterMode = true;
	}
	if (currentFilter != null) {
		extraFilter += "&filter=" + currentFilter;
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
		success : function(appointments) {
			if (appointments.hasOwnProperty('success')
					&& appointments.success == false) {
				// TODO show error appointment info
			} else {
				if (appointments.length === 0 && !filterMode) {
					$("#noAppointmentsDiv").show();
					$("#tableListAppointments").hide();
				} else {
					$("#noAppointmentsDiv").hide();
					$.each(appointments, function() {
						if (this.fromUser !== null) {
							var hash = md5(this.fromUser.email.toLowerCase());
							var avatar = ("https://secure.gravatar.com/avatar/" + hash + "?s=25&d=identicon" )
							this.fromUser['avatar'] = avatar;
							if (this.fromUser.email == userData.email ) {
								this.fromUser.id = null;
							} else {
								this.fromUser.phoneDial = formatPhoneDial(this.fromUser.phoneGroup, this.fromUser.phoneNumber);
								this.fromUser.phoneDisplay = formatPhoneDisplay(this.fromUser.phoneGroup, this.fromUser.phoneNumber);
							}
						}
						if (this.toUser !== null) {
							var hash = md5(this.toUser.email.toLowerCase());
							var avatar = ("https://secure.gravatar.com/avatar/" + hash + "?s=25&d=identicon" )
							this.toUser['avatar'] = avatar;
							if (this.toUser.email == userData.email ) {
								this.toUser.id = null;
							} else {
								this.toUser.phoneDial = formatPhoneDial(this.toUser.phoneGroup, this.toUser.phoneNumber);
								this.toUser.phoneDisplay = formatPhoneDisplay(this.toUser.phoneGroup, this.toUser.phoneNumber);
							}
						}
						this['message'] = $("<div>").append(this.message).text();
						this['dateToChoose'] = "";
						if (this.appointmentDate != null) {
							this['dateToChoose'] = convertJsonDateToHumanReadable(this.appointmentDate.date).substring(0, 16);
						} else {
							// display nb to choose
							var nbToChoose = 0;
							$.each(this.appointmentDatesPropositions, function (k, v) {
								if (v.appointmentSelected == null) {
									nbToChoose++;
								}
							});
							this['dateToChoose'] = _appointmentChooseDatePrefix + nbToChoose + _appointmentChooseDateSuffix
						}
						this['createdLocalDate'] = convertJsonDateToHumanReadable(this.created.date);
						// user in charge
					});
					$("#appointments-full-list-template").tmpl(appointments).appendTo("#appointments-full-list-container");
					var totNb = nbAppointment; 
					// mop
					if (totNb > limit) {
						buildPagination(start, limit, filter, "appointmentsPagination", "loadAppointmentsList", totNb);
					}
				}
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// TODO show error appointment info
		}
	});
} 
///////////////////////////////////////////////////////////////////////////////

/**
 * 
 */
reloadPage = function (newFilter) {
	var newLocation = "?page=appointments";
	if (newFilter !== undefined)
		newLocation += "&filter=" + newFilter;
	else if (currentFilter !== null)
		newLocation += "&filter=" + currentFilter;
	// keyword
	if ($("#appointmentsSearchFilter").val().trim() !="")
		newLocation += "&keyword=" + $("#appointmentsSearchFilter").val().trim();
	document.location = newLocation;
}

/**
 * 
 */
searchAppointments = function() {
	reloadPage(currentFilter);
}

