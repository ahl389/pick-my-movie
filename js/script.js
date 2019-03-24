$(function(){
	
	/**
	 * Initialize variables
	 */	
	let selections = [];
	let rejections = [];
	let genreIDs = [];
	let genreExclusions = [];
	let keywordAliases = [];
    let scrubbedResults = [];
	let showCount = 1;
    let resultNum = 0;
	let loop = 0;
    let filters;
    let optionNum = 0;


    const quiz = {
        selections: [],
        rejections: [],
        genreIDs: [],
        genreExclusions: [],
        keywordAliases: [],
        results: []
    }
    
    
	/**
	 * Bind click events
	 */				
	$('.response').on('click', function(){
		$(this).addClass('selected');
        
        const questionID = $(this).attr('data-question-id');
		const selText = $(this).attr('data-text').toLowerCase();
        const rejText = $(this).siblings('.response.selrej').attr('data-text').toLowerCase();

        if (selText == 'neither') {
            optionNum += 2
            getNextQuestion(questionID, true) 
        } else {
            storeResponse(questionID, selText, rejText);
        }
	});

	$('.show-another').on('click', function(){
        updateScreen(scrubbedResults[resultNum]);
	});
	
	
	$('.filter-choice').on('click', function(){
		$(this).addClass('selected');
		$(this).siblings().removeClass('selected');
	});
	
	
	$('.filter-submit').on('click', function(){
		$(this).hide();
		filters = storeFilters();
        getMovieList();
	});


	/**
	 * Stores response and stores the rejected option
	 * @param responseID - ID of selected response, from questions.js
	 * @param responseTitle - title of selected response, from questions.js
	 * @param rejectedTitle - title of non-selected response, from questions.js
	 */	
	function storeResponse(questionID, selText, rejText) {
		selections.push(selText);
		rejections.push(rejText);
        getNextQuestion(questionID, false);
	}	


	/**
	 * Identifies the next question to be displayed given the choice
	 * selected by the user.
	 * @param responseID - ID of selected response, from questions.js
	 */			
	function getNextQuestion(questionID, neither) {
        let currentQuestion = unnested.find(question => question.id == questionID)
       
        if (currentQuestion.next == null) {
            getGenres()
        } else {
            let another = currentQuestion.next.length > 2 ? true : false;
            
            if (optionNum + 2 > currentQuestion.next.length) {
                optionNum = 0;
            } 
            
            let choice1 = currentQuestion.next[optionNum];
            let choice2 = currentQuestion.next[optionNum+1];
           
            displayNextQuestion(choice1, choice2, another);
        }
	}
	

	/**
	 * Captures data for next question
	 * Called from getNextQuestion()
	 * @param questionSet - next question set to be displayed based on previous user choice
	 */	
	
	function displayNextQuestion(choice1, choice2, another){
		$('.response.selected').removeClass('selected');
		another ? $('.neither').show() : $('.neither').hide();
        let choices = [choice1, choice2]
		updateButtons(choices)
	}
    
    
	/**
	 * Displays response options for next question
	 * Called from displayNextQuestion()
	 * @param responses - all responses associated with new question set
	 */	
	
	function updateButtons(choices) {
		var i = 0;

		$('.response').each(function(){
			if (i < choices.length) {
                $(this).text(choices[i].text)
                $(this).attr('data-text', choices[i].text)
                $(this).attr('data-question-id', choices[i].id)
                $(this).siblings('.response.neither').attr('data-question-id', choices[i].pid);
			}
            
			i++;
		});
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
	 * Grabs most up to date list of genres the API
	 */	
	function getDBKeywords(movieID){
		var api = "?api_key=933bee1465a61090ebe0704cd6d4c3e1";
		var baseURL = "http://api.themoviedb.org/3";
		var query = `/movie/${movieID}/keywords`;
		var url = baseURL+query+api;

		$.ajax({
			url: url,
			datatype: 'json',
			success:function(data){
				console.log(data)
			}
		});
	}


	/**
	 * Helper function for getGenres() that creates arrays of both the selected genres and the rejected genres
	 * @param allGenres - The list of genres from the API
	 */	
	function getGenreID(allGenres){
		allGenres = allGenres['genres'];

        for (let genre of allGenres) {
            if (selections.includes(genre.name.toLowerCase())) {
                genreIDs.push(genre.id);
            } else if (rejections.includes(genre.name.toLowerCase())) {
                genreExclusions.push(genre.id);
            }
        }
        
        genreIDs = genreIDs.toString();
        genreExclusions.toString();
		getKeywords();
	}


	/**
	 * Creates array of all alias words for keywords chosen by user
	 */	
	function getKeywords() {
        
        for (let selection of selections) {
            for (let category of aliasData['categories']) {
                if (category.keyword.toLowerCase() == selection) {
                    keywordAliases.push(...category.aliases)
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
        const filters = {
            rating: $('.rating').find('.selected').attr('data-filter-value'),
            voteAverage: $('.vote-average').find('.selected').attr('data-filter-value'),
            releaseDecade: $('.release-decade').find('.selected').attr('data-filter-value').split('-')
        }
        
        return filters;
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
	function getMovieList(movieList = [], pagenum=1) {
		const url = "https://api.themoviedb.org/3/discover/movie?&api_key=933bee1465a61090ebe0704cd6d4c3e1" +
                        "&with_genres=" + genreIDs + 
                        "&without_genres=" + genreExclusions +
						"&vote_average.gte=" + filters.voteAverage +
			            "&vote_count.gte=" + 50 +
						"&certification_country=US" + 
                        "&certification=" + filters.rating +
						"&page=" + pagenum + 
						"&primary_release_date.gte=" + filters.releaseDecade[0] + '-01-01' +
						"&primary_release_date.lte=" + filters.releaseDecade[1] + '-12-31';
        
		$.ajax({
            url: url,
            datatype: 'json',
            success:function(data){

                if (data['total_results'] > 20*pagenum && movieList.length <= 25 ) {
                    for (let movie of data['results']) {
                        screenMovie(movieList, movie);
                    }
                    
                    pagenum++
                    getMovieList(movieList, pagenum);
                } else {
                    scrubbedResults = scrubDuplicates(movieList);
                    showResponse();
                }
            },
            failure:function(error){
                showError(error.text);
            }
        });
	}
    
    function screenMovie(movieList, movie) {
        if (keywordAliases.length == 0 || getNumMatches(movie) >= 2) {
            movieList.push(movie)
        }
    }


	/**
	 * Removes any accidental duplicates from movie list
	 */	
	function scrubDuplicates(movieList) {
		let scrubbedList = movieList = movieList.filter(function(elem, pos) {
		  return movieList.indexOf(elem) == pos;
		});

        return scrubbedList;
	}


	/**
	 * Helper function to calculate todays date so that the query only returns
	 * already released movies
	 */	
	function getToday() {
		var today = new Date();
        console.log(today.toISOString());
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
     * @param {String}  movie - a JSON representation of a movie
	 */	
	function getNumMatches(movie) {
		let numMatches = 0;
		const summary = movie.overview.toLowerCase();

        for (let alias of keywordAliases) {
			if (summary.includes(alias)) {
				numMatches++;
			}
        }
        
        return numMatches;
	}

    function showResponse() {
		setTimeout(function(){
            hideSpinner();
            scrubbedResults.length > 0 ? showMovies() : showError('No movies match your criteria');
        }, 900);
    }

	/**
	 * Displays first result in movie list
	 */	
	function showMovies(){	
		hideFilters();
        updateScreen(scrubbedResults[resultNum]);
		resultNum >= scrubbedResults.length - 1 ? $('.show-another').hide() : $('.show-another').show();
	}
    
    function updateScreen(movie) {
        $('.selections').show();
        $('.mobile-toolbar').show();
        $('.picker').hide();
        $('.poster').html(`<img src = "https://image.tmdb.org/t/p/w500/${movie.poster_path}">`);
        $('.title').html(movie.title);
        $('.description').html(movie.overview);
        
        resultNum++;
    }
    
    

	/**
	 * Displays error if no movie could be found
	 */	
	function showError(error){
		hideFilters();
		
		$('.selections').show();
		$('.picker').hide();
		$('.show-another').hide();
		$('.heading').html(`<span>${error}</span><a href = "index2.html"><br><div style = "margin-top: 50px" class = "button">Try Again</div></a>`);
	}
});