function getStandardizedDateFromJson(jsonDate) {
	var stringDateTab = jsonDate.replace(".000000", "").split(" ");
	var yearMonthDay = (stringDateTab[0]).split("-");
	var hoursMinutesSeconds = (stringDateTab[1]).split(":");
	var year = Number(yearMonthDay[0]);
	var month = Number(yearMonthDay[1]);
	var day = Number(yearMonthDay[2]);
	var hours = Number(hoursMinutesSeconds[0]);
	var minutes = Number(hoursMinutesSeconds[1]);
	var secondes = Number(hoursMinutesSeconds[2]);
	return new Date(Date.UTC(year, (month - 1), day, hours, minutes, secondes));
	//	var date = new Date(jsonDate.replace(".000000", ""));
	//	return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}
function getHumanReadableDate(rawDate) {
	return rawDate.toISOString().slice(0, 19).replace(/-/g, '-').replace(/T/g, ' ');
}
function getHumanReadableDateShort(rawDate) {
	return rawDate.toISOString().slice(0, 19).replace(/-/g, '-').replace(/T/g, ' ').split(" ")[0];
}
function convertJsonDateToHumanReadable(jsonDate) {
	var date = getStandardizedDateFromJson(jsonDate);
	return getHumanReadableDate(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())));
}
function convertJsonDateToHumanReadableShort(jsonDate) {
	var date = getStandardizedDateFromJson(jsonDate);
	return getHumanReadableDateShort(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())));
}
/////////////////////////////////////////////////////////////////////////////////////////
function eventStatUpdate(elem, refDate) {
	var d1 = getStandardizedDateFromJson(elem.created.date);
	var nbSeconds = DateDiff.inSeconds(d1, refDate);
	var nbMinutes = DateDiff.inMinutes(d1, refDate);
	if (nbSeconds >= 60) {
		nbSeconds = nbSeconds - (nbMinutes * 60);
	}
	var nbHours = DateDiff.inHours(d1, refDate);
	if (nbMinutes >= 60) {
		nbMinutes = nbMinutes - (nbHours * 60);
	}
	// a short time
	elem['nbSecondsAgo'] = nbSeconds;
	elem['nbMinutsAgo'] = nbMinutes;
	elem['nbHoursAgo'] = nbHours;
	// a loooooong time ago
	elem['nbDaysAgo'] = DateDiff.inDays(d1, refDate);
	elem['nbWeeksAgo'] = DateDiff.inWeeks(d1, refDate);
	elem['nbMonthsAgo'] = DateDiff.inMonths(d1, refDate);
	elem['nbYearsAgo'] = DateDiff.inYears(d1, refDate);
	elem['toogleDate'] = convertJsonDateToHumanReadable(elem.created.date);
	// console.log("elem", elem)
	return elem;
}
/////////////////////////////////////////////////////////////////////////////////////////
function buildPagination(start, limit, filter, target, callBackMethod, totalElem) {
	// reset
	$("#" + target).empty();
	// compute
	var maxInDB = totalElem;
	var maxPage = parseInt((maxInDB / limit), 10) + 1;
	var currentPage = parseInt((start / limit), 10) + 1;
	// first elem
	if (start == 0)
		$("#" + target).append('<li class="disabled"><a href="#">&laquo;</a></li>');
	else
		$("#" + target).append('<li><a href="#" onclick="' + callBackMethod + '(0, ' + limit + ',\'' + filter + '\');">&laquo;</a></li>');
	// elem ...
	if ((currentPage) > 3) {
		$("#" + target).append('<li class="disabled"><a href="#">&hellip;</a></li>');
	}
	// elem n-2
	if (currentPage > 2) {
		prev = (currentPage - 3) * limit;
		$("#" + target).append('<li><a href="#" onclick="' + callBackMethod + '(' + prev + ', ' + limit + ',\'' + filter + '\');">' + (currentPage - 2) + '</a></li>');
	}
	// elem n-1
	if (currentPage > 1) {
		prev = (currentPage - 2) * limit;
		$("#" + target).append('<li><a href="#" onclick="' + callBackMethod + '(' + prev + ', ' + limit + ',\'' + filter + '\');">' + (currentPage - 1) + '</a></li>');
	}
	// elem n (active)
	$("#" + target).append('<li class="active"><a href="#">' + currentPage + '</a></li>');
	// elem n+1
	if ((currentPage + 0) < maxPage) {
		prev = (currentPage) * limit;
		$("#" + target).append('<li><a href="#" onclick="' + callBackMethod + '(' + prev + ', ' + limit + ',\'' + filter + '\');">' + (currentPage + 1) + '</a></li>');
	}
	// elem n+2
	if ((currentPage + 1) < maxPage) {
		prev = (currentPage + 1) * limit;
		$("#" + target).append('<li><a href="#" onclick="' + callBackMethod + '(' + prev + ', ' + limit + ',\'' + filter + '\');">' + (currentPage + 2) + '</a></li>');
	}
	// elem ...
	if ((currentPage + 2) < maxPage) {
		$("#" + target).append('<li class="disabled"><a href="#">&hellip;</a></li>');
	}
	// elem last
	if ((currentPage + 1) >= maxPage)
		$("#" + target).append('<li class="disabled"><a href="#">&raquo;</a></li>');
	else {
		var lastCpt = currentPage + 2;
		var currentMax = (lastCpt) * limit;
		var veryMax = (maxInDB - limit);
		while (veryMax > currentMax) {
			lastCpt++;
			currentMax = (lastCpt) * limit;
		}
		currentMax = (lastCpt) * limit;
		$("#" + target).append('<li><a href="#" onclick="' + callBackMethod + '(' + currentMax + ', ' + limit + ',\'' + filter + '\');">&raquo;</a></li>');
	}
}
/////////////////////////////////////////////////////////////////////////////////////////
var DateDiff = {
	inSeconds: function (d1, d2) {
		var t2 = d2.getTime();
		var t1 = d1.getTime();
		return parseInt((t2 - t1) / (1000));
	},
	inMinutes: function (d1, d2) {
		var t2 = d2.getTime();
		var t1 = d1.getTime();
		return parseInt((t2 - t1) / (60 * 1000));
	},
	inHours: function (d1, d2) {
		var t2 = d2.getTime();
		var t1 = d1.getTime();
		return parseInt((t2 - t1) / (3600 * 1000));
	},
	inDays: function (d1, d2) {
		var t2 = d2.getTime();
		var t1 = d1.getTime();
		return parseInt((t2 - t1) / (24 * 3600 * 1000));
	},
	inWeeks: function (d1, d2) {
		var t2 = d2.getTime();
		var t1 = d1.getTime();
		return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
	},
	inMonths: function (d1, d2) {
		var d1Y = d1.getFullYear();
		var d2Y = d2.getFullYear();
		var d1M = d1.getMonth();
		var d2M = d2.getMonth();
		return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
	},
	inYears: function (d1, d2) {
		return d2.getFullYear() - d1.getFullYear();
	}
}
/////////////////////////////////////////////////////////////////////////////////////////
function getAllProjectsManagers() {
	var listOfUsers = [];
	var verbe = "get";
	var resource = "projects-managers";
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource,
		dataType: "json",
		async: false,
		success: function (users) {
			listOfUsers = users;
			try { listOfUsers.sort(compareUserFullname); } catch (e) { }
		},
		error: function (xhr) {
			console.log(xhr);
		}
	});
	return listOfUsers;
}

