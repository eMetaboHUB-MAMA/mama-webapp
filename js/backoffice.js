///////////////////////////////////////////////////////////////////////////////
// memory usage graph
$(function () {
	var serieCpuLoad1;
	var serieMemUsed;
	var lastCPU1 = 0;
	var lastCPU5 = 0;
	var lastCPU15 = 0;
	var lastRAM = 0;

	$(document).ready(
		function () {
			// opt
			Highcharts.setOptions({
				global: {
					useUTC: false
				}
			});

			// chart
			$('#container-update').highcharts({
				chart: {
					type: 'spline',
					animation: Highcharts.svg,
					events: {
						load: function () {
							serieCpuLoad1 = this.series[0];
							serieCpuLoad5 = this.series[1];
							serieCpuLoad15 = this.series[2];
							serieMemUsed = this.series[3];
							setInterval(function () {
								// current time
								var x = (new Date()).getTime();
								// update
								var verbe = "get";
								var resource = "server-load";
								$.ajax({
									type: "get",
									url: "ajax/ajax_proxypass.php?verbe="
										+ verbe
										+ "&resource="
										+ resource,
									dataType: "json",
									async: true,
									data: "",
									success: function (data) {
										serieMemUsed.addPoint([x, data['ram']], true, true);
										serieCpuLoad1.addPoint([x, data['cpu-1-min']], true, true);
										serieCpuLoad5.addPoint([x, data['cpu-5-min']], true, true);
										serieCpuLoad15.addPoint([x, data['cpu-15-min']], true, true);
									},
									error: function (xhr) {
										console.log(xhr);
									}
								}); // ajax
							}, 1000); // setInterval
						}//load
					}
				},
				title: {
					text: 'Server status'
				},
				xAxis: [{
					type: 'datetime',
					tickPixelInterval: 120
				}],
				yAxis: [{
					min: 0,
					title: {
						text: 'CPU Usage (%)'
					},
					gridLineWidth: 0,
					opposite: true,
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				}, {
					min: 0,
					max: 100,
					title: {
						text: 'RAM Usage (%)'
					},
					gridLineWidth: 0,
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				}],
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.name + '</b><br/>'
							+ Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)
							+ '<br/>'
							+ Highcharts.numberFormat(this.y, 2) + "%";
					}
				},
				legend: {
					enabled: true
				},
				exporting: {
					enabled: false
				},
				// init series
				series: [{
					name: 'CPU load <small>(last minute)</small>',
					yAxis: 0,
					data: (function () {
						// generate an array of 'flat' data
						var data = [], time = (new Date()).getTime(), i;
						for (i = -500; i <= 0; i += 1) {
							data.push({ x: time + i * 1000, y: 0 });
						}
						return data;
					}())
				}, {
					name: 'CPU load <small>(last 5 minutes)</small>',
					yAxis: 0,
					data: (function () {
						// generate an array of 'flat' data
						var data = [], time = (new Date()).getTime(), i;
						for (i = -500; i <= 0; i += 1) {
							data.push({ x: time + i * 1000, y: 0 });
						}
						return data;
					}())
				}, {
					name: 'CPU load <small>(last 15 minutes)</small>',
					yAxis: 0,
					data: (function () {
						// generate an array of 'flat' data
						var data = [], time = (new Date()).getTime(), i;
						for (i = -500; i <= 0; i += 1) {
							data.push({ x: time + i * 1000, y: 0 });
						}
						return data;
					}())
				}, {
					name: 'Memory usage',
					yAxis: 1,
					data: (function () {
						// generate an array of 'flat' data
						var data = [], time = (new Date()).getTime(), i;
						for (i = -500; i <= 0; i += 1) {
							data.push({ x: time + i * 1000, y: 0 });
						}
						return data;
					}())
				}]
			});
		});
});
///////////////////////////////////////////////////////////////////////////////
//memory usage graph

var keywordTemplateLoaded = false;
var subKeywordTemplateLoaded = false;
var managerKeywordTemplateLoaded = false; //mama#66
var mthPlatformTemplateLoaded = false;
var mthSubPlatformTemplateLoaded = false; // mama#65

/**
 * load keywords
 */
