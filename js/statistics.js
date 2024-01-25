// ///////////////////////////////////////////////////////////////////////////////////////
// dashboard - onload stuff
$(document).ready(function() {
	// page localization
	loadLang();
	// /////////////////////////////////////////
	// LOAD PROJECTS
	var userRights = "user"
//	if (userData.right == "admin") {
		// build datepicker
		buildRangeDate();
		// build datepicker
		buildGraph();
//	} 
	// splash current URL param into download link
	$("#link-donwload-xls-file").attr("href", $("#link-donwload-xls-file").attr("href") + document.location.search.replace("?page=statistics", ""))
	if (getUrlParameter("from") === undefined) {
		$("#link-donwload-xls-file").attr("href", $("#link-donwload-xls-file").attr("href") + "&from=" + lastYear);
	}
	if (getUrlParameter("to") === undefined) {
		$("#link-donwload-xls-file").attr("href", $("#link-donwload-xls-file").attr("href") + "&to=" + today);
	}
});
// ///////////////////////////////////////////////////////////////////////////////////////
// functions
/**
 * 
 */
function buildRangeDate () {
	if (getUrlParameter("from") !== undefined) {
		$("#range-date-start").val(getUrlParameter("from"));
	} else {
		$("#range-date-start").val(lastYear);
	}
	if (getUrlParameter("to") !== undefined) {
		$("#range-date-end").val(getUrlParameter("to"));
	} else {
		$("#range-date-end").val(today);
	}
	$(document).ready(function(){
		$('.datepicker').datepicker();
	});
}
$('#range-date-update').bind("click", function(e) { 
	reloadPage();
});

/**
 * 
 */
function reloadPage() {
	var newLocation = "?page=statistics";
	// date filter
	if ($("#range-date-start").val() != "") {
		newLocation += '&from=' + $("#range-date-start").val() ;
	}
	if ($("#range-date-end").val() != "") {
		newLocation += '&to=' + $("#range-date-end").val() ;
	}
	document.location = newLocation;
}
/////////////////////////////////////////////////////////////////////////////////////////
/**
 * 
 */
function buildGraph() {
	var from = $("#range-date-start").val();
	var to = $("#range-date-end").val();
	setTimeout(function() {buildTabPFxStatus(from, to)}, 10);
	setTimeout(function() {buildLaboTypeChart(from, to)}, 20);
	setTimeout(function() {buildCopartnerChart(from, to)}, 30);
	setTimeout(function() {buildDemandsChart(from, to)}, 40);
	setTimeout(function() {buildTargetedChart(from, to)}, 60);
	setTimeout(function() {buildSampleNbChart(from, to)}, 70);
	setTimeout(function() {buildFinancialChart(from, to)}, 80);
	setTimeout(function() {buildUserLaboTypeChart(from, to)}, 90);
	setTimeout(function() {buildExtraLaboTypeChart(from, to)}, 100);
	// Rolin one request: new charts awaken 
	setTimeout(function() {buildThematicChart(from, to)}, 110);
	setTimeout(function() {buildSubThematicChart(from, to)}, 120);
}

/**
 * 
 */
