<?php
//ini_set('display_errors', '1');
include('database.php');

//get username and password
$user = $_POST['username'];
$pass = $_POST['password'];

//check database for existence of user
$query = 'SELECT * FROM users WHERE username = ?';
$vars = array($user);
$rs = $db->Execute($query, $vars);

if ($rs->recordCount() != 0) {
	echo 'userexists';
} else {
	$query = 'INSERT INTO users (username, password) VALUES (?,?)';
	$hashedPass = password_hash($pass, PASSWORD_BCRYPT);
	$vars = array($user, $hashedPass);
	$rs = $db->Execute($query, $vars);
	error_log($rs);
	echo 'Account created for ' . $user;
}