loadKeywords = function () {
	if (!keywordTemplateLoaded) {
		$.get('templates/keywords-light-list-template.html', function (
			template) {
			$('body').append(template);
			keywordTemplateLoaded = true;
			loadKeywords();
		});
	} else {
		$("#keywords-light-list-container").empty();
		// 
		var verbe = "get";
		var resource = "keywords";
		var extraFilter = "&order=asc"
		// run
		$.ajax({
			type: "get",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe
				+ "&resource=" + resource + extraFilter,
			dataType: "json",
			async: true,
			success: function (keywords) {
				if (keywords.hasOwnProperty('success')
					&& keywords.success == false) {
					// TODO show error message info
				} else {
					if (keywords.length === 0) {
						$("#noKeywordsToShow").show();
					} else {
						keywords.sort(compareKeyworks);
						$("#noKeywordsToShow").hide();
						$("#keywords-light-list-template").tmpl(
							keywords).appendTo(
								"#keywords-light-list-container");
					}
				}
			},
			error: function (xhr) {
				console.log(xhr);
				// TODO show error message info
			}
		});
	}
}
loadKeywords();

/**
 * load subkeywords
 */
loadSubKeywords = function () {
	if (!subKeywordTemplateLoaded) {
		$.get('templates/subkeywords-light-list-template.html', function (
			template) {
			$('body').append(template);
			subKeywordTemplateLoaded = true;
			loadSubKeywords();
		});
	} else {
		$("#subkeywords-light-list-container").empty();
		// 
		var verbe = "get";
		var resource = "subkeywords";
		var extraFilter = "&order=asc"
		// run
		$.ajax({
			type: "get",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe
				+ "&resource=" + resource + extraFilter,
			dataType: "json",
			async: true,
			success: function (keywords) {
				if (keywords.hasOwnProperty('success')
					&& keywords.success == false) {
					// TODO show error message info
				} else {
					if (keywords.length === 0) {
						$("#noSubKeywordsToShow").show();
					} else {
						keywords.sort(compareKeyworks);
						$("#noSubKeywordsToShow").hide();
						$("#subkeywords-light-list-template").tmpl(
							keywords).appendTo(
								"#subkeywords-light-list-container");
					}
				}
			},
			error: function (xhr) {
				console.log(xhr);
				// TODO show error message info
			}
		});
	}
}
loadSubKeywords();

/**
 * load mthPlatforms
 */
loadMTHPlatforms = function () {
	if (!mthPlatformTemplateLoaded) {
		$.get('templates/mthPlatforms-light-list-template.html', function (
			template) {
			$('body').append(template);
			mthPlatformTemplateLoaded = true;
			loadMTHPlatforms();
		});
	} else {
		$("#mthPlatforms-light-list-container").empty();
		// 
		var verbe = "get";
		var resource = "mth-platforms";
		var extraFilter = "&order=asc"
		// run
		$.ajax({
			type: "get",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe
				+ "&resource=" + resource + extraFilter,
			dataType: "json",
			async: true,
			success: function (mthPlatforms) {
				if (mthPlatforms.hasOwnProperty('success')
					&& mthPlatforms.success == false) {
					// TODO show error message info
				} else {
					if (mthPlatforms.length === 0) {
						$("#noMTHPlatformsToShow").show();
					} else {
						$("#noMTHPlatformsToShow").hide();
						$("#mthPlatforms-light-list-template").tmpl(
							mthPlatforms).appendTo(
								"#mthPlatforms-light-list-container");
					}
				}
			},
			error: function (xhr) {
				console.log(xhr);
				// TODO show error message info
			}
		});
	}
}
loadMTHPlatforms();

/**
 * add a keyword
 */
addNewKeyword = function () {
	if ($("#newKeyword").val() == "") {
		return false;
	}
	var params = "keyword=" + $("#newKeyword").val();
	var verbe = "post";
	var resource = "keyword";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadKeywords();
				$("#newKeyword").val("");
			} else {
				//
				alert("[error] sorry, could not add keyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			//
			alert("[error] sorry, could not add keyword.")
		}
	});
	return false;
}