function buildTabPFxStatus(from, to) {
	// init - get list of PF
	var listOfMthPF = [];
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=get&resource=mth-platforms&order=asc",
		dataType : "json",
		async : false,
		success : function(mthPlatforms) {
//			if (!(mthPlatforms.hasOwnProperty('success') && mthPlatforms.success == false)) {
//			} else {
			listOfMthPF = (mthPlatforms);
//			}
		},
		error : function(xhr) { console.log(xhr); }
	});
	
	console.log(listOfMthPF);
	// for each PF" count project group by status
	$("#statsPjPFxStatus").empty();
	var superSum = 0;
	var superSumRejected = 0;
	var superSumWaiting = 0;
	var superSumAssigned = 0;
	var superSumAccepted = 0;
	var superSumCompleted = 0;
	var superSumRunning = 0;
	var superSumBlocked = 0;
	var superSumArchived = 0;
	$.each(listOfMthPF, function(k, v) {
		var pfName = v.name;
		var pfId = v.id;
		var dataTmp = (getNbOf(from, to, "isPlatForm="+pfId+"&group=status"))[0];
		// {"projects_count":3,"projects_status":0},{"projects_count":1,"projects_status":10},{"projects_count":1,"projects_status":30},{"projects_count":1,"projects_status":40}
//		console.log("dataTmp:", dataTmp)
		// {projects_count: 1, rejected: 0, waiting: 0, assigned: 0, completed: 0…}
		var tabSortedDat = dataTmp;
		var sum = tabSortedDat ['rejected'] + tabSortedDat ['assigned'] + tabSortedDat ['accepted'] + tabSortedDat ['completed'] + tabSortedDat ['running'] ;
		sum += tabSortedDat ['blocked'] + tabSortedDat ['archived'] + tabSortedDat ['waiting'];
		superSum += sum;
		tabSortedDat['total'] = sum;
		var newTabLine = '<tr>';
		newTabLine += '<td>' + pfName + '</td>';
		newTabLine += '<td>'+tabSortedDat['rejected']+'</td>';
		newTabLine += '<td>'+tabSortedDat['waiting']+'</td>';
		newTabLine += '<td>'+tabSortedDat['assigned']+'</td>';
		newTabLine += '<td>'+tabSortedDat['completed']+'</td>';
		newTabLine += '<td>'+tabSortedDat['accepted']+'</td>';
		newTabLine += '<td>'+tabSortedDat['running']+'</td>';
		newTabLine += '<td>'+tabSortedDat['blocked']+'</td>';
		newTabLine += '<td>'+tabSortedDat['archived']+'</td>';
		newTabLine += '<td>'+tabSortedDat['total']+'</td>';
		newTabLine += '</tr>';
		$("#statsPjPFxStatus").append(newTabLine);
	});

