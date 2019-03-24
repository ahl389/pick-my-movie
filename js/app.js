var qs = { "questions":
     [
        {
            "text": "Animation",
            "next": [
                {
                    "text": "Adventure",
                    "next": null
                },
                {
                    "text": "Fairy Tale Romance",
                    "next": null 
                }
            ] 
        },
        {
            "text": "Live Action",
            "next": [
                {
                    "text": "Documentary",
                    "genre": '99',
                    "next": [
                        {
                            "text": "Mystery",
                            "next": null
                        },
                        {
                            "text": "Biopic",
                            "next": null 
                        },
                        {
                            "text": "Political",
                            "next": null 
                        },
                        {
                            "text": "Nature",
                            "next": null 
                        },
                        {
                            "text": "True Crime",
                            "next": null 
                        },
                        {
                            "text": "Sports & Leisure",
                            "next": null 
                        },
                    ] 
                },
                {
                    "text": "Not a Documentary",
                    "next": [
                        {
                            "text": "Comedy",
                            "genres": "35",
                            "next": [
                                {
                                    "text": "Romance",
                                    "next": null
                                },
                                {
                                    "text": "Family",
                                    "next": null 
                                },
                                {
                                    "text": "Raunchy",
                                    "next": null 
                                },
                                {
                                    "text": "Coming of Age",
                                    "next": null 
                                }
                            ]
                        },
                        {
                            "text": "Drama",
                            "genres": "18",
                            "next": [
                                {
                                    "text": "Romance",
                                    "next": [
                                        {
                                            "text": "Coming of Age",
                                            "next": null
                                        },
                                        {
                                            "text": "Adult",
                                            "next": null 
                                        }
                                    ]
                                },
                                {
                                    "text": "Family",
                                    "next": null 
                                },
                                {
                                    "text": "Biopic",
                                    "next": null 
                                },
                                {
                                    "text": "Coming of Age",
                                    "next": null 
                                },
                                {
                                    "text": "Political",
                                    "next": null 
                                },
                                {
                                    "text": "Period",
                                    "next": null 
                                }
                            ]
                        },
                        {
                            "text": "Thriller",
                            "next": [
                                {
                                    "text": "Psychological",
                                    "next": null
                                },
                                {
                                    "text": "Action",
                                    "next": null 
                                },
                                {
                                    "text": "Horror",
                                    "next": [
                                        {
                                            "text": "Slasher",
                                            "next": null
                                        },
                                        {
                                            "text": "Supernatural",
                                            "next": null 
                                        }
                                    ] 
                                },
                                {
                                    "text": "Crime",
                                    "next": null
                                }
                            ] 
                        },    
                        {
                            "text": "Fantasy/SciFi",
                            "next": [
                                {
                                    "text": "Supernatural/Magic",
                                    "next": null
                                },
                                {
                                    "text": "Adventure/Journey",
                                    "next": null 
                                }
                            ] 
                        },
                        {
                            "text": "Music",
                            "next": null
                        },
                        {
                            "text": "Adventure",
                            "next": null
                        }
                    ]  
                }
            ] 
        }
    ]
}


class Question {
    constructor(id, text, next, pid = null) {
        this.id = id;
        this.text = text;
        this.next = next;
        this.pid = pid;
    }
}



var nested = [];
var unnested = [];
let topid = 0;
let subid = 0;

for (let q of qs['questions']) {
    //create object
    let question = new Question('top-' + topid, q.text);
    let id = question.id;
    console.log(id)
    // find subquestions
    let subquestions = [];
    subquestions.push(...findSubs(q));
    
    // update object's subquestions property
    question.next = subquestions;
    
    // add question object to array of question objects
    unnested.push(question)
    nested.push(question)
    topid++;
}

addIDs();

function findSubs(question) {
    let subquestions = [];

    // if there are existing subquestions
    if (question.next != null) {
        //lastpid = pid;
        //pid = lastpid
        
        
        // loop through subquestions
        for (let sub of question.next) {
            // create subquestion object

            let deepsubs = findSubs(sub);
            let subquestion = new Question('sub-' + subid, sub.text, deepsubs);
            //subtop = subquestion
            
            //console.log(subquestion)
            unnested.push(subquestion)
            
            // add subquestion to array of subquestions 
            subquestions.push(subquestion);
            subid++;

           
           // console.log(lastpid)
        }
        
        
       // console.log(pid)
        // return subquestions array back to higher level question
        return subquestions;
    } else {

        //pid = lastpid;
        
        return null;
    }
}

function addIDs() {
    for (let question of unnested) {
        if (question.next != null) {
            for (let sub of question.next) {
                sub.pid = question.id
            }
        }
    }
}


