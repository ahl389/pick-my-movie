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

if ($userdata['username'] != ''):
	$storedPass = $userdata['password'];
	$match = password_verify($pass, $storedPass);

	if ($match):
		$record = array(); 
		$record["loggedin"] = 'in';
		$updateSQL = $db->GetUpdateSQL($rs, $record);
		$db->Execute($updateSQL);
		echo $user;
	else:
		echo 'Login failed';
	endif;
endif;