//bind enter key on create keyword
$('#newKeyword').on('keypress', function (e) {
	if (e.key === 'Enter') {
		addNewKeyword();
	}
});

/**
 * add a subkeyword
 */
addNewSubKeyword = function () {
	if ($("#newSubKeyword").val() == "") {
		return false;
	}
	var params = "keyword=" + $("#newSubKeyword").val();
	var verbe = "post";
	var resource = "subkeyword";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadSubKeywords();
				$("#newSubKeyword").val("");
			} else {
				//
				alert("[error] sorry, could not add subkeyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			alert("[error] sorry, could not add subkeyword.")
		}
	});
	return false;
}

//bind enter key on create keyword
$('#newSubKeyword').on('keypress', function (e) {
	if (e.key === 'Enter') {
		addNewSubKeyword();
	}
});

/**
 * add a mthPlatform
 */
addNewMTHPlatform = function () {
	var params = "mthPlatform=" + $("#newMTHPlatform").val();
	var verbe = "post";
	var resource = "mth-platform";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadMTHPlatforms();
				$("#newMTHPlatform").val("");
			} else {
				//
				alert("[error] sorry, could not add MTH platform.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			//
			alert("[error] sorry, could not add MTH platform.")
		}
	});
	return false;
}

//bind enter key on create mthPlatform
$('#newMTHPlatform').on('keypress', function (e) {
	if (e.key === 'Enter') {
		addNewMTHPlatform();
	}
});

var saveAdminObject = function () { }

//bind enter key on create keyword
$('#newName').on('keypress', function (e) {
	if (e.key === 'Enter') {
		saveAdminObject();
	}
});

/**
 * edit a keyword
 */
editKeyword = function (id, oldKeyword) {
	$("#adminEntity").html(oldKeyword);
	$("#newName").val("");
	$("#newName").attr("placeholder", "" + oldKeyword);
	$("#adminEditEntityModal").modal("show");
	setTimeout(function () { $("#newName").trigger('focus'); }, 250);
	// rewrite function
	saveAdminObject = function () {
		keyword = $("#newName").val();
		if (keyword === null)
			return false;
		var params = "keyword=" + keyword;
		var verbe = "put";
		var resource = "keyword";
		var extraGet = "keywordID=" + id;
		$.ajax({
			type: "post",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + "&" + extraGet,
			dataType: "json",
			async: true,
			data: params,
			success: function (data) {
				// console.log(data);
				if (data.success) {
					loadKeywords();
					return true;
				} else {
					//
					alert("[error] sorry, could not edit keyword.")
				}
			},
			error: function (xhr) {
				console.log(xhr);
				//
				alert("[error] sorry, could not edit keyword.")
			}
		});
		$("#adminEditEntityModal").modal("hide");
		saveAdminObject = function () { }
		return false;
	}
}

/**
 * edit a subkeyword
 */
editSubKeyword = function (id, oldKeyword) {
	$("#adminEntity").html(oldKeyword);
	$("#newName").val("");
	$("#newName").attr("placeholder", "" + oldKeyword);
	$("#adminEditEntityModal").modal("show");
	setTimeout(function () { $("#newName").trigger('focus'); }, 250);
	// rewrite function
	saveAdminObject = function () {
		keyword = $("#newName").val();
		if (keyword === null)
			return false;
		var params = "keyword=" + keyword;
		var verbe = "put";
		var resource = "subkeyword";
		var extraGet = "keywordID=" + id;
		$.ajax({
			type: "post",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + "&" + extraGet,
			dataType: "json",
			async: true,
			data: params,
			success: function (data) {
				// console.log(data);
				if (data.success) {
					loadSubKeywords();
					return true;
				} else {
					//
					alert("[error] sorry, could not edit subkeyword.")
				}
			},
			error: function (xhr) {
				console.log(xhr);
				alert("[error] sorry, could not edit subkeyword.")
			}
		});
		$("#adminEditEntityModal").modal("hide");
		saveAdminObject = function () { }
		return false;
	}
}

/**
 * edit a mthPlatform
 */
