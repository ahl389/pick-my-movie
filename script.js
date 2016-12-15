<div class 

<script>

$(function(){
	//get question response on button click
	
	//identify next question to be shown
		//if response == neither, show another same level question
		//else get next level question
	
	var data = 
	[
	    {
				"level0":[
					{
						"question-set-id":"qs-0-0",
						"question": "Comedy or Tearjerker",
						"response-1": "Comedy-1",
						"response-2": "Tearjerk-1",
						"response-3": "Neither",
					},
					{
						"question-set-id":"qs-0-1",
						"question": "Psychological Thriller or Fantasy",
						"response-1": "Thriller",
						"response-2": "Fantasy",
						"response-3": "Neither",
					},
					{
						"question-set-id":"qs-0-2",
						"question": "Historical or Mystery",
						"response-1": "Historical",
						"response-2": "Mystery",
						"response-3": "Neither",
					}
				]
			}
	];
	
	console.log(data[0][1][question]);
	
	$('.response').on('click', parseResponse);
	
	
	function parseResponse(e){
		var element = e.target;
		var response = element.attr('id');
		var qsid = element.attr('data-question-set-id');
		
		response == 'neither' ? getNewQuestion(qsid) : storeResponse(response);

	}
	
	function getNewQuestion(qsid) {
		id = qsid.split('-');
		var level = 'level-' + id[1];
		var questionSet = int(id[2]);
		var newQuestionSet = data[level][questionSet+1];
		// var newQuestion = data[level][questionSet+1].question;
// 		var responses = data[level][questionSet+1].responses;
		displayQuestion(newQuestionSet);
	}
	
	function storeResponse(response) {
		getNextQuestion();
	}
	
	function getNextQuestion() {
		
	}
	
	function displayQuestion(questionSet) {
		var i = 0;
		$('.question').text(questionSet.question);
		$('.responses').each(function(){
			$(this).text(questionSet.responses[i]);
			$(this).attr('data-question-set-id', questionSet.qsid);
			i++;
		});
	}
	
});
</script>