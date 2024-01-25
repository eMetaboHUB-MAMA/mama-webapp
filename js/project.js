/////////////////////////////////////////////////////////////////////////////////////////
// project - add / edit
$( document ).ready(function() {
	// 
	if (getUrlParameter("editProject") !== undefined)
		setTimeout(function(){loadProject(Number(getUrlParameter("editProject")))}, 250);
	if (getUrlParameter("update") =="success") 
		$("#divSuccess").show();
	///////////////////////////
	//
	$(".classiqAnalyze").hide();
	$(".financedOK").hide();

	$("input[name=demandType]").change(function() {
		var showID = false;
		$.each($(".classicDemandListener"), function() {
			if ($(this).is(':checked'))
				showID = true;
		});
		if (showID)
			$(".classiqAnalyze").show();
		else
			$(".classiqAnalyze").hide();
	});;

	$("#financialContext").change(function() {
		var showID = false;
		$.each($(".financed"), function() {
			if ($(this).is(':selected'))
				showID = true;
		});
		if (showID)
			$(".financedOK").show();
		else
			$(".financedOK").hide();

	}).change();

	$("#financialContextBis").change(function() {
		var showID = false;
		$.each($(".financedOther"), function() {
			if ($(this).is(':selected'))
				showID = true;
		});
		if (showID)
			$(".financedOKOther").show();
		else
			$(".financedOKOther").hide();

	}).change();
	
	$("#financialContext").change();
	var showID = false;
	$.each($(".classicDemandListener"), function() {
		if ($(this).is(':checked'))
			showID = true;
	});
	if (showID)
		$(".classiqAnalyze").show();
	else
		$(".classiqAnalyze").hide();
});
/**
 * 
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 
 */
