var quiz = [
  {
    quiz_no: 1,
    question:
      "Which of the below statements is the correct way to describe player 14 scoring a goal after attempting a shot?",
    choice: [
      {
        content: "Player 14 just scored a goal with a shot",
        answer: 0,
      },
      {
        content: "Player 14 Shot Goal",
        answer: 0,
      },
      {
        content: "Goal Shot Player 14",
        answer: 0,
      },
      {
        content: "Shot Goal Player 14",
        answer: 1,
      },
    ],
  },
  {
    quiz_no: 2,
    question: "In the video above, what was the outcome of the event?",
    video: "./media/TacTalk-Q2.mp4",
    choice: [
      {
        content: "Goal",
        answer: 0,
      },
      {
        content: "Point",
        answer: 1,
      },
      {
        content: "Wide",
        answer: 0,
      },
      {
        content: "Turnover",
        answer: 0,
      },
    ],
  },
  {
    quiz_no: 3,
    question:
      "Which of the sentence below is NOT a way of specifying which team has the possession?",
    choice: [
      {
        content: "Blue Possession",
        answer: 0,
      },
      {
        content: "Blue Control",
        answer: 1,
      },
      {
        content: "Blue Ball",
        answer: 0,
      },
      {
        content: "Blue Team Possession",
        answer: 0,
      },
    ],
  },
  {
    quiz_no: 4,
    question:
      "In the video above, what location on the pitch did Player 24 score from?",
    video: "./media/TacTalk-Q4.mp4",
    choice: [
      {
        content: "Short Centre",
        answer: 0,
      },
      {
        content: "Short Right",
        answer: 0,
      },
      {
        content: "Short Left",
        answer: 1,
      },
      {
        content: "Mid Left",
        answer: 0,
      },
    ],
  },
  {
    quiz_no: 5,
    question:
      "Which of the below statements is the correct way to annotate Player 8 missing an attempted shot?",
    choice: [
      {
        content: "Wide Shot Player 8",
        answer: 0,
      },
      {
        content: "Shot Wide Player 8",
        answer: 1,
      },
      {
        content: "Player 8 has missed a shot",
        answer: 0,
      },
      {
        content: "Player 8 Shot Wide",
        answer: 0,
      },
    ],
  },
  {
    quiz_no: 6,
    question:
      "When annotating a match, which keyword type must be spoken first?",
    choice: [
      {
        content: "Event",
        answer: 1,
      },
      {
        content: "Outcome",
        answer: 0,
      },
      {
        content: "Position",
        answer: 0,
      },
      {
        content: "Player Number",
        answer: 0,
      },
    ],
  },
  {
    quiz_no: 7,
    question: "In the video above, what was the outcome of the event?",
    video: "./media/TacTalk-Q7.mp4",
    choice: [
      {
        content: "Turnover",
        answer: 1,
      },
      {
        content: "Kick pass",
        answer: 0,
      },
      {
        content: "Hand pass",
        answer: 0,
      },
      {
        content: "Attack 45",
        answer: 0,
      },
    ],
  },
  {
    quiz_no: 8,
    question: "Teams are represented by their colour.",
    choice: [
      {
        content: "True",
        answer: 1,
      },
      {
        content: "False",
        answer: 0,
      },
    ],
  },
  {
    quiz_no: 9,
    question: "Players are represented by their name.",
    choice: [
      {
        content: "True",
        answer: 0,
      },
      {
        content: "False",
        answer: 1,
      },
    ],
  },
  {
    quiz_no: 10,
    question: "In the video above, what was the position of the kickout?",
    video: "./media/TacTalk-Q10.mp4",
    choice: [
      {
        content: "Mid Left",
        answer: 1,
      },
      {
        content: "Mid Centre",
        answer: 0,
      },
      {
        content: "Short Left",
        answer: 0,
      },
      {
        content: "Mid Right",
        answer: 0,
      },
    ],
  },
];

var new_quiz = [];

var answers = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

var current_order = 0;

function startQuiz() {
  for (var i = 0; i < quiz.length; i++) {
    new_quiz.push(quiz[i]);
    new_quiz[i].choice = shuffleArray(quiz[i].choice);
    console.log(quiz[i].quiz_no);
  }
  new_quiz = shuffleArray(new_quiz);
  generateQuestion(new_quiz[0], 0);
}

function generateQuestion(question, order) {
  var quiz_area = document.getElementById("quiz_area");
  quiz_area.innerHTML = "";

  var question_line = document.createElement("div");
  question_line.innerHTML =
    "<br><h2><b>Question " +
    (order + 1) +
    "</b></h2><br><h5>" +
    question.question +
    "</h5><br>";

  if (question.hasOwnProperty("video")) {
    var video_area = document.createElement("div");
    video_area.classList.add("row");
    var video = document.createElement("video");
    video.width = "400";
    video.controls = true;
    video.src = question.video;
    quiz_area.appendChild(video);
  }

  var choice_area = document.createElement("div");
  for (var i = 0; i < question.choice.length; i++) {
    var newButton = document.createElement("button");
    newButton.classList.add("btn");
    newButton.setAttribute(
      "onclick",
      "setAnswer(" + (i + 1) + "," + order + ")"
    );
    newButton.innerHTML = question.choice[i].content;
    newButton.id = "choice_" + (i + 1);
    choice_area.appendChild(newButton);

    if (answers[current_order] === i + 1) {
      newButton.style.backgroundColor = "#2ac87b";
      newButton.style.color = "white";
    }
  }

  quiz_area.appendChild(question_line);
  quiz_area.appendChild(choice_area);
}

function setAnswer(choiceNum, index) {
  answers[index] = choiceNum;
  var buttons = document.getElementById("buttons");

  var finished = true;
  for (var i = 0; i < 10; i++) {
    if (answers[i] === -1) {
      finished = false;
    }
  }

  if (finished) {
    var finishButton = document.createElement("button");
    finishButton.classList.add("btn");
    finishButton.classList.add("btn-success");
    finishButton.innerHTML = "Finish Quiz";
    finishButton.setAttribute("onclick", "getResult()");
    document.getElementById("buttons").appendChild(finishButton);
  }
  generateQuestion(new_quiz[current_order], index);
}

function switchQuestion(index) {
  if (current_order + index >= 0 || current_order + index <= 9) {
    current_order += index;
    generateQuestion(new_quiz[current_order], current_order);
  }
}

function getResult() {
  var quiz_area = document.getElementById("quiz_area");
  var homeButton = document.getElementById("buttons");
  //var homeButton = document.createElement("button");
  quiz_area.innerHTML = "";

  var score = 0;

  for (var i = 0; i < new_quiz.length; i++) {
    if (new_quiz[i].choice[answers[i] - 1].answer === 1) {
      score++;
    }
  }

  quiz_area.innerHTML = "<h2>Your final score is " + score + "/10</h2>";
  homeButton.innerHTML =
    "<a href='index.html' role='button' class='btn btn-success'>Exit Quiz</a>";
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
