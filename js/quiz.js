var questions = [
  {
    question_id: 1,
    question:
      "Which of the below statements is the correct way to describe player 14 scoring a goal after attempting a shot?",
  },
  {
    question_id: 2,
    question: "In the video above, what was the outcome of the event?",
  },
  {
    question_id: 3,
    question:
      "Which of these statements is NOT a correct way of specifying that the blue team has the possession?",
  },
  {
    question_id: 4,
    question:
      "In the video above, what is the correct way to annotate that Player 24 scored a point from a location?",
  },
  {
    question_id: 5,
    question:
      "When annotating a match, which keyword type must be spoken first?",
    video: "",
  },
  {
    question_id: 6,
    question: " Select the order of the game events from the video above.",
  },
  {
    question_id: 7,
    question: "In the video above, what was the outcome of the event?",
  },
  {
    question_id: 8,
    question: "In the video above, what was the position of the kickout?",
  },
  {
    question_id: 9,
    question:
      "Attack 45 refers to the player attacking from 45 degrees to the gate.",
  },
  {
    question_id: 10,
    question: "What position is the ball in the video?",
    video: "",
  },
];
/*
var i = 0;
var j = 0;
var qs = "";
var choice = "";

for (i in questions) {
  qs += "<br>"
  qs += questions[i].question + "<br><br>";
  for (j in questions[i].choice) {
    qs += "<input type='checkbox' name='content" + i + "'>"
    qs += "<label for='content" + i +"'>" + questions[i].choice[j].content + "<br>";
  }
  
}

document.getElementById("question").innerHTML = qs;
//document.getElementById("content").innerHTML = choice*/

document.getElementById("question1").innerHTML = questions[0].question;
document.getElementById("question2").innerHTML = questions[1].question;
document.getElementById("question3").innerHTML = questions[2].question;
document.getElementById("question4").innerHTML = questions[3].question;
document.getElementById("question5").innerHTML = questions[4].question;
document.getElementById("question6").innerHTML = questions[5].question;
document.getElementById("question7").innerHTML = questions[6].question;
document.getElementById("question8").innerHTML = questions[7].question;

function checkAnswer() {
  var score = 0;
  var x = document.getElementById("q1C").checked;
  if (x) {
    score++;
  }

  var y = document.getElementById("q2A").checked;
  if (y) {
    score++;
  }
  document.getElementById("demo").innerHTML = score;
  document.getElementById("markQ1").innerHTML = "&#9745";
  document.getElementById("markQ2").innerHTML = "&#9745";
}