editMTHPlatform = function (id, oldMTHPlatform) {
	$("#adminEntity").html(oldMTHPlatform);
	$("#newName").val("");
	$("#newName").attr("placeholder", "" + oldMTHPlatform);
	$("#adminEditEntityModal").modal("show");
	setTimeout(function () { $("#newName").trigger('focus'); }, 250);
	// rewrite function
	saveAdminObject = function () {
		mthPlatform = $("#newName").val();
		if (mthPlatform === null)
			return false;
		var params = "mthPlatform=" + mthPlatform;
		var verbe = "put";
		var resource = "mth-platform";
		var extraGet = "mthPlatformID=" + id;
		$.ajax({
			type: "post",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + "&" + extraGet,
			dataType: "json",
			async: true,
			data: params,
			success: function (data) {
				// console.log(data);
				if (data.success) {
					loadMTHPlatforms();
					return true;
				} else {
					//
					alert("[error] sorry, could not edit MTH Platform.")
				}
			},
			error: function (xhr) {
				console.log(xhr);
				//
				alert("[error] sorry, could not edit MTH Platform.")
			}
		});
		$("#adminEditEntityModal").modal("hide");
		saveAdminObject = function () { }
		return false;
	}
}

/**
 * restore a keyword
 */
restoreKeyword = function (id) {
	var params = "deleted=false";
	var verbe = "put";
	var resource = "keyword";
	var extraGet = "keywordID=" + id;
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&" + extraGet,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadKeywords();
				return true;
			} else {
				//
				alert("[error] sorry, could not edit keyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			//
			alert("[error] sorry, could not edit keyword.")
		}
	});
	return false;
}

/**
 * delete a keyword
 */
deleteKeyword = function (id) {
	var params = "deleted=true";
	var verbe = "put";
	var resource = "keyword";
	var extraGet = "keywordID=" + id;
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&" + extraGet,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadKeywords();
				return true;
			} else {
				//
				alert("[error] sorry, could not edit keyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			//
			alert("[error] sorry, could not edit keyword.")
		}
	});
	return false;
}

/**
 * restore a subkeyword
 */
restoreSubKeyword = function (id) {
	var params = "deleted=false";
	var verbe = "put";
	var resource = "subkeyword";
	var extraGet = "keywordID=" + id;
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&" + extraGet,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadSubKeywords();
				return true;
			} else {
				//
				alert("[error] sorry, could not edit subkeyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			alert("[error] sorry, could not edit subkeyword.")
		}
	});
	return false;
}

/**
 * delete a subkeyword
 */
deleteSubKeyword = function (id) {
	var params = "deleted=true";
	var verbe = "put";
	var resource = "subkeyword";
	var extraGet = "keywordID=" + id;
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&" + extraGet,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadSubKeywords();
				return true;
			} else {
				alert("[error] sorry, could not edit subkeyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			alert("[error] sorry, could not edit subkeyword.")
		}
	});
	return false;
}

///////////////////////////////////////////////////////////////////////////////
var logStep = 20;
/**
 * 
 * @param from
 * @param to
 * @param file
 * @returns
 */
function showLogs(from, to, file) {
	from = Number(from);
	to = Number(to);
	var resource = "admin/show-logs/" + file;
	var params = "from=" + from + "&to=" + to;
	var verbe = "get";
	if (from === 1)
		$("#logContent").html("");
	// init
	$(".btn-showlog").attr("disabled", false);
	$.ajax({
		type: "get",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource=" + resource,
		dataType: "text",
		async: true,
		data: params,
		success: function (data) {
			// load
			$("#logContent").html($("#logContent").html() + data.replace(new RegExp("\n", 'g'), "\n<br />"));
			// show modal
			$("#adminShowLogsModal").modal("show");
			// next
			if (data.split("\n").length < logStep) {
				$("#btnMoreLogs").attr("disabled", true);
			} else {
				$("#btnMoreLogs").attr("disabled", false);
				$("#btnMoreLogs").attr("onclick", "showLogs (" + (from + logStep) + ", " + (to + logStep) + ", '" + file + "')");
			}
			// other
			if (file == "daily-mailler")
				$("#showLogDailyMaillerBtn").attr("disabled", true);
			if (file == "weekly-mailler")
				$("#showLogweeklyMaillerBtn").attr("disabled", true);
			if (file == "monthly-users_inactiver")
				$("#showLogMontlhyUsersInactiverBtn").attr("disabled", true);
		},
		error: function (xhr) {
			console.log(xhr);
			alert("[error] sorry, could show logs")
		}
	});
	return true;
}