function compareUserFullname(a, b) {
	if (a.fullName < b.fullName)
		return -1;
	if (a.fullName > b.fullName)
		return 1;
	return 0;
}
/////////////////////////////////////////////////////////////////////////////////////////
function writeMessageToUserAboutProject(userID, projectID, titleTarget, elem) {
	var userName;
	var messagePrefix = null;
	if (titleTarget !== undefined) {
		userName = $($("#projectTr" + projectID + " td")[titleTarget]).text().trim();
		messagePrefix = $($("#projectTr" + projectID + " td")[1]).html();
		if (elem !== undefined) {
			var e = $(elem);
			console.log(e)
			userName = $($(e)).text().trim(); console.log(userName)
			messagePrefix = $($(e).parent().parent().find("a.pjTitle")).html();
		}
	} else {
		userName = $($("#projectA" + projectID + "")).text().trim();
		messagePrefix = $($("#projectTr" + projectID + " td")[0]).html();
	}
	if (messagePrefix != "") {
		messagePrefix = window['_about_project_start'] + messagePrefix + window['_about_project_end'];
	}
	// init modal
	$("#writeMessageToSPAN").html(userName);
	// init editor
	$("#divWriteMessage").empty().append('<textarea id="writeMessage" class="form-control wysihtml5" rows="3">' + messagePrefix + '</textarea>');
	$('#writeMessage').wysihtml5({
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
		$($(".wysihtml5-toolbar")[0]).append('<li class="pull-right"><small id="writeMessageTxtCount"></small></li>');
		setInterval(function () {
			$("#writeMessageTxtCount").html(2048 - $("#writeMessage").val().length);
		}, 100);
	}, 250);
	// create send message btn callback method
	$("#writeMessageBtn").attr("onclick", "postMessageToUser(" + userID + ");");
	// show modal
	$('#writeMessageModal').modal('show');
	setTimeout(function () { $('#writeMessage').focus(); }, 200);
}
function writeMessageToUser(userID) {
	var userName = $($("#loginUserA" + userID + "")).text().trim();
	// init modal
	$("#writeMessageToSPAN").html(userName);
	// init editor
	$("#divWriteMessage").empty().append('<textarea id="writeMessage" class="form-control wysihtml5" rows="3"></textarea>');
	$('#writeMessage').wysihtml5({
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
		$($(".wysihtml5-toolbar")[0]).append('<li class="pull-right"><small id="writeMessageTxtCount"></small></li>');
		setInterval(function () {
			$("#writeMessageTxtCount").html(2048 - $("#writeMessage").val().length);
		}, 100);
	}, 250);
	// create send message btn callback method
	$("#writeMessageBtn").attr("onclick", "postMessageToUser(" + userID + ");");
	// show modal
	$('#writeMessageModal').modal('show');
	setTimeout(function () { $('#writeMessage').focus(); }, 200);
}
function postMessageToUser(userID) {
	var message = $('#writeMessage').val();
	var verbe = "post";
	var resource = "message";
	if (message == "") {
		return false;
	}
	// run
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe
			+ "&resource=" + resource,
		dataType: "json",
		data: "userID=" + userID + "&message=" + encodeURI(message),
		async: true,
		success: function () {
			$('#writeMessageModal').modal('hide');
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
//function writeMessageToProject(projectID) {}
function postMessageToProject(projectID) {
	var message = $('#writeProjectMessage').val();
	var verbe = "post";
	var resource = "message";
	if (message == "") {
		return false;
	}
	// run
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe
			+ "&resource=" + resource,
		dataType: "json",
		data: "projectID=" + projectID + "&message=" + encodeURI(message),
		async: true,
		success: function () {
			$("#divWriteProjectMessage").parent().hide();
			$("#messages-light-list-container").empty();
			loadProjectMessagesList(0, 10, projectID);
			//			$("#showMoreMessageBtn").show();
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
function openMessage(messageID) {
	// close previous
	$("#projectModal").modal('hide');
	// load message
	var verbe = "get";
	var resource = "message";
	// run
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe
			+ "&resource=" + resource,
		dataType: "json",
		data: "messageID=" + messageID,
		async: true,
		success: function (message) {
			if ((message).hasOwnProperty("success") && message.success == false) {
				return false;
			}
			// convert textarea
			$("#messageModal_replyAllBtn").hide()
			$("#divReplyMessage").empty().append('<textarea id="replyMessage" class="form-control wysihtml5" rows="3"></textarea>');
			$('.wysihtml5').wysihtml5({
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
				$($(".wysihtml5-toolbar")[0]).append('<li class="pull-right"><small id="replyMessageTxtCount"></small></li>');
				setInterval(function () {
					$("#replyMessageTxtCount").html(2048 - $("#replyMessage").val().length);
				}, 100);
			}, 250);
			// render
			if (message.fromProject !== null) {
				$("#messageModal_from").html(message.fromProject.title);
				$("#messageModal_author").html(message.fromProject.title + ' - <i>' + convertJsonDateToHumanReadable(message.created.date) + "</i>");
				$("#messageModal_replyBtn").attr("onclick", "replyTo('project', " + message.fromProject.id + ")");
			} else if (message.fromUser !== null) {
				$("#messageModal_from").html(message.fromUser.fullName);
				$("#messageModal_author").html(message.fromUser.fullName + ' - <i>' + convertJsonDateToHumanReadable(message.created.date) + "</i>");
				$("#messageModal_replyBtn").attr("onclick", "replyTo('user', " + message.fromUser.id + ")");
			}
			if (message.toProject !== null) {
				$("#messageModal_to").html(message.toProject.title);
				$("#messageModal_replyAllBtn").attr("onclick", "replyTo('project', " + message.toProject.id + ")").show();
			} else if (message.toUser !== null) {
				$("#messageModal_to").html(message.toUser.fullName);
			}
			$("#messageModal_message").html(message.message);
			$("#messageModal_linkToMessage").prop("href", "?page=messages&showMessage=" + message.id);
			// show
			$('#messageModal').modal('show');
			// bonus: show message N-1 (only user 2 user messages)
			$("#messageModal_message_n0_p").hide();
			if (message.fromUser != null && message.toUser != null) {
				$.ajax({
					type: "get",
					url: "ajax/ajax_proxypass.php?verbe=get"
						+ "&resource=messages",
					dataType: "json",
					data: "start=0&limit=50&userFilter=sender",
					async: true,
					success: function (messages) {
						if ((messages).hasOwnProperty("success") && message.success == false) {
							return false;
						} else {
							var lastMessage = null;
							$.each(messages, function (k, m) {
								if (m.toUser !== null && m.toUser.id === message.fromUser.id && m.id !== message.id) {
									lastMessage = m;
								}
							});
							if (lastMessage !== null && lastMessage.created.date < message.created.date) {
								console.log(lastMessage);
								$("#messageModal_message_n0").html(lastMessage.message);
								$("#messageModal_author_n0").html(lastMessage.fromUser.fullName + ' - <i>' + convertJsonDateToHumanReadable(lastMessage.created.date) + "</i>");
								$("#messageModal_message_n0_p").show();
							}
						}
					},
					error: function (xhr) {
						console.log(xhr);
					}
				});
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
function replyTo(entity, id) {
	var message = $('#replyMessage').val();
	var verbe = "post";
	var resource = "message";
	if (message == "") {
		return false;
	}
	var targetE = "";
	if (entity == "project") {
		targetE = "projectID=" + id;
	} else if (entity == "user") {
		targetE = "userID=" + id;
	}
	// run
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe
			+ "&resource=" + resource,
		dataType: "json",
		data: targetE + "&message=" + encodeURI(message),
		async: true,
		success: function () {
			$('#messageModal').modal('hide');
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////
function buildMTHplatforms() {
	var verbe = "get";
	var resource = "mth-platforms";
	var extraFilter = "&order=asc&"// deleted=false
	// run
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + extraFilter,
		dataType: "json",
		async: true,
		success: function (platform) {
			if (platform.hasOwnProperty('success')
				&& platform.success == false) {
				// TODO show error message info
			} else {
				if (platform.length === 0) {
					// $("#noKeywordsToShow").show();
				} else {
					$.each(platform, function (k, v) {
						$("#mthPlatforms").append('<option value="mth_pf_' + v.id + '">' + v.name + '</option>');
					});
					// special case - select old search
					if (typeof filterMthPF !== 'undefined' && filterMthPF) {
						$.each(filterMthPFval.split(","), function (k, v) {
							$("#mthPlatforms option[value=" + v + "]").attr("selected", "selected");
						});
					}
				}
				// #42 - multiselect
				$(".multiselect-mthPlatforms").multiselect({
					maxHeight: 500,
					numberDisplayed: 2,
					buttonWidth: '150px',
					// on close function
					onDropdownShow: function (event) {
						window["_buildMTHplatforms_cache_before"] = $("#mthPlatforms").val() + "";
					},
					onDropdownHide: function (event) {
						if ($("#mthPlatforms").val() + "" !== window["_buildMTHplatforms_cache_before"]) {
							addRemoveUserFilter('mth_pf', $("#mthPlatforms").val());
						}
					},
					// texts localization
					filterPlaceholder: _multiselect_mth_platforms_filterPlaceholder,
					nonSelectedText: _multiselect_mth_platforms_nonSelectedText,
					nSelectedText: _multiselect_mth_platforms_nSelectedText,
					allSelectedText: _multiselect_mth_platforms_allSelectedText
				});
			}
		},
		error: function (xhr) {
			console.log(xhr);
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////
function createAppointment(projectID, projectTitle, toUserId, toUserFullName) {
	// load modal tmp txt
	$("#appointment2user__USERNAME").html(toUserFullName);
	$("#appointment2user__PROJECTNAME").html(projectTitle);
	// set modal close function variables
	$("#createAppointmentButton").attr("onclick", "saveAppointment (" + projectID + ", " + toUserId + ")");
	// convert textarea
	$("#divCreateAppointment").empty().append('<textarea id="createAppointment" class="form-control wysihtml5" rows="3"></textarea>');
	$('.wysihtml5').wysihtml5({
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
	// reset
	$("#listNewAppointment").hide().empty();
	// show
	$('#appointmentModalFix').modal('show');

}
function addAppointmentDate() {
	if ($("#new-appointment").val() == "") return;
	$("#listNewAppointment").show();
	var e = '<li class="list-group-item">';
	e += '<span class="pull-right">';
	e += '<button type="button" class="btn btn-danger btn-xs" onclick="deleteAppointment(this)">';
	e += '<span aria-hidden="true"><i class="fa fa-calendar-times-o"></i></span> <span class="sr-only">Cancel</span>';
	e += '</button>';
	e += '</span>';
	e += '<span class="appDateTime">' + $("#new-appointment").val() + '</span>';
	e += '</li>';
	//	$(e).find("span.appDateTime").html($("#new-appointment").val());
	$("#new-appointment").val("");
	$("#listNewAppointment").append(e);
}
function deleteAppointment(e) {
	var elem = $(e);
	elem.parent().parent().remove();
}

function saveAppointment(projectID, userID) {
	// init var
	var tabDates = [];
	var message = $('#createAppointment').val().trim();
	var resource = "appointment";
	var verbe = "post";
	// save the dates!
	$.each($(".appDateTime"), function (k, v) {
		//console.log($(v).html())
		tabDates.push(new Date($(v).html() + ":00").toISOString().replace(/T/g, ' ').substring(0, 19));
	});
	// check
	if (message == "") {
		alert("[error] missing message!");
		return false;
	}
	if (tabDates.length === 0) {
		alert("[error] missing date!");
		return false;
	}
	if ($("#new-appointment").val() != "") {
		alert("[warning] you didn't validate the date \"" + $("#new-appointment").val() + '"')
		return false;
	}
	// ajax POST
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource=" + resource,
		dataType: "json",
		data: "userID=" + userID + "&projectID=" + projectID + "&message=" + encodeURI(message) + "&dates=" + tabDates,
		async: true,
		success: function () {
			$('#appointmentModalFix').modal('hide');
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
function openAppointment(id) {
	var resource = "appointment";
	var verbe = "get";
	// load ajax
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource=" + resource + "&appointmentID=" + id,
		dataType: "json",
		async: true,
		success: function (data) {
			$("#appointmentFromUser__USERNAME").html(data.fromUser.fullName);
			$("#appointmentFromUser__PROJECTNAME").html(data.project.title);
			$("#appointmentFromUser__MESSAGE").html(data.message);
			$("#appointmentFromUser__AUTHOR").html(data.fromUser.fullName + ' - <i>' + convertJsonDateToHumanReadable(data.created.date) + "</i>");
			// load dates
			$("#modalOpenAppointment_listProp").empty();
			$.each(data.appointmentDatesPropositions, function (k, v) {
				var btnClass = '';
				if (v.appointmentSelected == null) {
					btnClass = 'list-group-item-info';
				} else if (v.appointmentSelected) {
					btnClass = 'list-group-item-success';
				} else {
					btnClass = 'list-group-item-danger';
				}
				var li = '<li id="gui_appointmentProp_' + v.id + '" class="list-group-item ' + btnClass + ' gui_appointmentProp_' + data.id + '">';
				li += '<span class="pull-right">';
				if (data.appointmentDate == null) {
					li += '<button type="button" class="btn btn-success btn-xs" onclick="updateGUIappointment(' + v.id + ', ' + data.id + ', true);">';
					li += '<span aria-hidden="true"><i class="fa fa-calendar-check-o"></i></span> <span class="sr-only">accept</span>';
					li += '</button>&nbsp;';
					li += '<button type="button" class="btn btn-danger btn-xs" onclick="updateGUIappointment(' + v.id + ', ' + data.id + ', false);">';
					li += '<span aria-hidden="true"><i class="fa fa-calendar-times-o"></i></span> <span class="sr-only">reject</span>';
					li += '</button>';
				}
				li += '</span>';
				li += '' + convertJsonDateToHumanReadable(v.date.date).substring(0, 16);
				li += '<input type="hidden" value="' + v.id + '">';
				li += '</li>';
				$("#modalOpenAppointment_listProp").append(li);
			});
			// clas btn
			$("#saveAppointmentButton").hide();
			if (data.appointmentDate == null) {
				$("#saveAppointmentButton").show();
				$("#saveAppointmentButton").attr("onclick", "putAppointment (" + data.id + ")");
			}
			$("#saveAppointmentButton").attr("onclick", "putAppointment (" + data.id + ")");
			// show :D
			$('#appointmentModalRead').modal('show');
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
function updateGUIappointment(idProp, idApp, accepted) {
	$("#gui_appointmentProp_" + idProp).removeClass('list-group-item-success').removeClass('list-group-item-danger').removeClass('list-group-item-info');
	//	$("#gui_appointmentProp_" + idProp).addClass('list-group-item-success');
	if (accepted) {
		$(".gui_appointmentProp_" + idApp).removeClass('list-group-item-success').removeClass('list-group-item-danger').removeClass('list-group-item-info');
		$(".gui_appointmentProp_" + idApp).addClass('list-group-item-danger');
		$("#gui_appointmentProp_" + idProp).removeClass('list-group-item-danger').addClass('list-group-item-success');
	} else {
		$("#gui_appointmentProp_" + idProp).addClass('list-group-item-danger');
		// if one info still here, validate
		if ($(".gui_appointmentProp_" + idApp + ".list-group-item-info").length == 1) {
			$($(".gui_appointmentProp_" + idApp + ".list-group-item-info")[0]).removeClass('list-group-item-info').addClass('list-group-item-success');
		}
	}
}
function putAppointment(id) {
	// fetch GUI data
	var appPropPending = [];
	var appPropAccepted = [];
	var appPropRejected = [];
	$.each($(".gui_appointmentProp_" + id + ".list-group-item-info input[type='hidden']"), function (k, v) {
		appPropPending.push(Number($(v).val()));
	});
	$.each($(".gui_appointmentProp_" + id + ".list-group-item-success input[type='hidden']"), function (k, v) {
		appPropAccepted.push(Number($(v).val()));
	});
	$.each($(".gui_appointmentProp_" + id + ".list-group-item-danger input[type='hidden']"), function (k, v) {
		appPropRejected.push(Number($(v).val()));
	});
	//	console.log("[debug]", appPropPending, appPropAccepted, appPropRejected);
	// send ajax request
	var resource = "appointment";
	var verbe = "put";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource=" + resource + "&appointmentID=" + id,
		dataType: "json",
		data: "pending=" + appPropPending + "&accepted=" + appPropAccepted + "&rejected=" + appPropRejected,
		async: true,
		success: function (data) {
			if ('success' in data && data.success) {
				// update HTML content if success
				if (appPropAccepted.length == 1) {
					$("#gui_appointmentProp_" + (appPropAccepted[0]) + " button").remove()
					$("#appointmentDate" + id).html($("#gui_appointmentProp_" + (appPropAccepted[0]) + "").text());
				} else {
					$("#appointmentDate" + id).html(_appointmentChooseDatePrefix + appPropPending.length + _appointmentChooseDateSuffix);
				}
				// hide modal
				$('#appointmentModalRead').modal('hide');
			} else {
				alert("__ERROR__");
			}
		},
		error: function (xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}
/////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
	var nowDate = (new Date()).toISOString().replace("T", " ").substring(0, 16);
	$("#new-appointment").attr("placeholder", nowDate);
	$('.datetimepicker').datetimepicker({
		format: 'YYYY-MM-DD HH:mm',
		minDate: nowDate.substring(0, 10),
		stepping: 10
	});
});
/////////////////////////////////////////////////////////////////////////////////////////
function formatPhoneDial(phoneGroup, phoneNumber) {
	if (phoneNumber != null)
		return "+" + phoneGroup + phoneNumber.replace(/^0/, '').replace(/ /, '');
	else
		return "";
}
function formatPhoneDisplay(phoneGroup, phoneNumber) {
	if (phoneNumber != null) {
		var phoneNum = phoneNumber.replace(/ /, '');
		return "(+" + phoneGroup + ") " + phoneNum.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
	}
	return "";
}
/////////////////////////////////////////////////////////////////////////////////////////
function compareKeyworks(a, b) {
	if (a.word < b.word)
		return -1;
	if (a.word > b.word)
		return 1;
	return 0;
}
/////////////////////////////////////////////////////////////////////////////////////////
// mama#65 - mth sub-PF
function buildMTHsubPlatforms() {
	var verbe = "get";
	var resource = "mth-sub-platforms";
	var extraFilter = "&order=asc&"// deleted=false
	// run
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + extraFilter,
		dataType: "json",
		async: true,
		success: function (platform) {
			if (platform.hasOwnProperty('success')
				&& platform.success == false) {
				// TODO show error message info
			} else {
				if (platform.length === 0) {
					// $("#noKeywordsToShow").show();
				} else {
					$.each(platform, function (k, v) {
						$("#mthSubPlatforms").append('<option value="mth_sub_pf_' + v.id + '">' + v.name + '</option>');
					});
				}
			}
		},
		error: function (xhr) {
			console.log(xhr);
		}
	});
}