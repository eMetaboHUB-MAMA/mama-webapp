<?php
session_start ();

if (isset ( $_GET ["page"] ) && $_GET ["page"] != "") {
	switch ($_GET ["page"]) {
		case "login" :
			include ('../pages/login.html');
			break;
		case "logout" :
			foreach ( $_SESSION as $k => $v ) {
				$_SESSION [$k] = null;
				unset ( $_SESSION [$k] );
			}
			include ('../pages/logout.html');
			break;
		case "dashboard" :
			getDefaultPage ();
			break;
		case "user-profile" :
			include ('../pages/user-profile.html');
			break;
		case "create-account" :
			include ('../pages/create-account.html');
			break;
		default :
			getDefaultPage ();
	}
} else {
	getDefaultPage ();
}

/**
 */
function getDefaultPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
				include ('../pages/dashboard-admin.html');
				break;
			case "project_manager" :
				include ('../pages/dashboard-project_manager.html');
				break;
			case "user" :
			default :
				include ('../pages/dashboard-user.html');
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}