/**
 * 
 * @returns
 */
function cleanTokens() {
	$("#btnCleanTokens").removeClass("btn-primary").addClass("btn-warning");
	$("#btnCleanTokens").html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
	var params = "nbHours=" + $("#cleanTokenNbHours").val();
	var verbe = "delete";
	var resource = "admin/clean-tokens";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource=" + resource,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				$("#btnCleanTokens").removeClass("btn-warning").addClass("btn-success");
				$("#btnCleanTokens").html('<i class="fa fa-check-circle"></i>');
				return true;
			} else {
				$("#btnCleanTokens").removeClass("btn-warning").addClass("btn-danger");
				$("#btnCleanTokens").html('<i class="fa fa-times-circle"></i>');
				return false;
			}
		},
		error: function (xhr) {
			console.log(xhr);
			$("#btnCleanTokens").removeClass("btn-warning").addClass("btn-danger");
			$("#btnCleanTokens").html('<i class="fa fa-times-circle"></i>');
			return false;
		}
	});
	return false;
}

/**
 * 
 * @returns
 */
function archiveProjects() {
	$("#btnArchiveProjects").removeClass("btn-primary").addClass("btn-warning");
	$("#btnArchiveProjects").html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
	var params = "nbYears=" + $("#archiveProjectNbYears").val();
	var verbe = "put";
	var resource = "admin/archive-projects";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource=" + resource,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				$("#btnArchiveProjects").removeClass("btn-warning").addClass("btn-success");
				$("#btnArchiveProjects").html('<i class="fa fa-check-circle"></i>');
				return true;
			} else {
				$("#btnArchiveProjects").removeClass("btn-warning").addClass("btn-danger");
				$("#btnArchiveProjects").html('<i class="fa fa-times-circle"></i>');
				return false;
			}
		},
		error: function (xhr) {
			console.log(xhr);
			$("#btnArchiveProjects").removeClass("btn-warning").addClass("btn-danger");
			$("#btnArchiveProjects").html('<i class="fa fa-times-circle"></i>');
			return false;
		}
	});
	return false;
}

/**
 * 
 * @returns
 */
function inactiveUsers() {
	$("#btnInactiveUsers").removeClass("btn-primary").addClass("btn-warning");
	$("#btnInactiveUsers").html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
	var params = "nbWeeks=" + $("#inactiveUsersNbWeeks").val();
	var verbe = "put";
	var resource = "admin/inactive-users";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource=" + resource,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				$("#btnInactiveUsers").removeClass("btn-warning").addClass("btn-success");
				$("#btnInactiveUsers").html('<i class="fa fa-check-circle"></i>');
				return true;
			} else {
				$("#btnInactiveUsers").removeClass("btn-warning").addClass("btn-danger");
				$("#btnInactiveUsers").html('<i class="fa fa-times-circle"></i>');
				return false;
			}
		},
		error: function (xhr) {
			console.log(xhr);
			$("#btnInactiveUsers").removeClass("btn-warning").addClass("btn-danger");
			$("#btnInactiveUsers").html('<i class="fa fa-times-circle"></i>');
			return false;
		}
	});
	return false;
}

/**
 * 
 * @returns
 */
function cleanUploaded() {
	//$("#cleanUploadedMessage").html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
	$("#cleanUploadFiles i").removeClass("fa-eraser").addClass('fa-spin').addClass('fa-spinner');
	$("#cleanUploadFiles").attr("disabled", true);
	$("#cleanUploadFiles").removeClass("btn-primary").addClass("btn-warning");
	var verbe = "put";
	var resource = "admin/clean-uploaded-files";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource=" + resource,
		dataType: "json",
		async: true,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				$("#cleanUploadedMessage").html('<small>clean ' + data['nb-deleted'] + ' file(s)!</small>');
				$("#cleanUploadFiles i").removeClass('fa-spin').removeClass('fa-spinner').addClass('fa-check-circle');
				$("#cleanUploadFiles").removeClass("btn-warning").addClass("btn-success");
				return true;
			} else {
				$("#cleanUploadFiles i").removeClass('fa-spin').removeClass('fa-spinner').addClass('fa-times-circle');
				$("#cleanUploadFiles").removeClass("btn-warning").addClass("btn-danger");
				return false;
			}
		},
		error: function (xhr) {
			console.log(xhr);
			$("#cleanUploadFiles i").removeClass('fa-spin').removeClass('fa-spinner').addClass('fa-times-circle');
			$("#cleanUploadFiles").removeClass("btn-warning").addClass("btn-danger");
			return false;
		}
	});
	return false;
}

