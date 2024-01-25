<?php
//
// Francis Proxypass
// what? you didn't see Deadpool movie yet? OUT OF MY SCRIPT RIGHT NOW!!!
//
session_start ();
set_time_limit ( 0 );
header ( "Content-Type: application/json" );

// ////////////////////////////////////////////////////////////////////////////
// LOAD MAMA SERVER OPTIONS
// LOAD MAMA SERVER OPTIONS
// if not in RAM load it from ini file
$configFile =__DIR__ . "/../config/mama-webapp.json";
if (! file_exists ( $configFile )) {
	$copySuccess = copy ( $configFile . ".sample", $configFile );
}
// ////////////////////////////////////////////////////////////////////////////
// LOAD MAMA SERVER OPTIONS
$mama_config_file = file_get_contents ($configFile );
$mama_config_json = json_decode ( $mama_config_file, true );

// /////////////////////////////////////////////////////////////////////////////
// VERBES
$verbe = "";
if (isset ( $_GET ["verbe"] ) && $_GET ["verbe"] != "") {
	switch ($_GET ["verbe"]) {
		case "get" :
			$verbe = "GET";
			break;
		case "post" :
			$verbe = "POST";
			break;
		case "put" :
			$verbe = "PUT";
			break;
		case "delete" :
			$verbe = "DELETE";
			break;
		default :
			returnSuccess ( false );
	}
} else {
	returnSuccess ( false );
}

