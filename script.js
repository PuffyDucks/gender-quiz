// initialize text elements and declare questions

const btncolor = "#FFFFFF"
const selectcolor = "#E6E6E6";

let progressText, questionText, firstButton, secondButton, currentQuestion, backButton, submitButton;
const questionList = [
  {
    question: "Do you like flowers?",
    answerA: "Yup, I love them",
    answerB: "Nah, not for me",
    choice: 0
  },
  {
    question: "How frequently do you clean the house?",
    answerA: "Very often",
    answerB: "Rarely",
    choice: 0
  },
  {
    question: "How often do you cry?",
    answerA: "All the time",
    answerB: "Not that much",
    choice: 0
  },
  {
    question: "Do you enjoy playing video games?",
    answerA: "Yeah, they're fun",
    answerB: "No, not really",
    choice: 0
  },
  {
    question: "Do you like (or want) to wear skirts?",
    answerA: "Yes",
    answerB: "No",
    choice: 0
  },
  {
    question: "Pick a color.",
    answerA: "Blue",
    answerB: "Pink",
    choice: 0
  },
  {
    question: "How would you rather spend your weekend?",
    answerA: "Going shopping",
    answerB: "Investing money",
    choice: 0
  },
  {
    question: "Do you enjoy playing sports?",
    answerA: "Heck yeah",
    answerB: "No thank you",
    choice: 0
  },
  {
    question: "Which cooking activity sounds more fun?",
    answerA: "Baking brownies",
    answerB: "Grilling burgers",
    choice: 0
  },
  {
    question: "Cats or dogs?",
    answerA: "Cats",
    answerB: "Dogs",
    choice: 0
  }
];

// declare page elements as variables and set up button clicks
function loadElements() {
  progressText = document.getElementById("progress");
  questionText = document.getElementById("qstn");
  answerA = document.getElementById("optA");
  answerB = document.getElementById("optB");
  backButton = document.getElementById("back");
  submitButton = document.getElementById("submit");

  answerA.addEventListener('click', pressA);
  answerB.addEventListener('click', pressB);
  backButton.addEventListener('click', goBack);

  // load first question
  currentQuestion = 1;
  loadQuestion();
}

function pressA() {
  questionList[currentQuestion-1].choice = 1;
  currentQuestion++;
  loadQuestion();
}

function pressB() {
  questionList[currentQuestion-1].choice = 2;
  currentQuestion++;
  loadQuestion();
}

// loads previous question
function goBack() {
  currentQuestion--;
  loadQuestion();
}

function loadQuestion() {
  // makes sure question stays in bounds
  if(currentQuestion < 1) {
    currentQuestion = 1;
  } else if (currentQuestion > questionList.length) {
    currentQuestion = questionList.length;
    submitButton.setAttribute("onClick", "window.location.href='calculate.html'");
    submitButton.style.color = "#000000";
    submitButton.style.backgroundColor = "#7bed83";
  } 

  if(currentQuestion == 1) {
    backButton.style.backgroundColor = "#A1AEC2";
    backButton.style.color = "#768394";
  } else {
    backButton.style.backgroundColor = "#A9CBFF";
    backButton.style.color = "#000000";
  }

  // switches text to match new question
  let questionData = questionList[currentQuestion-1];
  progressText.innerHTML = `Question ${currentQuestion} of ${questionList.length}`;
  questionText.innerHTML = questionData.question;
  answerA.innerHTML = questionData.answerA;
  answerB.innerHTML = questionData.answerB;

  answerA.style.backgroundColor = btncolor;
  answerB.style.backgroundColor = btncolor;
  if(questionData.choice == 1) {
    answerA.style.backgroundColor = selectcolor;
  } else if(questionData.choice == 2) {
    answerB.style.backgroundColor = selectcolor;
  }
}