// mama#66

/**
 * load managerkeywords
 */
loadManagerKeywords = function () {
	if (!managerKeywordTemplateLoaded) {
		$.get('templates/managerkeywords-light-list-template.html',
			function (template) {
				$('body').append(template);
				managerKeywordTemplateLoaded = true;
				loadManagerKeywords();
			});
	} else {
		$("#managerkeywords-light-list-container").empty();
		// 
		var verbe = "get";
		var resource = "managerkeywords";
		var extraFilter = "&order=asc"
		// run
		$.ajax({
			type: "get",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe
				+ "&resource=" + resource + extraFilter,
			dataType: "json",
			async: true,
			success: function (keywords) {
				if (keywords.hasOwnProperty('success')
					&& keywords.success == false) {
					// TODO show error message info
				} else {
					if (keywords.length === 0) {
						$("#noManagerKeywordsToShow").show();
					} else {
						keywords.sort(compareKeyworks);
						$("#noManagerKeywordsToShow").hide();
						$("#managerkeywords-light-list-template")
							.tmpl(keywords)
							.appendTo("#managerkeywords-light-list-container");
					}
				}
			},
			error: function (xhr) {
				console.log(xhr);
				// TODO show error message info
			}
		});
	}
}
loadManagerKeywords();

/**
 * add a managerkeyword
 */
addNewManagerKeyword = function () {
	if ($("#newManagerKeyword").val() == "") {
		return false;
	}
	var params = "keyword=" + $("#newManagerKeyword").val();
	var verbe = "post";
	var resource = "managerkeyword";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadManagerKeywords();
				$("#newManagerKeyword").val("");
			} else {
				//
				alert("[error] sorry, could not add manager keyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			alert("[error] sorry, could not add manager keyword.")
		}
	});
	return false;
}

//bind enter key on create keyword
$('#newManagerKeyword').on('keypress', function (e) {
	if (e.key === 'Enter') {
		addNewManagerKeyword();
	}
});

/**
 * edit a managerkeyword
 */
editManagerKeyword = function (id, oldKeyword) {
	$("#adminEntity").html(oldKeyword);
	$("#newName").val("");
	$("#newName").attr("placeholder", "" + oldKeyword);
	$("#adminEditEntityModal").modal("show");
	setTimeout(function () { $("#newName").trigger('focus'); }, 250);
	// rewrite function
	saveAdminObject = function () {
		keyword = $("#newName").val();
		if (keyword === null)
			return false;
		var params = "keyword=" + keyword;
		var verbe = "put";
		var resource = "managerkeyword";
		var extraGet = "keywordID=" + id;
		$.ajax({
			type: "post",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + "&" + extraGet,
			dataType: "json",
			async: true,
			data: params,
			success: function (data) {
				// console.log(data);
				if (data.success) {
					loadManagerKeywords();
					return true;
				} else {
					//
					alert("[error] sorry, could not edit manager keyword.")
				}
			},
			error: function (xhr) {
				console.log(xhr);
				alert("[error] sorry, could not edit manager keyword.")
			}
		});
		$("#adminEditEntityModal").modal("hide");
		saveAdminObject = function () { }
		return false;
	}
}

/**
 * restore a managerkeyword
 */
restoreManagerKeyword = function (id) {
	var params = "deleted=false";
	var verbe = "put";
	var resource = "managerkeyword";
	var extraGet = "keywordID=" + id;
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&" + extraGet,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadManagerKeywords();
				return true;
			} else {
				//
				alert("[error] sorry, could not edit managerkeyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			alert("[error] sorry, could not edit managerkeyword.")
		}
	});
	return false;
}

