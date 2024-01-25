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
// if not in RAM load it from ini file
$configFile = __DIR__ . "/../config/mama-webapp.json";
if (! file_exists ( $configFile )) {
	$copySuccess = copy ( $configFile . ".sample", $configFile );
}
// ////////////////////////////////////////////////////////////////////////////
// LOAD MAMA SERVER OPTIONS
$mama_config_file = file_get_contents ( $configFile );
$mama_config_json = json_decode ( $mama_config_file, true );

// ////////////////////////////////////////////////////////////////////////////
// INIT

// ////////////////////////////////////////////////////////////////////////////
// COPY LOCAL TMP DIR
$target_dir = sys_get_temp_dir ();
$target_file = $target_dir . DIRECTORY_SEPARATOR . basename ( $_FILES ["file"] ["name"] );
$uploadOk = false;
// $imageFileType = pathinfo ( $target_file, PATHINFO_EXTENSION );
// Check if image file is a actual image or fake image

if (move_uploaded_file ( $_FILES ["file"] ["tmp_name"], $target_file )) {
	// echo "The file " . basename ( $_FILES ["file"] ["name"] ) . " has been uploaded.";
	$uploadOk = true;
}

// ////////////////////////////////////////////////////////////////////////////
// COPY FROM TMP LOCAL DIR TO REST API; FETCH TMP CODE IN REMOTE
if ($uploadOk) {
	// initialise the curl request
	$request = curl_init ( $mama_config_json ['mamaRestApi'] . "/project-file?format=json" );
	// send a file
	curl_setopt ( $request, CURLOPT_POST, true );
	// attach file
	if (function_exists ( 'curl_file_create' )) { // php 5.5+
		$cFile = curl_file_create ( $target_file );
	} else { //
		$cFile = '@' . realpath ( $target_file );
	}
	$post = array (
			'file_contents' => $cFile 
	);
	curl_setopt ( $request, CURLOPT_POSTFIELDS, $post );
	// output the response
	curl_setopt ( $request, CURLOPT_RETURNTRANSFER, true );
	echo curl_exec ( $request );
	// RM TMP FILE
	unlink ( $target_file );
	// close the session
	curl_close ( $request );
	// exit
	exit ();
} else {
	// RETURN ERROR
	echo json_encode ( array (
			'success' => false,
			'message' => "_could_not_copy_file" 
	) );
	exit ();
}