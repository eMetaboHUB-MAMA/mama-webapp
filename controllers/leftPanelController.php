<?php
session_start ();

$pages = Array ();

if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
	switch ($_SESSION ["user_right"]) {
		case "admin" :
			array_push ( $pages, "dashboard" );
			// TODO add other admin pages
			break;
		case "project_manager" :
			array_push ( $pages, "dashboard" );
			// TODO add other PM pages
			break;
		case "user" :
		default :
			array_push ( $pages, "dashboard" );
			// TODO add other user pages
			break;
	}
} else {
	array_push ( $pages, "default" );
	array_push ( $pages, "create-account" );
}

echo json_encode ( $pages );
exit ();