$('.create').on('click', function(){
	$('.login').toggleClass('active');
	$('.create').toggleClass('active');
	$('.slider').animate({
		left:'50%'
	}, 200);
	$('.slider').toggleClass('left').toggleClass('right');
	$('#login-create-form').attr('action', 'createuser.php');
	$('#account-action-submit').val('Create Account');
});

$('.login').on('click', function(){
	$('.create').toggleClass('active');
	$('.login').toggleClass('active');
	$('.slider').animate({
		left:'0px'
	}, 200);
	$('#login-create-form').attr('action', 'login.php');
	$('.slider').toggleClass('left').toggleClass('right');
	$('#account-action-submit').val('Login');
});

$('#login-create-form').submit(function(e){
	e.preventDefault();
	var url = $(this).attr('action');
	var data = $(this).serialize();
	$.ajax({
		url: url,
		method: 'post',
		data: data,
		success: function(data){
			console.log(data);
			if (data == 'userexists') {
				$('.login-message').text('A user with this name already exists, please select a new username.');
			} else {
				window.location.replace("http://stackoverflow.com");
			}
		},
		failure: function(error){
			$('.login-message').text(data);
		}
	});
});