//	$("#statsPjPFxStatus").append("TODO: NONE line");
	// NONE
	var dataTmp = (getNbOf(from, to, "&isStatus=&isNotStatus=&group=status"))[0];
	var sum = 0;
	var tabSortedDat = dataTmp;
	var sum = tabSortedDat ['rejected'] + tabSortedDat ['assigned'] + tabSortedDat ['accepted'] + tabSortedDat ['completed'] + tabSortedDat ['running'] ;
	sum += tabSortedDat ['blocked'] + tabSortedDat ['archived'] + tabSortedDat ['waiting'];
	tabSortedDat['total'] = sum;
	
	/// NONE PF (grumpf)
	var rawRejected = (getNbOf(from, to, "isStatus=rejected&isNotStatus=&group=mthPF"));
	var rawWaiting = (getNbOf(from, to, "isStatus=waiting&isNotStatus=&group=mthPF"));
	var rawAssigned = (getNbOf(from, to, "isStatus=assigned&isNotStatus=&group=mthPF"));
	var rawAccepted = (getNbOf(from, to, "isStatus=accepted&isNotStatus=&group=mthPF"));
	var rawCompleted = (getNbOf(from, to, "isStatus=completed&isNotStatus=&group=mthPF"));
	var rawRunning = (getNbOf(from, to, "isStatus=running&isNotStatus=&group=mthPF"));
	var rawBlocked = (getNbOf(from, to, "isStatus=blocked&isNotStatus=&group=mthPF"));
	var rawArchived = (getNbOf(from, to, "isStatus=archived&isNotStatus=&group=mthPF"));
	var noPfRejected = extractFromRaw(rawRejected);
	var noPfWaiting = extractFromRaw(rawWaiting);
	var noPfAssigned = extractFromRaw(rawAssigned);
	var noPfAccepted = extractFromRaw(rawAccepted);
	var noPfCompleted = extractFromRaw(rawCompleted);
	var noPfRunning = extractFromRaw(rawRunning);
	var noPfBlocked = extractFromRaw(rawBlocked);
	var noPfArchived = extractFromRaw(rawArchived);
	var sumNoPf = (noPfRejected +noPfWaiting+noPfAssigned+noPfAccepted+noPfCompleted+noPfRunning+noPfBlocked+noPfArchived);
	var newTabLine = '<tr>';
	newTabLine += '<td><span style="display: none">ź</span>NONE</td>';
	newTabLine += '<td>'+(noPfRejected)+'</td>';
	newTabLine += '<td>'+(noPfWaiting)+'</td>';
	newTabLine += '<td>'+(noPfAssigned)+'</td>';
	newTabLine += '<td>'+(noPfCompleted)+'</td>';
	newTabLine += '<td>'+(noPfAccepted)+'</td>';
	newTabLine += '<td>'+(noPfRunning)+'</td>';
	newTabLine += '<td>'+(noPfBlocked)+'</td>';
	newTabLine += '<td>'+(noPfArchived)+'</td>';
	newTabLine += '<td>'+(sumNoPf)+'</td>';
	newTabLine += '</tr>';
	$("#statsPjPFxStatus").append(newTabLine);
	// TOTAL
	var totalTabLine = '<tr>';
	totalTabLine += '<td>Total</td>';
	totalTabLine += '<td>'+(tabSortedDat['rejected'])+'</td>';
	totalTabLine += '<td>'+(tabSortedDat['waiting'])+'</td>';
	totalTabLine += '<td>'+(tabSortedDat['assigned'])+'</td>';
	totalTabLine += '<td>'+(tabSortedDat['completed'])+'</td>';
	totalTabLine += '<td>'+(tabSortedDat['accepted'])+'</td>';
	totalTabLine += '<td>'+(tabSortedDat['running'])+'</td>';
	totalTabLine += '<td>'+(tabSortedDat['blocked'])+'</td>';
	totalTabLine += '<td>'+(tabSortedDat['archived'])+'</td>';
	totalTabLine += '<td>'+(tabSortedDat['total'])+'</td>';
	totalTabLine += '</tr>';
	$("#statsPjPFxStatusFooter").empty();
	$("#statsPjPFxStatusFooter").append(totalTabLine);
	$("#statsPjPFxStatusTable").tablesorter();
}

function extractFromRaw (json) {
	if ( (json[0]) !== undefined && (json[0]).pf_ids === null) {
		return (json[0]).projects_count;
	} else if ( (json).pf_ids === null ) {
		return (json).projects_count;
	}
	return 0;
}

/**
 * 
 */
function buildUserLaboTypeChart (from, to) {
	var data = (getNbOf(from, to, "&group=laboratory", "users-statistics"))[0];
//	{users_count: 4, u_labo_public: 2, u_labo_private: 0, u_labo_public_private: 2}
	var series = [{
        name: "Laboratory",
        colorByPoint: true,
        data: [{
            name: "Private",
            y: data.u_labo_private
        },{
            name: "Public",
            y: data.u_labo_public
        },{
            name: "Public / Private",
            y: data.u_labo_public_private
        }]
    }];
	buildGenericPie('#container-pie-usersLabo', ' active users laboratories profiles ', series);
}

/**
 * 
 */
function buildExtraLaboTypeChart (from, to) {
	var data = (getNbOf(from, to, "&group=laboratory", "extra-data-statistics"))[0];
//	{users_count: 4, u_labo_public: 2, u_labo_private: 0, u_labo_public_private: 2}
	var series = [{
        name: "Laboratory",
        colorByPoint: true,
        data: [{
            name: "Private",
            y: data.e_labo_private
        },{
            name: "Public",
            y: data.e_labo_public
        },{
            name: "Public / Private",
            y: data.e_labo_public_private
        }]
    }];
	buildGenericPie('#container-pie-extraLabo', ' projects laboratories profiles ', series);
}

/**
 * 
 */
