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
$userdata = $rs->fetchRow();

if ($userdata['username'] == ''):
	$query = 'INSERT INTO users (username, password) VALUES (?,?)';
	$hashedPass = password_hash($pass, PASSWORD_BCRYPT);
	$vars = array($user, $hashedPass);
	$db->Execute($query, $vars);
	echo 'Account created for ' . $user;
else:
	echo "User with this name already exists, please select a new username."
endif;

