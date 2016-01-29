<?php
session_start ();
header ( "Content-Type: application/json" );

$optLogin = Array ();
$optLang = Array (
		'en',
		'fr' 
);

$userData = Array ();

if (isset ( $_SESSION ["user_email"] ) && $_SESSION ["user_email"] != "") {
	array_push ( $optLogin, "user-profile" );
	array_push ( $optLogin, "logout" );
	$userData ["email"] = $_SESSION ["user_email"];
	$userData ["status"] = $_SESSION ["user_status"];
	$userData ["right"] = $_SESSION ["user_right"];
	$userData ["firstName"] = $_SESSION ["user_firstName"];
	$userData ["lastName"] = $_SESSION ["user_lastName"];
} else {
	array_push ( $optLogin, "login" );
}

$topMenu = Array ();
$topMenu ['lang'] = $optLang;
$topMenu ['login'] = $optLogin;
$topMenu ['user'] = $userData;

echo json_encode ( $topMenu );
exit ();