function buildLaboTypeChart(from, to) {
//	isStatus=waiting,accepted,assigned,archived&isOwner=public_private
	var nbPublic = (getNbOf(from, to, "isStatus=waiting,accepted,assigned,completed,running,archived&isOwner=public"))[0].projects_count;
	var nbPrivate = (getNbOf(from, to, "isStatus=waiting,accepted,assigned,completed,running,archived&isOwner=private"))[0].projects_count;
	var nbPublicPrivate = (getNbOf(from, to, "isStatus=waiting,accepted,assigned,completed,running,archived&isOwner=public_private"))[0].projects_count;
	var series = [{
        name: "Laboratory",
        colorByPoint: true,
        data: [{
            name: "Private",
            y: nbPrivate
        },{
            name: "Public",
            y: nbPublic
        },{
            name: "Public / Private",
            y: nbPublicPrivate
        }]
    }];
	buildGenericPie('#container-pie-laboratory', ' project\'s laboratories profiles ', series);
}

/**
 * 
 */
function buildCopartnerChart(from, to) {
	var rawData = getNbOf(from, to, "isStatus=waiting,accepted,assigned,completed,running,archived&group=copartner")[0];
	var coPartYES = rawData.can_be_fwd;
	var coPartNOPE = rawData.can_not_be_fwd;
	var coPartUNDEF = rawData.undef;
	var series = [{
        name: "Forward",
        colorByPoint: true,
        data: [{
            name: "Can be Fwd",
            y: coPartYES
        },{
            name: "Can't be Fwd",
            y: coPartNOPE
        },{
            name: "Undefinded",
            y: coPartUNDEF
        }]
    }];
	buildGenericPie('#container-pie-copartner', ' can be forwarded to Copartner ', series);
}

/**
 * 
 */
function buildDemandsChart(from, to) {
	var rawData = getNbOf(from, to, "isStatus=waiting,accepted,assigned,completed,running,archived&group=type")[0];
	// {"projects_count":38,"dt__eqprov":24,"dt__NOT_eqprov":14,"dt__catallo":8,"dt__NOT_catallo":30,"dt__feastu":8,"dt__NOT_feastu":30,"dt__train":4,"dt__NOT_train":34}
	var eqprov = rawData.dt__eqprov;
	var catallo = rawData.dt__catallo;
	var feastu = rawData.dt__feastu;
	var train = rawData.dt__train;
	var data_proc = rawData.dt__data_proc;
	var other = rawData.dt__other;
	var series = [{
        name: "Demands",
        colorByPoint: true,
        data: [{
            name: "Equipment provisioning",
            y: eqprov
        },{
            name: "Catalog allowance - lab routine",
            y: catallo
        },{
            name: "feasibility study - R & D",
            y: feastu
        },{
            name: "Training",
            y: train
        },{
            name: "Data processing",
            y: data_proc
        },{
            name: "Other",
            y: other
        }]
    }];
	buildGenericPie('#container-pie-demand', ' Demand type ', series);
}

/**
 * 
 */
function buildTargetedChart(from, to) {
	var rawData = getNbOf(from, to, "isStatus=waiting,accepted,assigned,completed,running,archived&group=targeted")[0];
	// {"projects_count":8,"is_targeted":3,"is_NOT_targeted":2}
	var targetedYES = rawData.is_targeted;
	var targetedNOPE = rawData.is_NOT_targeted;
	var targetedUNDEF = rawData.undef;
	var series = [{
        name: "Targeted",
        colorByPoint: true,
        data: [{
            name: "targeted",
            y: targetedYES
        },{
            name: "untargeted",
            y: targetedNOPE
        },{
            name: "undefined",
            y: targetedUNDEF
        }]
    }];
	buildGenericPie('#container-pie-targeted', ' Targeted ', series);
}

/**
 * 
 */
