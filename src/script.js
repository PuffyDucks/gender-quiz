// player data
const playerList = [
  {
    name: "",
    alive: true,
    redemption: false,
    answered: false,
    explode:false
  },
  {
    name: "",
    alive: true,
    redemption: false,
    answered: false,
    explode:false
  },
  {
    name: "",
    alive: true,
    redemption: false,
    answered: false,
    explode:false
  },
  {
    name: "",
    alive: true,
    redemption: false,
    answered: false,
    explode:false
  },
  {
    name: "",
    alive: true,
    redemption: false,
    answered: false,
    explode:false
  },
  {
    name: "",
    alive: true,
    redemption: false,
    answered: false,
    explode:false
  }
];

// question database
var questionList;

// list of player names to manually set
var names;

let playerIcons, ansChoices, explode, main, win, wintext;
let answerer, inc, end, pressed;
let qtsn = 0;

const boom = new Howl({
  src: ['media/boom.mp3']
});
const correct = new Howl({
  src: ['media/correct.mp3']
});
const clap = new Howl({
  src: ['media/clap.mp3']
});

// setup and html elements 
function loadElements() {
  playerIcons = document.querySelectorAll(".player");
  ansChoices = document.querySelectorAll(".opt");
  explode = document.getElementById("explode");
  main = document.getElementById("main");
  win = document.getElementById("win");
  wintext = document.getElementById("wintext");

  end = false;
  pressed = [0, 0, 0, 0, 0, 0, 0];

  while(playerList.length - names.length > 0) {
    playerList.pop();
  }

  // set up player icons
  for (let i in playerList) {
    playerList[i].name = names[i];
    playerIcons[i].style.display = "inline";
    playerIcons[i].addEventListener('click', () => {
      let h = playerList[i];
      if(!h.alive && !h.redemption) {
        h.redemption = true;
      } else if(!h.alive && h.redemption){
        h.alive = true;
        h.redemption = false;
      }
      updatePlayers();
    });
  }

  // sets up answer colors and click events
  for (let i = 0; i < ansChoices.length; i++) {
    // changes button color
    const updateAns = (bg, tc) => {
      ansChoices[i].style.backgroundColor = bg;
      ansChoices[i].style.color = tc;
    }

    // checks if answer was right, runs click events
    ansChoices[i].addEventListener('click', () => {
      if(i != inc && answerer != -1 && pressed[i] == 0) {
        updateAns("#755d73", "#8c7b8b");
        pressed[i] = 1;
        playerList[answerer].answered = true;
        correct.play();
        ansNxt();
      } else if (i == inc) {
        // shows death on first click, moves on for second
        if(!end) {
          end = true;
          updateAns("#42ceeb", "white");
          if (answerer != -1) {
            updateAns("rgb(22, 0, 64)", "white");
            playerList[answerer].alive = false;
            playerList[answerer].explode = true;
            explode.style.display = "block";
            boom.play();
            setTimeout(() => {explode.style.display = "none";}, 1500);
          } 
          // prevent choosing new answerer
          answerer = -1;
        } else {
          qtsn++;
          loadQuestion();
        }
      }
      updatePlayers();
    });
  }

  loadQuestion();
}

function loadQuestion() {
  // updates question text
  document.getElementById("progress").innerHTML = `Question ${qtsn+1}`;
  document.getElementById("qstn").innerHTML = questionList[qtsn].question;

  // checks playerList to count alive players and resets answered 
  let numAlive = 0;
  let winner;
  end = false;
  pressed = [0, 0, 0, 0, 0, 0, 0];
  
  for (let i in playerList) {
    if (playerList[i].alive){
      numAlive++;
      winner = playerList[i].name;
    }
    playerList[i].answered = false;
    playerList[i].explode = false; 
  }

  if (numAlive == 1) {
    congrats(winner);
  }

  // selects random slot for inc answer to be in 
  inc = Math.floor(Math.random() * (numAlive + 1));

  ansNxt();
  updatePlayers();

  // sets up answer colors and click events
  for (let i = 0; i < ansChoices.length; i++) {
    // makes extra buttons invisible
    ansChoices[i].style.display = "none";
  }

  let array = questionList[qtsn].correct;
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  // set answer text, show needed buttons
  const ansUpdt = (j, d) => {
    ansChoices[j].innerHTML = d;
    ansChoices[j].style.display = "inline";
    ansChoices[j].style.backgroundColor = "#e0007b";
    ansChoices[j].style.color = "white";
  }
  ansUpdt(inc, questionList[qtsn].wrong);
  for (let i = 0; i < numAlive; i++) {
    if(i >= inc) {
      ansUpdt(+i+1, questionList[qtsn].correct[i]);
    } else {
      ansUpdt(i, questionList[qtsn].correct[i]);
    }
  }
}

// updates player icons 
function updatePlayers() {
  for (let i in playerList) {
    let c = playerList[i];
    
    // icon update function
    const iconUpdt = (e, bg, tc) => {
      playerIcons[i].innerHTML = `${c.name} ${e}`;
      playerIcons[i].style.backgroundColor = bg;
      playerIcons[i].style.color = tc;
    }
    
    // updates player icon colors
    if(i == answerer) {
      iconUpdt("🤔", "#ffd129", "#1c1c21");
    } else if(c.redemption) {
      iconUpdt("👻", "#84849c", "#ededed");
    } else if(c.answered) {
      iconUpdt("😃", "#7ff76f", "#1c1c21");
    } else if(c.alive) {
      iconUpdt("😐", "#dbdbdb", "#1c1c21");
    } else if(c.explode) {
      iconUpdt("💥", "#110030", "white");
    } else {
      iconUpdt("💀", "#77778c", "#dbdbdb");
    }
  }
}

// selects player to answer next
function ansNxt() {
  // makes sure new answerer can be found 
  let avbl = false;
  for(let i in playerList) {
    if (playerList[i].alive && !playerList[i].answered) {
      avbl = true;
    }
  }
  if (!avbl) {
    answerer = -1;
  }
  
  if(avbl) {
    let found = false;
    while (!found) {
      answerer = Math.floor(Math.random() * (names.length));
      // checks if chosen answerer is eligible
      if(!playerList[answerer].answered && playerList[answerer].alive) {
        found = true;
      }
    }
  }
};

function congrats(t) {
  clap.play();
  main.style.display = "none";
  win.style.display = "block";
  wintext.style.display = "block";
  wintext.innerHTML = `good job ${t}`;
}