function buildKeywords() {
	var verbe = "get";
	var resource = "keywords";
	var extraFilter = "&order=asc&deleted=false"
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe
				+ "&resource=" + resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(keywords) {
			if (keywords.hasOwnProperty('success')
					&& keywords.success == false) {
				// TODO show error message info
			} else {
				if (keywords.length === 0) {
//						$("#noKeywordsToShow").show();
				} else {
					var keywordsHTML = "";
					var cptk = 0;
					keywords.sort(compareKeyworks);
					$.each(keywords, function(k, v) {
						keywordsHTML += '<span id="cw_'+v.id+'" class="cloud-word label label-default" onclick="cloudWord(this)">'+v.word+'</span>';
						cptk++;
						if (cptk == 4) {
							cptk = 0;
							keywordsHTML += ' ';
						} else {
							keywordsHTML += ' ';
						}
					});
					$("#targetCloudWords").html(keywordsHTML);
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
 * 
 */
function cloudWord (span) {
	if ($(span).hasClass("label-default")) {
		$(span).removeClass("label-default");
		$(span).addClass("label-success");
	} else if ($(span).hasClass("label-success")) {
		$(span).removeClass("label-success");
		$(span).addClass("label-default");
	} else if ($(span).hasClass("label-danger")) {
		return;
	}
	var count = $(".cloud-word.label-success").size();
	var increase = true;
	if (count < 3) {
		$.each($(".cloud-word.label-danger"), function() {
			$(this).removeClass("label-danger");
			$(this).addClass("label-default");
		});
	} else {
		$.each($(".cloud-word.label-default"), function() {
			$(this).removeClass("label-default");
			$(this).addClass("label-danger");
		});
	}
	try { checkIfFormNewProjectValid(); } catch (e) {}
}

/**
 * 
 */
function buildSubKeywords() {
	var verbe = "get";
	var resource = "subkeywords";
	var extraFilter = "&order=asc&deleted=false"
	// run
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe
				+ "&resource=" + resource + extraFilter,
		dataType : "json",
		async : true,
		success : function(keywords) {
			if (keywords.hasOwnProperty('success')
					&& keywords.success == false) {
				// TODO show error message info
			} else {
				if (keywords.length === 0) {
//						$("#noKeywordsToShow").show();
				} else {
					var keywordsHTML = "";
					var cptk = 0;
					keywords.sort(compareKeyworks);
					$.each(keywords, function(k, v) {
						keywordsHTML += '<span id="scw_'+v.id+'" class="sub-cloud-word label label-default" onclick="subCloudWord(this)">'+v.word+'</span>';
						cptk++;
						if (cptk == 4) {
							cptk = 0;
							keywordsHTML += ' ';
						} else {
							keywordsHTML += ' ';
						}
					});
					$("#targetSubCloudWords").html(keywordsHTML);
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
 * 
 */
function subCloudWord (span) {
	if ($(span).hasClass("label-default")) {
		$(span).removeClass("label-default");
		$(span).addClass("label-success");
	} else if ($(span).hasClass("label-success")) {
		$(span).removeClass("label-success");
		$(span).addClass("label-default");
	} else if ($(span).hasClass("label-danger")) {
		return;
	}
	var count = $(".sub-cloud-word.label-success").size();
	var increase = true;
	if (count < 5) {
		$.each($(".sub-cloud-word.label-danger"), function() {
			$(this).removeClass("label-danger");
			$(this).addClass("label-default");
		});
	} else {
		$.each($(".sub-cloud-word.label-default"), function() {
			$(this).removeClass("label-default");
			$(this).addClass("label-danger");
		});
	}
}

/**
 * 
 */
function loadProject (projectID) {
	var verbe = "get";
	var resource = "project&projectID=" + projectID;
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource,
		dataType : "json",
		async : true,
		success : function(project) {
			if (project != null && project.hasOwnProperty('success')
					&& project.success == false) {
				// TODO show error message info
			} else {
				// console.log(project);
				
				// project metadata
				$("#projectMetadata_userFullName").html(project.owner.fullName);
				$("#projectMetadata_userEmail").html(project.owner.email);
				$("#projectMetadata_createdOn").html(convertJsonDateToHumanReadable(project.created.date) + ".");
				if (project.updated == null) {
					$("#projectMetadata_updatedOn").hide();
					$("#editProject_metadata_updatedOn").hide();
				} else {
					$("#projectMetadata_updatedOn").html(convertJsonDateToHumanReadable(project.updated.date) + ".");	
				}
				
				// all other data
				$.each(project, function(k, v) {
					var elemID = "project" + capitalizeFirstLetter(k);
					var elem = null;
					if ($('#'+elemID).length) {
						elem = $('#'+elemID);
					} else if ($('#'+k).length) {
						elem = $('#'+k);
					} else if ($('input[name='+k+']').length) {
						elem = $('input[name='+k+']');
					}
					if (elem !== null) {
						// console.log(elem);
						if ($(elem).is("a") || $(elem).is("textarea")) {
							$(elem).html(v);
						} else if ($(elem).is("input")) {
							if ($(elem).is("input[type=text]")|| $(elem).is("input[type=hidden]")) {
								$(elem).val(v);
							} else if ($(elem).is("input[type=checkbox]")) {
								$(elem).prop("checked", v);
							} else if ($(elem).is("input[type=radio]")) {
								if (v !== null)
									if (v) {
										$('#'+k+"TRUE").prop("checked", true);
									} else {
										$('#'+k+"FALSE").prop("checked", true);
									}
							}
						} else if ($(elem).is("select")) {
							var attr = $(elem).attr('multiple');
							if (typeof attr !== typeof undefined && attr !== false) {
								// multiple
								if (k == "mthPlatforms") {
									$.each(v, function(key, val) {
										$("option[value=mth_pf_"+val.id+"]").attr("selected", true);
									});
								}
							} else {
								// single
								$(elem).val(v);
							}
						} else {
							// tml debug
							// console.log(elem);
						}
					} 
					
				});
				// cloudwords
				$.each(project.thematicWords, function(index, value){ 
					cloudWord ($("#cw_"+value.id));
				});
				// subcloudwords
				$.each(project.subThematicWords, function(index, value){ 
					subCloudWord ($("#scw_"+value.id));
				});
				// other select
				if (project.financialContextIsProjectANR) {
					$("option[value=project_financedANR]").attr("selected", true);
				}
				if (project.financialContextIsProjectCompagnyTutorship) {
					$("option[value=project_financedCompanyTutorship]").attr("selected", true);
				}
				if (project.financialContextIsProjectInternationalOutsideEU) {
					$("option[value=project_financedInternationalOutsideEU]").attr("selected", true);
				}
				if (project.financialContextIsProjectOwnResourcesLaboratory) {
					$("option[value=project_financedOwnResourcesLaboratory]").attr("selected", true);
				}
				if (project.financialContextIsProjectEU) {
					$("option[value=project_financedEU]").attr("selected", true);
				}
				if (project.financialContextIsProjectFinanced) {
					$("option[value=project_financed]").attr("selected", true);
				}
				if (project.financialContextIsProjectInProvisioning) {
					$("option[value=project_inProvisioning]").attr("selected", true);
				}
				if (project.financialContextIsProjectNational) {
					$("option[value=project_financedNational]").attr("selected", true);
				}
				if (project.financialContextIsProjectNotFinanced) {
					$("option[value=project_notFinanced]").attr("selected", true);
				}
				if (project.financialContextIsProjectOnOwnSupply) {
					$("option[value=project_onOwnSupply]").attr("selected", true);
				}
				if (project.financialContextIsProjectOther) {
					$("option[value=project_financedOther]").attr("selected", true);
				}
				if (project.financialContextIsProjectRegional) {
					$("option[value=project_financedRegional]").attr("selected", true);
				}
				// if (project.financialContextIsProjectOtherValue !== null) {}
				// file
				if (project.scientificContextFile !== null && project.scientificContextFile !== "") {
					$("#link-to-upload-file").click();
					$("#project-scientificContextFile").parent().show();
					var linkFile = 'download current file: <a href="'+project.scientificContextFileURL+'" target="_blank">'+project.scientificContextFile+'</a>'
					$("#project-scientificContextFile").html(linkFile);
				} 
				// extra data
				if (project.hasOwnProperty("analysisRequestExtraData") && project.analysisRequestExtraData != null) {
					var extraData = project.analysisRequestExtraData;
					$("#extra_adminContext").val(extraData.administrativeContext);
					$("#extra_budget").val(extraData.budgetConstraint);
					$("#extra_deadline").val(extraData.deadline);
					$("#extra_geoContext").val(extraData.geographicContext);
					$("#extra_projectMaturity").val(extraData.projectMaturity);
					$("#extra_userNeeds").val(extraData.syntheticUserNeeds);
					if (extraData.knowMTHviaCoworkerOrFriend)
						$("#extra_hdykm_friend").attr("checked",  true);
					if (extraData.knowMTHviaPublication)
						$("#extra_hdykm_publication").attr("checked",  true);
					if (extraData.knowMTHviaSearchEngine)
						$("#extra_hdykm_searchEngine").attr("checked",  true);
					if (extraData.knowMTHviaWebsite)
						$("#extra_hdykm_website").attr("checked",  true);
					switch (extraData.laboType) {
					case "public":
						$("#extra_laboType_public").attr("checked",  true);
						break;
					case "private":
						$("#extra_laboType_private").attr("checked",  true);
						break;
					case "private/public":
						$("#extra_laboType_privatepublic").attr("checked",  true);
						break;
					}
				}
				
				// mop
				$("input[type=checkbox]").change();
				$("input[type=radio]").change();
				$("select").change();
				// focus
				$("#interestInMthCollaboration").focus();
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// TODO show error message info
		}
	});
}

/**
 * 
 */
function checkUpdateProjectForm() {
	var projectID = $("#projectId").val();
	var verbe = "put";
	var resource = "project&projectID=" + projectID;
	var params = "";
	$.each($("input[type=text]"), function(k, v) {
		params += "&" + $(this).prop('id') + "="
				+ encodeURIComponent($("#" + $(this).prop('id')).val());
	});
	$.each($("input[type=checkbox]"), function(k, v) {
		params += "&" + $(this).prop('id') + "="
				+ $("#" + $(this).prop('id')).is(":checked");
	});
	$.each($("select"), function(k, v) {
		if ($(this).prop('id') != "mthPlatforms")
			params += "&" + $(this).prop('id') + "="
					+ $("#" + $(this).prop('id')).val();
	});
	$.each($("textarea"), function(k, v) {
		params += "&" + $(this).prop('id') + "="
				+ encodeURIComponent($("#" + $(this).prop('id')).val());
	});
	params += "&targeted=" + $("input[name=targeted]:checked").val();
	params += "&copartner=" + $("input[name=canBeForwardedToCoPartner]:checked").val();
	if ($("input[name=laboType]").size() > 0) {
		params += "&extra_laboType=" + $("input[name=laboType]:checked").val();
	}
	var cloudWords = [];
	$.each($(".cloud-word.label-success"), function() {
		cloudWords.push($(this).attr('id').replace("cw_", ""));
	});
	params += "&cloudWords=" + cloudWords;
	var subCloudWords = [];
	$.each($(".sub-cloud-word.label-success"), function() {
		subCloudWords.push($(this).attr('id').replace("scw_", ""));
	});
	params += "&subCloudWords=" + subCloudWords;
	var mthPF = [];
	$.each($("#mthPlatforms option:selected"), function() {
		mthPF.push($(this).attr('value').replace("mth_pf_", ""));
	});
	params += "&mthPlatforms=" + mthPF;
	params += "&scientificContextFile=" + $("#attachedFile").val();
	// run
	$.ajax({
		type : "post",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource,
		dataType : "json",
		async : true,
		data : params,
		success : function(json) {
			if (json.success) {
				location.search = "?page=edit-project&editProject="+projectID+"&update=success";
			} else {
				// show wrong password info
				$("#divError").show();
				if (json.message !== null) {
					$("#divErrorCause").html("<br>cause: " + json.message);
				}
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// show error message info
			$("#divError").show();
		}
	});
	return false;
}

/**
 * 
 */
function checkNewProjectForm() {
	var verbe = "post";
	var resource = "project";
	var params = "";
	$.each($("form input[type=text]"), function(k, v) {
		params += "&" + $(this).prop('id') + "="
				+ encodeURIComponent($("#" + $(this).prop('id')).val());
	});
	$.each($("form input[type=checkbox]"), function(k, v) {
		params += "&" + $(this).prop('id') + "="
				+ $("#" + $(this).prop('id')).is(":checked");
	});
	$.each($("form select"), function(k, v) {
		if ($(this).prop('id') != "mthPlatforms")
			params += "&" + $(this).prop('id') + "="
					+ $("#" + $(this).prop('id')).val();
	});
	$.each($("form textarea"), function(k, v) {
		params += "&" + $(this).prop('id') + "="
				+ encodeURIComponent($("#" + $(this).prop('id')).val());
	});
	params += "&targeted=" + $("input[name=targeted]:checked").val();
	params += "&copartner=" + $("input[name=copartner]:checked").val();
	var cloudWords = [];
	$.each($(".cloud-word.label-success"), function() {
		cloudWords.push($(this).attr('id').replace("cw_", ""));
	});
	params += "&cloudWords=" + cloudWords;
	var subCloudWords = [];
	$.each($(".sub-cloud-word.label-success"), function() {
		subCloudWords.push($(this).attr('id').replace("scw_", ""));
	});
	params += "&subCloudWords=" + subCloudWords;
	var mthPF = [];
	$.each($("#mthPlatforms option:selected"), function() {
		mthPF.push($(this).attr('value').replace("mth_pf_", ""));
	});
	params += "&mthPlatforms=" + mthPF;
	params += "&scientificContextFile=" + $("#attachedFile").val();
	// run
	$.ajax({
		type : "post",
		url : "ajax/ajax_proxypass.php?verbe=" + verbe + "&resource="
				+ resource,
		dataType : "json",
		async : true,
		data : params,
		success : function(json) {
			if (json.success) {
				location.search = "?page=dashboard";
			} else {
				// show wrong password info
				$("#divError").show();
				if (json.message !== null) {
					$("#divErrorCause").html("<br>cause: " + json.message);
				}
			}
		},
		error : function(xhr) {
			console.log(xhr);
			// show error message info
			$("#divError").show();
		}
	});
	return false;
}

/**
 * 
 */
function checkIfFormNewProjectValid() {
	var isFormValid = true;
	$("div.form-group label sup").css("color", "black");
	$("span.input-group-addon sup").css("color", "black");
	$("#submitNewDAbtn").removeClass("btn-disabled");

	if ($("#projectTitle").val() == "") {
		isFormValid = false;
		$("#projectTitle").parent().find("sup").css("color", "red");
	}
	
	if ($("#interestInMthCollaboration").val() == "") {
		isFormValid = false;
		$("#interestInMthCollaboration").parent().find("sup").css("color", "red");
	}
	
	if ($("input[name=demandType]:checked").size() == 0) {
		isFormValid = false;
		$("#createProject_content_projectDemandType").parent().find("sup").css("color", "red");
	}

	if ($(".cloud-word.label-success").size() == 0) {
		isFormValid = false;
		$("#createProject_content_projectType_thematicCloudWords").parent().find("sup").css("color", "red");
	}
	
	if ($("#mthPlatforms :checked").size() == 0) {
		isFormValid = false;
		$("#createProject_content_project_mthPF").parent().find("sup").css("color", "red"); console.log(0);
	}
	
	if ($("#financialContext :checked").size() == 0) {
		isFormValid = false;
		$("#createProject_content_project_financialContext").parent().find("sup").css("color", "red");
	}
	
	if (isFormValid) {
		$("#submitNewDAbtn").attr("disabled", false);
	} else {
		$("#submitNewDAbtn").addClass("btn-disabled");
		$("#submitNewDAbtn").attr("disabled", true);
	} 
	return isFormValid;
}