function buildSampleNbChart(from, to) {
	var rawData = getNbOf(from, to, "isStatus=waiting,accepted,assigned,completed,running,archived&group=sample_number")[0];
	// [{"projects_count":9,"less_50":1,"51_to_100":3,"101_to_500":1,"more_501":1}]
	var sampleNb_less50 = rawData.less_50;
	var sampleNb_51_to_100 = rawData['51_to_100'];
	var sampleNb_101_to_500 = rawData['101_to_500'];
	var sampleNb_more_501 = rawData['more_501'];
	var sampleNb_undef = rawData['undef'];
	var series = [{
        name: "sampleNb",
        colorByPoint: true,
        data: [{
            name: "50 or less",
            y: sampleNb_less50
        },{
            name: "51  to 100",
            y: sampleNb_51_to_100
        },{
            name: "101 to 500",
            y: sampleNb_101_to_500
        },{
            name: "more than 501",
            y: sampleNb_more_501
        },{
            name: "undefined",
            y: sampleNb_undef
        }]
    }];
	buildGenericPie('#container-pie-sampleNb', ' Sample Number ', series);
}

/**
 * 
 */
function buildFinancialChart(from, to) {
	var rawData = getNbOf(from, to, "isStatus=waiting,accepted,assigned,completed,running,archived&group=financial")[0];
	// [{"projects_count":9,"less_50":1,"51_to_100":3,"101_to_500":1,"more_501":1}]
	var funding_financed = rawData.f__financed;
	var funding_provisioning = rawData.f__provisioning;
	var funding_ownsupply = rawData.f__ownsupply;
	var funding_notfinanced = rawData.f__notfinanced;
	var series = [{
        name: "funding",
        colorByPoint: true,
        data: [{
            name: "financed",
            y: funding_financed
        },{
            name: "provisioning",
            y: funding_provisioning
        },{
            name: "on own supply",
            y: funding_ownsupply
        },{
            name: "Not financed",
            y: funding_notfinanced
        }]
    }];
	buildGenericPie('#container-pie-funding', ' Funding ', series);
}

/**
 * 
 */
function buildThematicChart (from, to) {
	var data = (getNbOf(from, to, "&group=keywords&isStatus=waiting,accepted,assigned,completed,running,archived", "projects-statistics"));
	var dataSeries = [];
	$.each(data, function(k, v) {
		if (v.tw_words !== null)
			dataSeries.push({"name": v.tw_words, "y": v.projects_count });
	});	
	var series = [{
        name: "Thematic keyword",
        colorByPoint: true,
        data: dataSeries
    }];
	buildGenericPie('#container-pie-thematic', ' Project thematic repartition ', series);
}

/**
 * 
 */
function buildSubThematicChart (from, to) {
	var data = (getNbOf(from, to, "&group=subkeywords&isStatus=waiting,accepted,assigned,completed,running,archived", "projects-statistics"));
	var dataSeries = [];
	$.each(data, function(k, v) {
		if (v.tw_words !== null)
			dataSeries.push({"name": v.tw_words, "y": v.projects_count });
	});	
	var series = [{
        name: "Sub-thematic keyword",
        colorByPoint: true,
        data: dataSeries
    }];
	buildGenericPie('#container-pie-subthematic', ' Project sub-thematic repartition ', series);
}

/**
 * 
 */
function getNbOf(from, to, filtersAndGroup, resource) {
	var retData = -1;
	var resource2 = resource;
	if (resource === undefined) {
		resource2 = 'projects-statistics';
	}
	$.ajax({
		type : "get",
		url : "ajax/ajax_proxypass.php?verbe=get&resource="+resource2+"&from=" + from + "&to=" + to + "&" + filtersAndGroup,
		dataType : "json",
		async : false,
		success : function(stat) {
			if (!(stat.hasOwnProperty('success') && stat.success == false)) {
				retData = stat;
			}
		},
		error : function(xhr) {
			console.log(xhr);
		}
	});
	return retData;
}

/**
 * 
 */
function buildGenericPie(_pie_target, _pie_title, _pie_series) {
	$(_pie_target).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: _pie_title
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.2f}%</b> ({point.y})',
            useHTML: true
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}% ({point.y})',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    useHTML: true
                }
            }
        },
        series: _pie_series
    });
}