/**
 * delete a managerkeyword
 */
deleteManagerKeyword = function (id) {
	var params = "deleted=true";
	var verbe = "put";
	var resource = "managerkeyword";
	var extraGet = "keywordID=" + id;
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource + "&" + extraGet,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadManagerKeywords();
				return true;
			} else {
				alert("[error] sorry, could not edit manager keyword.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			alert("[error] sorry, could not edit manager keyword.")
		}
	});
	return false;
}

// mama#65
loadMTHSubPlatforms = function () {
	if (!mthSubPlatformTemplateLoaded) {
		$.get('templates/mthSubPlatforms-light-list-template.html',
			function (template) {
				$('body').append(template);
				mthSubPlatformTemplateLoaded = true;
				loadMTHSubPlatforms();
			});
	} else {
		$("#mthSubPlatforms-light-list-container").empty();
		// 
		var verbe = "get";
		var resource = "mth-sub-platforms";
		var extraFilter = "&order=asc"
		// run
		$.ajax({
			type: "get",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe
				+ "&resource=" + resource + extraFilter,
			dataType: "json",
			async: true,
			success: function (mthPlatforms) {
				if (mthPlatforms.hasOwnProperty('success')
					&& mthPlatforms.success == false) {
					// TODO show error message info
				} else {
					if (mthPlatforms.length === 0) {
						$("#noMTHSubPlatformsToShow").show();
					} else {
						$("#noMTHSubPlatformsToShow").hide();
						$("#mthSubPlatforms-light-list-template")
							.tmpl(mthPlatforms)
							.appendTo("#mthSubPlatforms-light-list-container");
					}
				}
			},
			error: function (xhr) {
				console.log(xhr);
				// TODO show error message info
			}
		});
	}
}
loadMTHSubPlatforms();

addNewMTHSubPlatform = function () {
	var params = "mthSubPlatform=" + $("#newMTHSubPlatform").val();
	var verbe = "post";
	var resource = "mth-sub-platform";
	$.ajax({
		type: "post",
		url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
			+ resource,
		dataType: "json",
		async: true,
		data: params,
		success: function (data) {
			// console.log(data);
			if (data.success) {
				loadMTHSubPlatforms();
				$("#newMTHSubPlatform").val("");
			} else {
				//
				alert("[error] sorry, could not add MTH sub platform.")
			}
		},
		error: function (xhr) {
			console.log(xhr);
			//
			alert("[error] sorry, could not add MTH sub platform.")
		}
	});
	return false;
}

//bind enter key on create mthSubPlatform
$('#newMTHSubPlatform').on('keypress', function (e) {
	if (e.key === 'Enter') {
		addNewMTHSubPlatform();
	}
});

editMTHSubPlatform = function (id, oldMTHSubPlatform) {
	$("#adminEntity").html(oldMTHSubPlatform);
	$("#newName").val("");
	$("#newName").attr("placeholder", "" + oldMTHSubPlatform);
	$("#adminEditEntityModal").modal("show");
	setTimeout(function () { $("#newName").trigger('focus'); }, 250);
	// rewrite function
	saveAdminObject = function () {
		mthSubPlatform = $("#newName").val();
		if (mthSubPlatform === null)
			return false;
		var params = "mthSubPlatform=" + mthSubPlatform;
		var verbe = "put";
		var resource = "mth-sub-platform";
		var extraGet = "mthSubPlatformID=" + id;
		$.ajax({
			type: "post",
			url: "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource + "&" + extraGet,
			dataType: "json",
			async: true,
			data: params,
			success: function (data) {
				// console.log(data);
				if (data.success) {
					loadMTHSubPlatforms();
					return true;
				} else {
					//
					alert("[error] sorry, could not edit MTH sub-Platform.")
				}
			},
			error: function (xhr) {
				console.log(xhr);
				//
				alert("[error] sorry, could not edit MTH sub-Platform.")
			}
		});
		$("#adminEditEntityModal").modal("hide");
		saveAdminObject = function () { }
		return false;
	}
}