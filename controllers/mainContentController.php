<?php
session_start ();

if (isset ( $_GET ["page"] ) && $_GET ["page"] != "") {
	switch ($_GET ["page"]) {
		case "login" :
			if (! (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "")) {
				include ('../pages/login.html');
			} else {
				getDefaultPage ();
			}
			break;
		case "reset-password" :
			if (! (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "")) {
				include ('../pages/reset-password.html');
			} else {
				getDefaultPage ();
			}
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
			if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
				include ('../pages/user-profile.html');
			} else {
				include ('../pages/default.html');
			}
			break;
		case "create-account" :
			if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
				getDefaultPage ();
			} else {
				include ('../pages/create-account.html');
			}
			break;
		case "new-project" :
			if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
				include ('../pages/new-project.html');
			} else {
				include ('../pages/default.html');
			}
			break;
		case "edit-project" :
			getEditProjectPage ();
			break;
		case "users" :
			getUsersPage ();
			break;
		case "projects" :
			getProjectsPage ();
			break;
		case "messages" :
			getMessagesPage ();
			break;
		case "appointments" :
			getAppointmentsPage ();
			break;
		case "statistics" :
			getStatisticsPage ();
			break;
		case "settings" :
			getSettingsPage ();
			break;
		case "help" :
			getHelpPage ();
			break;
		default :
			getDefaultPage ();
			break;
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

/**
 */
function getProjectsPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
			case "project_manager" :
				include ('../pages/projects-project_manager.html');
				break;
			case "user" :
			default :
				include ('../pages/projects-user.html');
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}

/**
 */
function getHelpPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
			case "project_manager" :
				include ('../pages/help.html');
				break;
			case "user" :
			default :
				include ('../pages/default.html');
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}

/**
 */
function getMessagesPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
			case "project_manager" :
			case "user" :
			default :
				include ('../pages/messages.html');
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}

/**
 */
function getAppointmentsPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
			case "project_manager" :
			case "user" :
			default :
				include ('../pages/appointments.html');
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}

/**
 */
function getEditProjectPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
			case "project_manager" :
				include ('../pages/edit-project-project_manager.html');
				break;
			case "user" :
			default :
				include ('../pages/edit-project-user.html');
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}

/**
 */
function getSettingsPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
				include ('../pages/backoffice.html');
				break;
			case "project_manager" :
			case "user" :
			default :
				getDefaultPage ();
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}

/**
 */
function getStatisticsPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
				include ('../pages/statistics.html');
				break;
			case "project_manager" :
			case "user" :
			default :
				getDefaultPage ();
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}

/**
 */
function getUsersPage() {
	if (isset ( $_SESSION ["user_right"] ) && $_SESSION ["user_right"] != "") {
		switch ($_SESSION ["user_right"]) {
			case "admin" :
				include ('../pages/users.html');
				break;
			case "project_manager" :
			case "user" :
			default :
				include ('../pages/default.html');
				break;
		}
	} else {
		include ('../pages/default.html');
	}
}