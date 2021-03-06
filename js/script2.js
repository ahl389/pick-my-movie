$(function () {

    let resultNum = 0;
	/**
	 * Initialize quiz object
	 */
    const quiz = {
        options: unnested,
        selections: [],
        rejections: [],
        genreIDs: [],
        genreExclusions: [],
        keywordAliases: [],
        results: [],
        keywordIDs: [],
        optionNum: 0,
        filters: {
            rating: '',
            releaseDecadeStart: 1900,
            releaseDecadeEnd: getYear(),
            voteAverage: 1
        }
    }

    let timeout;


    /**
     * Get current year
     */
    function getYear() {
        const date = new Date();
        return date.getFullYear();
    }



	/**
	 * Bind click and user events
	 */
    $('.container').on('click', '.response', function () {
        const res = $(this);
        res.addClass('selected');
        captureResponse(res);
    });


    $('.filter-choice').on('click', function () {
        $(this).addClass('selected');
        $(this).siblings().removeClass('selected');
    });

    $('.show-another').on('click', function () {
        updateScreen(quiz.results[resultNum]);
    });


    $('.back').on('click', function () {
        slideBack();
    });


    $('select[name="rating"]').on('change', function () {
        quiz.filters.rating = $(this).find('option:selected').val();
    });


    $('select[name="release-start"]').on('change', function () {
        quiz.filters.releaseDecadeStart = $(this).find('option:selected').val();
    });


    $('select[name="release-end"]').on('change', function () {
        quiz.filters.releaseDecadeEnd = $(this).find('option:selected').val();
    });


    $('select[name="voter-rating"]').on('change', function () {
        quiz.filters.voteAverage = $(this).find('option:selected').val();
    });



    /**
     * Stores response in object, then calls next function, processResponse().
     * @param {obj}     res - Response object
     */
    function captureResponse(res) {
        const response = {
            id: res.attr('data-question-id'),
            text: res.attr('data-text').toLowerCase(),
            rejectedText: res.siblings('.selrej').attr('data-text').toLowerCase(),
            neither: res.attr('data-text').toLowerCase() == 'neither' ? true : false
        }

        processResponse(response)
    }


    /**
     * Updates quiz object based on response information,
     * then calls next function, checkForNext().
     * @param {Object}     res - Response object
     */
    function processResponse(response) {
        if (response.neither) {
            quiz.optionNum += 2
        } else {
            quiz.selections.push(response.text);
            quiz.rejections.push(response.rejectedText);
        }

        checkForNext(response);
    }


	/**
	 * Checks quiz object to see if there are follow up options to be displayed,
     * and directs app accordingly.
	 * @param {Object}     res - Response object
	 */
    function checkForNext(response) {
        const selection = quiz.options.find(option => option.id == response.id)
        const nextOptions = selection.next;

        if (nextOptions == null) {
            getGenres()
        } else {
            getNext(response, nextOptions)
        }
    }


	/**
	 * Identifies next options to be displayed to user,
     * then calls next function, displayNext();
	 * @param {Array}   nextOptions - All possible option objects to be displayed based on previous user choice
	 */
    function getNext(response, nextOptions) {
        let showMore = nextOptions.length > 2 ? true : false;

        if (quiz.optionNum + 2 > nextOptions.length) {
            quiz.optionNum = 0;
        }

        const next = roll(nextOptions)

        if (response.neither) {
            showRoll(next, showMore)
        } else {
            displayNext(next, showMore);
        }

    }

    function roll(dice) {
        const option1 = dice[Math.floor(Math.random() * dice.length)];
        dice = dice.filter(option => option.id != option1.id)
        const option2 = dice[Math.floor(Math.random() * dice.length)]

        return ([option1, option2])
    }

    function showRoll(newOptions, showMore) {
        showMore ? $('.response.selected').siblings('.neither').show() : $('.response.selected').siblings('.neither').hide();

        let i = 0;

        $('.panel.last .selrej').addClass('blurry-text');

        $('.left-side').animate({
            marginLeft: 53
        }, 50).animate({
            marginLeft: 73
        }, 50).animate({
            marginLeft: 43
        }, 10).animate({
            marginLeft: 63
        }, 50).animate({
            marginLeft: 33
        }, 50).animate({
            marginLeft: 83
        }, 50).animate({
            marginLeft: 43
        }, 50).animate({
            marginLeft: 63
        }, 50).animate({
            marginLeft: 50
        }, 50);

        $('.right-side').animate({
            marginRight: 13
        }, 50).animate({
            marginRight: 53
        }, 50).animate({
            marginRight: 23
        }, 10).animate({
            marginRight: 83
        }, 50).animate({
            marginRight: 33
        }, 50).animate({
            marginRight: 63
        }, 50).animate({
            marginRight: 43
        }, 50).animate({
            marginRight: 73
        }, 50).animate({
            marginRight: 50
        }, 50, function () {
            $('.panel.last .selrej').each(function () {
                if (i < newOptions.length) {
                    $(this).text(newOptions[i].text)
                    $(this).attr('data-text', newOptions[i].text)
                    $(this).attr('data-question-id', newOptions[i].id)
                    $('.neither').attr('data-question-id', newOptions[i].pid);
                }

                i++;
            });

            $('.panel.last .selrej').removeClass('blurry-text');
        });

    }


	/**
	 * Displays response options for next question
	 * Called from displayNextQuestion()
	 * @param {Array}       next - Chosen pair of option objects to be displayed based on previous user choice
     * @param {Boolean}     showMore - A boolean indicating if there are other suboptions to show user
	 */
    function displayNext(next, showMore) {
        console.log(next)
        clearTimeout(timeout);
        $('.panel.last .neither').hide();
        $('.response.selected').removeClass('selected');

        let i = 0;

        let numPanels = $('.panel').length;
        let panel = $('.panel.last');
        let newPanel = panel.clone();
        let width = panel.width();

        let current = $('.container').css('left');
        current = current.replace('px', '');
        let newDestination = current * 1 - width;

        panel.removeClass('last');

        $('.container').append(newPanel);
        $(newPanel).css('left', width * numPanels);

        $('.last .response').each(function () {
            if (i < next.length) {
                $(this).text(next[i].text)
                $(this).attr('data-text', next[i].text)
                $(this).attr('data-question-id', next[i].id)
                $('.neither').attr('data-question-id', next[i].pid);
            }

            i++;
        });

        $('.container').animate({
            left: newDestination
        }, 750, function () {
            timeout = setTimeout(function () {
                showMore ? $('.panel.last .neither').show() : $('.panel.last .neither').hide();
            }, 3000);
        });

    }



	/**
	 * Grabs most up to date list of genres from the API
	 */
    function getGenres() {
        console.log(quiz)
        var api = "?api_key=933bee1465a61090ebe0704cd6d4c3e1";
        var baseURL = "https://api.themoviedb.org/3";
        var query = "/genre/list";
        var url = baseURL + query + api;

        $.ajax({
            url: url,
            datatype: 'json',
            success: function (data) {
                getGenreID(data);
            }
        });
    }

	/**
     * Grabs most up to date list of genres the API
     */
    function getDBKeyword(alias) {
        console.log(alias)
        var api = "&api_key=933bee1465a61090ebe0704cd6d4c3e1";
        var baseURL = "http://api.themoviedb.org/3";
        var query = `/search/keyword?query=${alias}`;
        var url = baseURL + query + api;

        $.ajax({
            url: url,
            datatype: 'json',
            success: function (data) {
                for (let keyword of data['results']) {
                    if (keyword.name == alias.toLowerCase()) {
                        console.log(keyword)
                        quiz.keywordIDs.push(keyword.id)
                    }

                }
            }
        });
    }


	/**
	 * Helper function for getGenres() that creates arrays of both the selected genres and the rejected genres
	 * @param allGenres - The list of genres from the API
	 */
    function getGenreID(allGenres) {
        allGenres = allGenres['genres'];
        let allKeywords = []

        for (let selection of quiz.selections) {
            for (let category of aliasData['categories']) {
                if (category.keyword.toLowerCase() == selection) {
                    allKeywords.push(category.keyword.toLowerCase());
                }
            }
        }

        for (let genre of allGenres) {
            console.log(genre.name + '-' + genre.id)
            if (!allKeywords.includes(genre.name.toLowerCase())) {
                if (quiz.selections.includes(genre.name.toLowerCase())) {
                    quiz.genreIDs.push(genre.id);
                } else if (quiz.rejections.includes(genre.name.toLowerCase())) {
                    quiz.genreExclusions.push(genre.id);
                }
            }


        }

        getKeywords();
    }


	/**
	 * Creates array of all alias words for keywords chosen by user
	 */
    function getKeywords() {

        for (let selection of quiz.selections) {
            for (let category of aliasData['categories']) {
                if (category.keyword.toLowerCase() == selection) {
                    quiz.keywordAliases.push(...category.aliases)
                }
            }
        }

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
    function getMovieList(movieList = [], pagenum = 1, index = 0) {
        $.ajax({
            url: getURL(pagenum),
            datatype: 'json',
            success: function (data) {

                for (let movie of data['results']) {
                    screenMovie(movieList, movie);
                }

                if (data['total_results'] > 20 * pagenum && movieList.length <= 30 && index < 20) {
                    pagenum++;
                    index++;
                    getMovieList(movieList, pagenum, index);
                } else {
                    quiz.results = scrubDuplicates(movieList);
                    quiz.results.sort(function (a, b) {
                        return b.numMatches - a.numMatches
                    });

                    showResponse();
                }
            },
            failure: function (error) {
                showError(error.text);
            }
        });
    }

    function getURL(pagenum) {
        const url = "https://api.themoviedb.org/3/discover/movie?api_key=933bee1465a61090ebe0704cd6d4c3e1" +
            "&with_genres=" + quiz.genreIDs.toString() +
            "&without_genres=" + quiz.genreExclusions.toString() +
            "&vote_average.gte=" + quiz.filters.voteAverage +
            "&vote_count.gte=" + 25 +
            "&certification_country=US" +
            "&certification=" + quiz.filters.rating +
            "&page=" + pagenum +
            "&primary_release_date.gte=" + quiz.filters.releaseDecadeStart + '-01-01' +
            "&primary_release_date.lte=" + quiz.filters.releaseDecadeEnd + '-12-31';

        return url;
    }


    function screenMovie(movieList, movie) {
        let numMatches = getNumMatches(movie)
        if (quiz.keywordAliases.length == 0 || numMatches >= 2) {
            movieList.push({
                "title": movie.title,
                "overview": movie.overview,
                "poster": movie.poster_path,
                "numMatches": numMatches
            });
        }
    }


	/**
	 * Removes any accidental duplicates from movie list
	 */
    function scrubDuplicates(movieList) {
        let scrubbedList = movieList = movieList.filter(function (elem, pos) {
            return movieList.indexOf(elem) == pos;
        });

        return scrubbedList;
    }


    // /**
    //      * Helper function to calculate todays date so that the query only returns
    //      * already released movies
    //      */
    //     function getToday() {
    //         var today = new Date();
    //         console.log(today.toISOString());
    //         var dd = today.getDate();
    //         var mm = today.getMonth()+1;
    //         var yyyy = today.getFullYear();
    //
    //         if(dd<10) {
    //             dd='0'+dd
    //         }
    //
    //         if(mm<10) {
    //             mm='0'+mm
    //         }
    //
    //         today = yyyy+'-'+mm+'-'+dd;
    //         return today;
    //     }


	/**
	 * Loops through alias array to find matches in the summary.  If two or more matches are
	 * found, the movie is added to the movie list
     * @param {String}  movie - a JSON representation of a movie
	 */
    function getNumMatches(movie) {
        let numMatches = 0;
        const summary = movie.overview.toLowerCase();

        for (let alias of quiz.keywordAliases) {
            if (summary.includes(alias)) {
                numMatches++;
            }
        }

        return numMatches;
    }

    function showResponse() {
        showSpinner();
        setTimeout(function () {
            hideSpinner();
            quiz.results.length > 0 ? showMovies() : showError('No movies match your criteria');
        }, 900);
    }

	/**
	 * Displays first result in movie list
	 */
    function showMovies() {
        updateScreen(quiz.results[resultNum]);
    }


    function updateScreen(movie) {
        $('.panel').hide();
        $('.filter-bar').hide();
        $('.selections').show();
        $('.mobile-toolbar').show();
        $('.picker').hide();
        $('.poster').html(`<img src = "https://image.tmdb.org/t/p/w500/${movie.poster}">`);
        $('.title').html(movie.title);
        $('.description').html(movie.overview);

        console.log(resultNum)
        resultNum >= quiz.results.length - 1 ? $('.show-another').hide() : $('.show-another').show();
        resultNum++;

    }



	/**
	 * Displays error if no movie could be found
	 */
    function showError(error) {
        hideFilters();

        $('.selections').show();
        $('.picker').hide();
        $('.show-another').hide();
        $('.heading').html(`<span>${error}</span><a href = "index2.html"><br><div style = "margin-top: 50px" class = "button">Try Again</div></a>`);
    }
});