var quiz = 
[
    {
        quiz_no:1,
        question:"Which of the below is the correct way to describe player 14 just scored a goal after attempting a shot?",
        choice:
        [
            {
                content:"player 14 just scored a goal with a shot",
                answer:0
            },
            {
                content:"player 14 shot goal",
                answer:0
            },
            {
                content:"goal shot player 14",
                answer:0
            },
            {
                content:"shot player 14 goal",
                answer:1
            }
        ]
    },
    {
        quiz_no:2,
        question:"In this video, what outcome has occured?",
        video:"",
        choice:
        [
            {
                content:"Turnover",
                answer:1
            },
            {
                content:"Sideline",
                answer:0
            },
            {
                content:"Throw in",
                answer:0
            },
            {
                content:"Wide",
                answer:0
            }
        ]
    },
    {
        quiz_no:3,
        question:"Which of the sentence below is not a way of specifying which team has the possession?",
        choice:
        [
            {
                content:"blue possession",
                answer:0
            },
            {
                content:"green team possession",
                answer:0
            },
            {
                content:"red ball",
                answer:0
            },
            {
                content:"purple control",
                answer:1
            }
        ]
    },
    {
        quiz_no:4,
        question:"Which of the sentence below is NOT a correct way of specifying which team has the possession?",
        choice:
        [
            {
                content:"blue possession",
                answer:0
            },
            {
                content:"green team possession",
                answer:0
            },
            {
                content:"red ball",
                answer:0
            },
            {
                content:"purple control",
                answer:1
            }
        ]
    },
    {
        quiz_no:5,
        question:"What is the event occured in the video?",
        video:"",
        choice:
        [
            {
                content:"kickpass",
                answer:1
            },
            {
                content:"kickout",
                answer:0
            },
            {
                content:"sideline shot",
                answer:0
            },
            {
                content:"Tug",
                answer:0
            }
        ]
    },
    {
        quiz_no:6,
        question:"When annotating a match, which keyword type must always be spoken first?",
        choice:
        [
            {
                content:"Event",
                answer:1
            },
            {
                content:"Outcome",
                answer:0
            },
            {
                content:"Position",
                answer:0
            },
            {
                content:"Player Number",
                answer:0
            }
        ]
    },
    {
        quiz_no:7,
        question:"Green team currently has the ball, instead of saying blue team possession, what is a shorter way to indicate that the ball has been change to the other team?",
        choice:
        [
            {
                content:"Turnover",
                answer:1
            },
            {
                content:"Free",
                answer:0
            },
            {
                content:"Wide",
                answer:0
            },
            {
                content:"Attack",
                answer:0
            }
        ]
    },
    {
        quiz_no:8,
        question:"After indicating that blue team has the ball, the application will assume all subsequent events are performed by members of blue team, until the user has indicated the other team has the ball.",
        choice:
        [
            {
                content:"True",
                answer:1
            },
            {
                content:"False",
                answer:0
            }
        ]
    },
    {
        quiz_no:9,
        question:"Attack 45 refers to the player attacking from 45 degrees to the gate.",
        choice:
        [
            {
                content:"True",
                answer:0
            },
            {
                content:"False",
                answer:1
            }
        ]
    },
    {
        quiz_no:10,
        question:"What position is the ball in the video?",
        video:"",
        choice:
        [
            {
                content:"Mid",
                answer:0
            },
            {
                content:"45",
                answer:1
            },
            {
                content:"65",
                answer:0
            },
            {
                content:"sideline",
                answer:0
            }
        ]
    }
]

var new_quiz = [];

var answers = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

var current_order = 0;

function startQuiz()
{
    
    for (var i = 0;i<quiz.length;i++)
    {
        new_quiz.push(quiz[i]);
        new_quiz[i].choice = shuffleArray(quiz[i].choice);
        console.log(quiz[i].quiz_no)
    }
    new_quiz = shuffleArray(new_quiz);
    generateQuestion(new_quiz[0],0);
    
    
    
    
}

function generateQuestion(question,order)
{
    var quiz_area = document.getElementById("quiz_area");
    quiz_area.innerHTML = ""
    
    var question_line = document.createElement("div");
    question_line.innerHTML = "Question number "+(order+1)+":"+question.question;
    
    if (question.hasOwnProperty("video"))
    {
        var video = document.createElement("video");
        video.src = question.video;
        quiz_area.appendChild(video);
    }
    
    var choice_area = document.createElement("div");
    for (var i = 0; i< question.choice.length;i++)
    {
        var newButton = document.createElement("button");
        newButton.setAttribute("onclick","setAnswer("+(i+1)+","+order+")");
        newButton.innerHTML = question.choice[i].content;
        newButton.id = "choice_"+(i+1)
        choice_area.appendChild(newButton);
        
        if (answers[current_order] === i+1)
        {
            newButton.style.backgroundColor = "Green";
        }
    }
    
    quiz_area.appendChild(question_line);
    quiz_area.appendChild(choice_area);
}

function setAnswer(choiceNum, index)
{
    answers[index] = choiceNum;
    var buttons = document.getElementById("buttons");
    
    
    
    
    var finished = true;
    for (var i = 0; i< 10;i++)
    {
        if (answers[i] === -1)
        {
            finished = false;
        }
    }
    
    
    
    if (finished)
    {
        var finishButton = document.createElement("button");
        finishButton.innerHTML = "Finish Quiz";
        finishButton.setAttribute("onclick","getResult()");
        document.getElementById("buttons").appendChild(finishButton);
    }
    generateQuestion(new_quiz[current_order],index)
}

function switchQuestion(index)
{
    if (current_order+index >= 0 || current_order+index <= 9)
    {
        current_order+=index;
        generateQuestion(new_quiz[current_order],current_order);
    }
}

function getResult()
{
    var quiz_area = document.getElementById("quiz_area");
    quiz_area.innerHTML = "";
    
    var score = 0;
    
    for (var i = 0; i < new_quiz.length;i++)
    {
        if (new_quiz[i].choice[answers[i]-1].answer === 1)
        {
            score++;
        }
    }
    
    quiz_area.innerHTML = "Your final score is "+score+"/10";
    
    
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