// ////////////////////////////////////////////////////////////////////////////
// RESOURCES
$resource = "";
if (isset ( $_GET ["resource"] ) && $_GET ["resource"] != "") {
	switch ($_GET ["resource"]) {
		case "token" :
			if ($verbe == "POST") {
				// create new token
				post_token ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "DELETE") {
				// NOT SUPPORTED FOR WEBAPP
			}
			returnSuccess ( false );
		case "reset-password" :
			if ($verbe == "PUT") {
				put_reset_password ( $mama_config_json ['mamaRestApi'] );
			}
			returnSuccess ( false );
			break;
		case "user-right" :
			if ($verbe == "PUT") {
				put_user_right ( $mama_config_json ['mamaRestApi'] );
			}
			returnSuccess ( false );
			break;
		case "user" :
			if ($verbe == "GET") {
				// read user data
				get_user ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "POST") {
				// create new user
				post_user ( $mama_config_json ['mamaRestApi'] );
				// Login with new user
				$_POST ['login'] = $_POST ['email'];
				post_token ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "PUT") {
				// update user data
				put_user ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "DELETE") {
				// NOT SUPPORTED FOR WEBAPP
			}
			break;
		case "project" :
			if ($verbe == "GET") {
				// read project data
				$pid = intval ( $_GET ['projectID'] );
				get_project ( $mama_config_json ['mamaRestApi'], $pid );
			} else if ($verbe == "POST") {
				// create new project
				post_project ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "PUT") {
				put_project ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "DELETE") {
				// NOT SUPPORTED FOR WEBAPP
			}
			break;
		case "stop-project" :
			if ($verbe == "PUT") {
				put_stop_project ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "message" :
			if ($verbe == "GET") {
				// read message data
				$mid = intval ( $_GET ['messageID'] );
				get_message ( $mama_config_json ['mamaRestApi'], $mid );
			} else if ($verbe == "POST") {
				// create new message
				post_message ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "DELETE") {
				// NOT SUPPORTED FOR WEBAPP
			}
			break;
		case "messages-count" :
			if ($verbe == "GET") {
				// read message data
				get_messages_count ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "messages" :
			if ($verbe == "GET") {
				// read messages data
				get_messages ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "appointment" :
			if ($verbe == "GET") {
				// read appointment data
				$aid = intval ( $_GET ['appointmentID'] );
				get_appointment ( $mama_config_json ['mamaRestApi'], $aid );
			} else if ($verbe == "POST") {
				// create new appointment
				post_appointment ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "PUT") {
				// update appointment
				put_appointment ( $mama_config_json ['mamaRestApi'] );
			} else if ($verbe == "DELETE") {
				// NOT SUPPORTED FOR WEBAPP
			}
			break;
		case "appointments-count" :
			if ($verbe == "GET") {
				// read appointments data
				get_appointments_count ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "appointments" :
			if ($verbe == "GET") {
				// read appointments data
				get_appointments ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "project-file" :
			if ($verbe == "GET") {
				// read project data
				$pid = intval ( $_GET ['projectID'] );
				get_project_file ( $mama_config_json ['mamaRestApi'], $pid );
			}
			break;
		case "projects-file" :
			if ($verbe == "GET") {
				// read project data
				get_projects_file ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "statistics-file" :
			if ($verbe == "GET") {
				// read project data
				get_statistics_file ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "users" :
			if ($verbe == "GET") {
				get_users ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "projects-managers" :
			if ($verbe == "GET") {
				get_projects_managers ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "projects" :
			if ($verbe == "GET") {
				get_projects ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "projects-stats" :
			if ($verbe == "GET") {
				get_projects_stats ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "users-stats" :
			if ($verbe == "GET") {
				get_users_stats ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "events" :
			if ($verbe == "GET") {
				get_events ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "keywords" :
			if ($verbe == "GET") {
				get_keywords ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "subkeywords" :
			if ($verbe == "GET") {
				get_subkeywords ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "mth-platforms" :
			if ($verbe == "GET") {
				get_mthPlatforms ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "server-load" :
			if ($verbe == "GET") {
				get_server_load ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "projects-statistics" :
			if ($verbe == "GET") {
				get_projects_statistics ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "users-statistics" :
			if ($verbe == "GET") {
				get_users_statistics ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "extra-data-statistics" :
			if ($verbe == "GET") {
				get_extra_data_statistics ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "admin/show-logs/daily-mailler" :
		case "admin/show-logs/weekly-mailler" :
		case "admin/show-logs/monthly-users_inactiver" :
			if ($verbe == "GET") {
				get_admin_generic_query ( $mama_config_json ['mamaRestApi'], $_GET ["resource"] );
			}
			break;
		case "admin/clean-tokens" :
			if ($verbe == "DELETE") {
				delete_admin_tokens ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "admin/archive-projects" :
		case "admin/inactive-users" :
		case "admin/clean-uploaded-files" :
			if ($verbe == "PUT") {
				echo getStandardizedPut ( $mama_config_json ['mamaRestApi'], $_GET ["resource"] );
			}
			break;
		case "keyword" :
			if ($verbe == "POST") {
				post_keyword ( $mama_config_json ['mamaRestApi'] );
			}
			if ($verbe == "PUT") {
				put_keyword ( $mama_config_json ['mamaRestApi'] );
			}
			if ($verbe == "DELETE") {
				// get_server_load ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "subkeyword" :
			if ($verbe == "POST") {
				post_subkeyword ( $mama_config_json ['mamaRestApi'] );
			}
			if ($verbe == "PUT") {
				put_subkeyword ( $mama_config_json ['mamaRestApi'] );
			}
			if ($verbe == "DELETE") {
				// get_server_load ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		case "mth-platform" :
			if ($verbe == "POST") {
				post_mthPlatform ( $mama_config_json ['mamaRestApi'] );
			}
			if ($verbe == "PUT") {
				put_mthPlatform ( $mama_config_json ['mamaRestApi'] );
			}
			if ($verbe == "DELETE") {
				// get_server_load ( $mama_config_json ['mamaRestApi'] );
			}
			break;
		default :
			returnSuccess ( false );
	}
} else {
	returnSuccess ( false );
}
// ////////////////////////////////////////////////////////////////////////////
/**
 *
 * @param boolean $success        	
 */
function returnSuccess($success, $message = null) {
	echo json_encode ( array (
			'success' => $success,
			'message' => $message 
	) );
	exit ();
}
// ////////////////////////////////////////////////////////////////////////////
/**
 *
 * @param string $base_api        	
 * @param string $resource        	
 * @return mixed
 */
function getStandardizedPost($base_api, $resource) {
	$tokenURL = "";
	if (isset ( $_SESSION ["user_token"] ) && $_SESSION ["user_token"] != "") {
		$tokenURL = "token=" . $_SESSION ["user_token"];
	}
	// extra get
	$extraGet = "";
	foreach ( $_GET as $k => $v ) {
		$extraGet .= "&" . $k . "=" . urlencode ( $v );
	}
	// init post
	$post = "";
	foreach ( $_POST as $k => $v ) {
		$post .= "&" . $k . "=" . urlencode ( $v );
	}
	// process curl
	$curl = curl_init ( $base_api . $resource . "?" . $tokenURL . $extraGet );
	curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
	curl_setopt ( $curl, CURLOPT_POST, true );
	curl_setopt ( $curl, CURLOPT_POSTFIELDS, $post );
	curl_setopt ( $curl, CURLOPT_HTTPHEADER, array (
			"Accept: application/json" 
	) );
	$curl_response = curl_exec ( $curl );
	curl_close ( $curl );
	// return
	return $curl_response;
}

/**
 *
 * @param unknown $base_api        	
 * @param unknown $resource        	
 * @return mixed
 */
function getStandardizedPut($base_api, $resource) {
	$tokenURL = "";
	if (isset ( $_SESSION ["user_token"] ) && $_SESSION ["user_token"] != "") {
		$tokenURL = "token=" . $_SESSION ["user_token"];
	}
	// init put data
	$data = array ();
	foreach ( $_POST as $k => $v ) {
		$data [$k] = ($v);
	}
	// process curl
	$curl = curl_init ( $base_api . $resource . "?" . $tokenURL );
	
	curl_setopt ( $curl, CURLOPT_CUSTOMREQUEST, "PUT" );
	// curl_setopt ( $curl, CURLOPT_HEADER, true );
	curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
	curl_setopt ( $curl, CURLOPT_HTTPHEADER, array (
			'Accept: application/json',
			'Content-type: application/x-www-form-urlencoded' 
	) );
	curl_setopt ( $curl, CURLOPT_POSTFIELDS, http_build_query ( $data ) );
	$curl_response = curl_exec ( $curl );
	curl_close ( $curl );
	// return
	return $curl_response;
}

/**
 *
 * @param unknown $base_api        	
 * @param unknown $resource        	
 * @return mixed
 */
function getStandardizedGet($base_api, $resource) {
	$tokenURL = "";
	if (isset ( $_SESSION ["user_token"] ) && $_SESSION ["user_token"] != "") {
		$tokenURL = "token=" . $_SESSION ["user_token"];
	}
	// init post
	$get = "";
	foreach ( $_GET as $k => $v ) {
		$get .= "&" . $k . "=" . urlencode ( $v );
	}
	// process curl
	$curl = curl_init ( $base_api . $resource . "?" . $tokenURL . $get );
	curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
	curl_setopt ( $curl, CURLOPT_CUSTOMREQUEST, 'GET' );
	curl_setopt ( $curl, CURLOPT_HTTPHEADER, array (
			"Accept: application/json" 
	) );
	$curl_response = curl_exec ( $curl );
	curl_close ( $curl );
	// return
	return $curl_response;
}

/**
 *
 * @param unknown $base_api        	
 * @param unknown $resource        	
 * @return mixed
 */
function getStandardizedDelete($base_api, $resource) {
	$tokenURL = "";
	if (isset ( $_SESSION ["user_token"] ) && $_SESSION ["user_token"] != "") {
		$tokenURL = "token=" . $_SESSION ["user_token"];
	}
	// init put data
	$data = array ();
	foreach ( $_POST as $k => $v ) {
		$data [$k] = ($v);
	}
	// process curl
	$curl = curl_init ( $base_api . $resource . "?" . $tokenURL );
	
	curl_setopt ( $curl, CURLOPT_CUSTOMREQUEST, "DELETE" );
	// curl_setopt ( $curl, CURLOPT_HEADER, true );
	curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
	curl_setopt ( $curl, CURLOPT_HTTPHEADER, array (
			'Accept: application/json',
			'Content-type: application/x-www-form-urlencoded' 
	) );
	curl_setopt ( $curl, CURLOPT_POSTFIELDS, http_build_query ( $data ) );
	$curl_response = curl_exec ( $curl );
	curl_close ( $curl );
	
	// return
	return $curl_response;
}

/**
 *
 * @param unknown $base_api        	
 * @param unknown $resource        	
 * @return mixed
 */
function getXLSfile($base_api, $resource) {
	$tokenURL = "";
	if (isset ( $_SESSION ["user_token"] ) && $_SESSION ["user_token"] != "") {
		$tokenURL = "token=" . $_SESSION ["user_token"];
	}
	// init post
	$get = "";
	foreach ( $_GET as $k => $v ) {
		$get .= "&" . $k . "=" . urlencode ( $v );
	}
	// process curl
	global $currentHeader;
	$curl = curl_init ( $base_api . $resource . "?" . $tokenURL . $get . "&format=xls" );
	curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
	curl_setopt ( $curl, CURLOPT_CUSTOMREQUEST, 'GET' );
	// curl_setopt ( $curl, CURLOPT_HEADERFUNCTION, "readHeader" );
	// curl_setopt ( $curl, CURLOPT_HTTPHEADER, array (
	// "Accept: application/xls"
	// ) );
	$curl_response = curl_exec ( $curl );
	curl_close ( $curl );
	// headers
	header ( "Content-Type: application/vnd.ms-excel; charset=utf-8" );
	header ( "Content-Disposition: attachment; filename=" . $resource . ".xls" );
	header ( "Expires: 0" );
	header ( "Cache-Control: must-revalidate, post-check=0, pre-check=0" );
	header ( "Cache-Control: private", false );
	// return content
	return $curl_response;
}

// /**
// */
// function readHeader($ch, $header) {
// // read headers
// global $currentHeader;
// $currentHeader = $header;
// // echo "Read header: ", $header;
// return ($header);
// }

/**
 *
 * @param unknown $base_api        	
 * @param unknown $resource        	
 * @param unknown $id        	
 * @return mixed
 */
function getFile($base_api, $resource, $id) {
	$tokenURL = "";
	if (isset ( $_SESSION ["user_token"] ) && $_SESSION ["user_token"] != "") {
		$tokenURL = "token=" . $_SESSION ["user_token"];
	}
	// init post
	$get = "";
	foreach ( $_GET as $k => $v ) {
		$get .= "&" . $k . "=" . urlencode ( $v );
	}
	// process curl
	$curl = curl_init ( $base_api . $resource . "/" . $id . "?" . $tokenURL . $get );
	curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
	curl_setopt ( $curl, CURLOPT_CUSTOMREQUEST, 'GET' );
	curl_setopt ( $curl, CURLOPT_HEADER, 1 );
	$curl_response = curl_exec ( $curl );
	$header_size = curl_getinfo ( $curl, CURLINFO_HEADER_SIZE );
	$header = substr ( $curl_response, 0, $header_size );
	$curl_response = substr ( $curl_response, strpos ( $curl_response, "\r\n\r\n" ) + 4 );
	curl_close ( $curl );
	// fetch headers
	$pattern = '/Content-disposition: attachment; filename="(.*)"/i';
	preg_match ( $pattern, $header, $matches, PREG_OFFSET_CAPTURE );
	// print_r($matches);
	// echo ( $matches[1][0] );
	// headers
	header ( 'Content-Type: application/octet-stream' );
	header ( "Content-Transfer-Encoding: Binary" );
	header ( "Content-disposition: attachment; filename=\"" . $matches [1] [0] . "\"" );
	// return content
	return $curl_response;
}
// ////////////////////////////////////////////////////////////////////////////
/**
 *
 * @param unknown $mama_rest_url        	
 */
function post_token($mama_rest_url) {
	$curl_response = getStandardizedPost ( $mama_rest_url, "token" );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	// echo var_dump($entity); exit;
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// get token and save it in $_SESSION
		$_SESSION ['user_id'] = $entity ['user'] ['id'];
		$_SESSION ['user_token'] = $entity ['value'];
		$_SESSION ['user_email'] = $entity ['user'] ['email'];
		$_SESSION ['user_status'] = $entity ['user'] ['status'];
		$_SESSION ['user_right'] = $entity ['user'] ['right'];
		$_SESSION ['user_firstName'] = $entity ['user'] ['firstName'];
		$_SESSION ['user_lastName'] = $entity ['user'] ['lastName'];
		// retrun SUCCESS
		returnSuccess ( true );
	}
	returnSuccess ( false );
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function post_user($mama_rest_url) {
	$curl_response = getStandardizedPost ( $mama_rest_url, "user" );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && (array_key_exists ( "message", $entity ) || array_key_exists ( "error", $entity ))) {
			if (array_key_exists ( "error", $entity ))
				returnSuccess ( false, $entity ["error"] );
			else if (array_key_exists ( "message", $entity ))
				returnSuccess ( false, $entity ["message"] );
			else
				returnSuccess ( false );
		}
		if (is_array ( $entity ) && array_key_exists ( "success", $entity ) && $entity ['success'] == false) {
			returnSuccess ( false );
		}
		// status: SUCCESS
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_user($mama_rest_url) {
	$userID = "";
	if (isset ( $_GET ['userID'] ) && $_GET ['userID'] != "") {
		$userID = $_GET ['userID'];
	} else if (isset ( $_SESSION ['user_id'] ) && $_SESSION ['user_id'] != "") {
		$userID = $_SESSION ['user_id'];
	}
	$curl_response = getStandardizedPut ( $mama_rest_url, "user/" . $userID );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// update current user data
		if (! (isset ( $_GET ['userID'] ) && $_GET ['userID'] != $_SESSION ['user_id'])) {
			$_SESSION ['user_firstName'] = $_POST ['firstName'];
			$_SESSION ['user_lastName'] = $_POST ['lastName'];
		}
		
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_reset_password($mama_rest_url) {
	$curl_response = getStandardizedPut ( $mama_rest_url, "reset-password" );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_keyword($mama_rest_url) {
	$keywordID = "";
	if (isset ( $_GET ['keywordID'] ) && $_GET ['keywordID'] != "") {
		$keywordID = $_GET ['keywordID'];
	}
	$curl_response = getStandardizedPut ( $mama_rest_url, "keyword/" . $keywordID );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_subkeyword($mama_rest_url) {
	$keywordID = "";
	if (isset ( $_GET ['keywordID'] ) && $_GET ['keywordID'] != "") {
		$keywordID = $_GET ['keywordID'];
	}
	$curl_response = getStandardizedPut ( $mama_rest_url, "subkeyword/" . $keywordID );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_mthPlatform($mama_rest_url) {
	$mthPlatformID = "";
	if (isset ( $_GET ['mthPlatformID'] ) && $_GET ['mthPlatformID'] != "") {
		$mthPlatformID = $_GET ['mthPlatformID'];
	}
	$curl_response = getStandardizedPut ( $mama_rest_url, "mth-platform/" . $mthPlatformID );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_user_right($mama_rest_url) {
	if (isset ( $_GET ['userID'] ) && $_GET ['userID'] != "") {
		$userID = $_GET ['userID'];
	}
	$curl_response = getStandardizedPut ( $mama_rest_url, "user-right/" . $userID );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_project($mama_rest_url) {
	$projectID = "";
	if (isset ( $_GET ['projectID'] ) && $_GET ['projectID'] != "") {
		$projectID = $_GET ['projectID'];
	}
	$curl_response = getStandardizedPut ( $mama_rest_url, "project/" . $projectID );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_stop_project($mama_rest_url) {
	$projectID = "";
	if (isset ( $_GET ['projectID'] ) && $_GET ['projectID'] != "") {
		$projectID = $_GET ['projectID'];
	}
	$curl_response = getStandardizedPut ( $mama_rest_url, "stop-project/" . $projectID );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function put_appointment($mama_rest_url) {
	$appointmentID = "";
	if (isset ( $_GET ['appointmentID'] ) && $_GET ['appointmentID'] != "") {
		$appointmentID = $_GET ['appointmentID'];
	}
	$curl_response = getStandardizedPut ( $mama_rest_url, "appointment/" . $appointmentID );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "message", $entity )) {
			returnSuccess ( false );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_user($mama_rest_url) {
	$userID = "";
	if (isset ( $_GET ['userID'] ) && $_GET ['userID'] != "") {
		$userID = $_GET ['userID'];
	} else if (isset ( $_SESSION ['user_id'] ) && $_SESSION ['user_id'] != "") {
		$userID = $_SESSION ['user_id'];
	}
	$curl_response = getStandardizedGet ( $mama_rest_url, "user/" . $userID );
	echo $curl_response;
	// echo json_encode ( json_decode ( $curl_response ) );
}

/**
 *
 * @param String $mama_rest_url        	
 * @param Long $projectID        	
 */
function get_project($mama_rest_url, $projectID = null) {
	if (is_null ( $projectID ) && isset ( $_GET ['projectID'] ) && $_GET ['projectID'] != "") {
		$projectID = $_GET ['projectID'];
	}
	$curl_response = getStandardizedGet ( $mama_rest_url, "project/" . $projectID );
	$data = json_decode ( $curl_response, true );
	// echo $curl_response;
	if (! is_null ( $data ['scientificContextFile'] ) && $data ['scientificContextFile'] != "") {
		// $data ['scientificContextFileURL'] = $mama_rest_url . "project-file/" . $projectID . "?token=" . $_SESSION ["user_token"];
		$data ['scientificContextFileURL'] = "ajax/ajax_proxypass.php?verbe=get&resource=project-file&projectID=" . $projectID;
	}
	echo json_encode ( $data );
	// echo json_encode ( json_decode ( $curl_response ) );
}

/**
 *
 * @param String $mama_rest_url        	
 * @param Long $messageID        	
 */
function get_message($mama_rest_url, $messageID = null) {
	if (is_null ( $messageID ) && isset ( $_GET ['messageID'] ) && $_GET ['messageID'] != "") {
		$messageID = $_GET ['messageID'];
	}
	$curl_response = getStandardizedGet ( $mama_rest_url, "message/" . $messageID );
	echo $curl_response;
}

/**
 *
 * @param String $mama_rest_url        	
 * @param Long $messageID        	
 */
function get_appointment($mama_rest_url, $messageID = null) {
	$appointmentID = - 1;
	if (isset ( $_GET ['appointmentID'] ) && $_GET ['appointmentID'] != "") {
		$appointmentID = $_GET ['appointmentID'];
	}
	$curl_response = getStandardizedGet ( $mama_rest_url, "appointment/" . $appointmentID );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_messages_count($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "messages-count" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_appointments_count($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "appointments-count" );
	echo $curl_response;
}
/**
 *
 * @param unknown $mama_rest_url        	
 */
function post_project($mama_rest_url) {
	$curl_response = getStandardizedPost ( $mama_rest_url, "project" );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "error", $entity )) {
			returnSuccess ( false, $entity ['error'] );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function post_message($mama_rest_url) {
	$curl_response = getStandardizedPost ( $mama_rest_url, "message" );
	echo $curl_response;
	exit ();
	// if ($curl_response == "null") {
	// returnSuccess ( false );
	// }
	// // return
	// $entity = json_decode ( $curl_response, true );
	// if ($entity != null) {
	// if (is_array ( $entity ) && array_key_exists ( "error", $entity )) {
	// returnSuccess ( false, $entity ['error'] );
	// }
	// // status: SUCCESS
	// returnSuccess ( true );
	// } else {
	// returnSuccess ( false );
	// }
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function post_appointment($mama_rest_url) {
	$curl_response = getStandardizedPost ( $mama_rest_url, "appointment" );
	echo $curl_response;
	exit ();
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_users($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "users" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_projects_managers($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "projects-managers" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_projects($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "projects" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_messages($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "messages" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_appointments($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "appointments" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_events($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "events" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_keywords($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "keywords" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_subkeywords($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "subkeywords" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_mthPlatforms($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "mth-platforms" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_projects_stats($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "projects-stats" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_users_stats($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "users-stats" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_projects_statistics($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "projects-statistics" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_users_statistics($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "users-statistics" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_extra_data_statistics($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "extra-data-statistics" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_admin_generic_query($mama_rest_url, $mama_rest_query) {
	$curl_response = getStandardizedGet ( $mama_rest_url, $mama_rest_query );
	echo $curl_response;
}
/**
 *
 * @param unknown $mama_rest_url        	
 */
function delete_admin_tokens($mama_rest_url) {
	$curl_response = getStandardizedDelete ( $mama_rest_url, "admin/clean-tokens" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_server_load($mama_rest_url) {
	$curl_response = getStandardizedGet ( $mama_rest_url, "server-load" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function post_keyword($mama_rest_url) {
	$curl_response = getStandardizedPost ( $mama_rest_url, "keyword" );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "error", $entity )) {
			returnSuccess ( false, $entity ['error'] );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function post_subkeyword($mama_rest_url) {
	$curl_response = getStandardizedPost ( $mama_rest_url, "subkeyword" );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "error", $entity )) {
			returnSuccess ( false, $entity ['error'] );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function post_mthPlatform($mama_rest_url) {
	$curl_response = getStandardizedPost ( $mama_rest_url, "mth-platform" );
	if ($curl_response == "null") {
		returnSuccess ( false );
	}
	// return
	$entity = json_decode ( $curl_response, true );
	if ($entity != null) {
		if (is_array ( $entity ) && array_key_exists ( "error", $entity )) {
			returnSuccess ( false, $entity ['error'] );
		}
		// status: SUCCESS
		returnSuccess ( true );
	} else {
		returnSuccess ( false );
	}
}
/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_projects_file($mama_rest_url) {
	$curl_response = getXLSfile ( $mama_rest_url, "projects" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 */
function get_statistics_file($mama_rest_url) {
	$curl_response = getXLSfile ( $mama_rest_url, "statistics" );
	echo $curl_response;
}

/**
 *
 * @param unknown $mama_rest_url        	
 * @param unknown $pid        	
 */
function get_project_file($mama_rest_url, $pid) {
	$curl_response = getFile ( $mama_rest_url, "project-file", $pid );
	echo $curl_response;
}