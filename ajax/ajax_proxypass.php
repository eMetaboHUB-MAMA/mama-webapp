<?php
session_start ();
set_time_limit ( 0 );
header ( "Content-Type: application/json" );

// ////////////////////////////////////////////////////////////////////////////
// LOAD MAMA SERVER OPTIONS
$mama_config_file = file_get_contents ( __DIR__ . "/../config/mama-webapp.json" );
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
				$curl = curl_init ( $mama_config_json ['mamaRestApi'] . 'token' );
				curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, true );
				curl_setopt ( $curl, CURLOPT_POST, true );
				curl_setopt ( $curl, CURLOPT_POSTFIELDS, "email=" . $_POST ['email'] . "&password=" . $_POST ['password'] );
				curl_setopt ( $curl, CURLOPT_HTTPHEADER, array (
						"Accept: application/json" 
				) );
				$curl_response = curl_exec ( $curl );
				curl_close ( $curl );
				if ($curl_response == "null") {
					returnSuccess ( false );
				}
				// return
				$entity = json_decode ( $curl_response, true );
				if ($entity != null) {
					// get token and save it in $_SESSION
					$_SESSION ['user_id'] = $entity ['id'];
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
			} else if ($verbe == "DELETE") {
			}
			returnSuccess ( false );
		default :
			returnSuccess ( false );
	}
} else {
	returnSuccess ( false );
}

/**
 *
 * @param unknown $success        	
 */
function returnSuccess($success) {
	echo json_encode ( array (
			'success' => $success 
	) );
	exit ();
}
// ////////////////////////////////////////////////////////////////////////////

