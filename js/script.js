$(function(){
	
	/**
	 * Initialize variables
	 */	
	var selections = [];
	var rejections = [];
	var genreIDs = [];
	var genreExclusions = [];
	var keywordAliases = [];
	var movieList = [];
	var showCount = 1;
	var loop = 0;
	var rating = '';
	var releaseDecadeStart = '';
	var releaseDecadeEnd = '';
	var voteAverage = '';


	/**
	 * Bind click events
	 */				
	$('.response').on('click', function(){
		$(this).addClass('selected');
		var responseID = $(this).attr('data-response-id').toLowerCase();
		var rejectedTitle = $(this).parent().siblings().children('.selrej').attr('data-response-title').toLowerCase();
		var responseTitle = $(this).attr('data-response-title').toLowerCase();
		responseTitle == 'neither' ? getNextQuestion(responseID) : storeResponse(responseID, responseTitle, rejectedTitle);
	});

	$('.show-another').on('click', function(){
		showResults(showCount);
		showCount++;
	});
	
	
	$('.filter-choice').on('click', function(){
		$(this).addClass('selected');
		$(this).siblings().removeClass('selected');
	});
	
	
	$('.filter-submit').on('click', function(){
		$(this).hide();
		storeFilters();
	});


	/**
	 * Stores response and stores the rejected option
	 * @param responseID - ID of selected response, from questions.js
	 * @param responseTitle - title of selected response, from questions.js
	 * @param rejectedTitle - title of non-selected response, from questions.js
	 */	
	function storeResponse(responseID, responseTitle, rejectedTitle) {
		selections.push(responseTitle);
		rejections.push(rejectedTitle);
		getNextQuestion(responseID);
	}	


	/**
	 * Identifies the next question to be displayed given the choice
	 * selected by the user.
	 * @param responseID - ID of selected response, from questions.js
	 */			
	function getNextQuestion(responseID) {
		var nextQuestionFound = null;
		for (var i = 0; i < data['questions'].length; i++) {
			for (var j = 0; j < data['questions'][i]['called-from'].length; j++) {
				if (data['questions'][i]['called-from'][j]['response-id'] == responseID)
					nextQuestionFound = data['questions'][i];
			}
		}

		nextQuestionFound == null ? getGenres() : displayNextQuestion(nextQuestionFound);
	}
	

	/**
	 * Captures data for next question
	 * Called from getNextQuestion()
	 * @param questionSet - next question set to be displayed based on previous user choice
	 */	
	
	function displayNextQuestion(questionSet){
		$('.response.selected').removeClass('selected');
		questionSet.responses.length == 3 ? $('.center').show() : $('.center').hide();
		updateQuestionText(questionSet.question);
		updateResponses(questionSet.responses)
	}


	/**
	 * Displays next question
	 * Called from displayNextQuestion()
	 * @param question - next question text
	 */	
	
	function updateQuestionText(question) {
		$('.question').text(question);
	}


	/**
	 * Displays response options for next question
	 * Called from displayNextQuestion()
	 * @param responses - all responses associated with new question set
	 */	
	
	function updateResponses(responses) {
		var i = 0;
		$('.response').each(function(){
			if (responses[i])
				helperUpdateResponses(this, responses[i]);
			i++;
		});
	}


	/**
	 * Helper function for function updateResponses();
	 * @param el - instance of .response element
	 * @param response - provided response in question set
	 */	
	
	function helperUpdateResponses(el, response) {
		if (response.response == 'Neither') {
			$(el).html('Neither, show me another option <i class="fa fa-arrow-right" aria-hidden="true"></i>');
		} else {
			$(el).text(response.response);
		}

		$(el).attr('data-response-title', response.response)
		$(el).attr('data-response-id', response['response-id']);
	}


	/**
	 * Grabs most up to date list of genres the API
	 */	
	function getGenres(){
		var api = "?api_key=933bee1465a61090ebe0704cd6d4c3e1";
		var baseURL = "http://api.themoviedb.org/3";
		var query = "/genre/list";
		var url = baseURL+query+api;

		$.ajax({
			url: url,
			datatype: 'json',
			success:function(data){
				getGenreID(data);
			}
		});
	}


	/**
	 * Helper function for getGenres() that creates arrays of both the selected genres and the rejected genres
	 * @param allGenres - The list of genres from the API
	 */	
	function getGenreID(allGenres){
		allGenres = allGenres['genres'];
	
		for (var i = 0; i < allGenres.length; i++) {
			if (selections.indexOf(allGenres[i].name.toLowerCase()) != -1) {
				genreIDs.push(allGenres[i].id);
			} else if (rejections.indexOf(allGenres[i].name.toLowerCase()) != -1) {
				genreExclusions.push(allGenres[i].id);
			}
		}

		if (genreIDs.length > 1) {
			genreIDs = genreIDs.join(',');
		}
	
		if (genreExclusions.length > 1) {
			genreExclusions = genreExclusions.join(',');
		}

		getKeywords();
	}


	/**
	 * Creates array of all alias words for keywords chosen by user
	 */	
	function getKeywords() {
		for (var j = 0; j < selections.length; j++) {
			for (var i = 0; i < aliasData['keywords'].length; i++) {
				if (aliasData['keywords'][i].keyword.toLowerCase() == selections[j]) {
					var aliases =  aliasData['keywords'][i].aliases;
					for (var k = 0; k < aliases.length; k++) {
						keywordAliases.push(aliases[k].alias);
					}
				}
			}
		}
		
		displayFilters();
	}

	
	/**
	 * Shows filters for rating, language, vote average, release year, and sorting preferences
	 */	
	function displayFilters() {
		$('.filters').slideToggle();
	}
	
	
	/**
	 * Hide filters for rating, language, vote average, release year, and sorting preferences
	 */	
	function hideFilters() {
		$('.filters').hide();
	}
	
	
	/**
	 * Store filter preferences
	 */	
	function storeFilters() {
		
		showSpinner();
		
		rating = $('.rating').find('.selected').attr('data-filter-value');
		voteAverage = $('.vote-average').find('.selected').attr('data-filter-value');
		releaseDecadeStart= $('.release-decade').find('.selected').attr('data-filter-value');
		releaseDecadeEnd = parseInt(releaseDecadeStart) + 9;

		var now = new Date();
		var yyyy = now.getFullYear();
		
		releaseDecadeEnd = releaseDecadeEnd > yyyy ? yyyy : releaseDecadeEnd;
		releaseDecadeEnd = releaseDecadeStart == '1900' ? yyyy : releaseDecadeEnd;
		releaseDecadeEnd = releaseDecadeStart == '1970' ? '1979' : releaseDecadeEnd;
		releaseDecadeStart = releaseDecadeStart == '1970' ? '1900' : releaseDecadeStart;
		
		
		getMovieList();
	}
	
	
	/**
	 * Show spinning circle while movie list is generated
	 */	
	function showSpinner() {
		$('.spinner').show();
	}
	
	
	/**
	 * Hide spinning circle 
	 */	
	function hideSpinner() {
		$('.spinner').slideToggle();
	}
	
	
	/**
	 * Queries API to get list of movies that match selected genres
	 * @param pagenum - optional - result page to query
	 * @param voteCount - optional - minimum number of votes to be included in query
	 */	
	function getMovieList(pagenum=1, voteCount=50) {
		// showSpinner();

		var url = "http://api.themoviedb.org/3/discover/movie?&api_key=933bee1465a61090ebe0704cd6d4c3e1&with_genres=" + genreIDs + 
						"&vote_average.gte=" + voteAverage +
						"&vote_count.gte=" + voteCount + 
						"&certification_country=US" +
						rating +
						"&page=" + pagenum + 
						"&primary_release_date.gte=" + releaseDecadeStart + '-01-01' +
						"&primary_release_date.lte=" + releaseDecadeEnd + '-12-31';
						

		if (pagenum < 39) {
			$.ajax({
				url: url,
				datatype: 'json',
				success:function(data){
					for (var i = 0; i < data['results'].length; i++) {
						getAliasMatches(data['results'][i]);
					}
			
					var totalResults = data['total_results'];

					// if the total results is too low, reduce vote count requirement and try again
					// else if there are more pages with results, and the movie list is still under 100, try again
					// else clear duplicates and show results
					
					if (totalResults < 20 && loop < 1) {
						loop++;
						movieList = [];
						getMovieList(pagenum, 0);
					} else if (totalResults > 20*pagenum && movieList.length <= 50) {
						pagenum++;
						getMovieList(pagenum, voteCount);
					} else {
						scrubDuplicates();
						
						setTimeout(function(){
							hideSpinner();
							movieList.length > 0 ? showResults() : showError();
						},900);
						
					}
				},
				failure:function(error){
					console.log(error);
				}
			});
		} else {
			setTimeout(function(){
				hideSpinner();
				movieList.length > 0 ? showResults() : showError();
			},900);
		}

	}


	/**
	 * Removes any accidental duplicates from movie list
	 */	
	function scrubDuplicates() {
		movieList = movieList.filter(function(elem, pos) {
		  return movieList.indexOf(elem) == pos;
		});
	}


	/**
	 * Helper function to calculate todays date so that the query only returns
	 * already released movies
	 */	
	function getToday() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; 
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		} 

		if(mm<10) {
		    mm='0'+mm
		} 

		today = yyyy+'-'+mm+'-'+dd;
		return today;
	}

	/**
	 * Loops through alias array to find matches in the summary.  If two or more matches are
	 * found, the movie is added to the movie list
	 */	
	function getAliasMatches(movie) {
		var matchedKeywords = 0;
		var summary = movie.overview.toLowerCase();
	
		if (keywordAliases.length > 0) {
			for (var j = 0; j < keywordAliases.length; j++) {
				if (summary.indexOf(keywordAliases[j]) != -1) {
					matchedKeywords++;
					if (matchedKeywords >= 2) { 
						movieList.push(movie);
						break;
					}
				}
			}
		} else {
			movieList.push(movie);
		}
	}


	/**
	 * Displays first result in movie list
	 */	
	function showResults(resultCount=0){	
		hideFilters();
			
		if (movieList[resultCount]) {
			var baseURL = 'https://image.tmdb.org/t/p/w500/'
			var poster = baseURL + movieList[resultCount].poster_path;
	
			$('.selections').show();
			$('.mobile-toolbar').show();
			$('.picker').hide();
		 	$('.poster').html('<img src = "' + poster + '">');
			$('.title').html(movieList[resultCount].title);
			$('.description').html(movieList[resultCount].overview);
		}

		resultCount >= movieList.length - 1 ? $('.show-another').hide() : $('.show-another').show();
	}


	/**
	 * Displays error if no movie could be found
	 */	
	function showError(){
		hideFilters();
		
		$('.selections').show();
		$('.picker').hide();
		$('.show-another').hide();
		$('.heading').html('<span>No Movies Match Your Criteria :(</span><a href = "index2.html"><br><div style = "margin-top: 50px" class = "button">Try Again</div></a>');
	}
});