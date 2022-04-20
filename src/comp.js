// player data
const playerList = [];

// button arrays
let playerIcons, ansChoices;

// variables
let answerer, inc, pressed;
let qtsn = 0;

// sounds
const boom = new Howl({src: ['media/boom.mp3']});
const fart = new Howl({src: ['media/fart.mp3']});
const correct = new Howl({src: ['media/correct.mp3']});
const clap = new Howl({src: ['media/clap.mp3']});

// on page load
function loadElements() {
  playerIcons = document.querySelectorAll(".player");
  ansChoices = document.querySelectorAll(".opt");

  // set up playerdata
  for(let i in names) {
    playerList.push({
      name: "",
      answered: false,
      alive: true,
      redemption: false,
      explode: false
    })
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

  // set up answer colors and click events
  for (let i = 0; i < ansChoices.length; i++) {
    // checks if answer was right, runs click events
    ansChoices[i].addEventListener('click', () => {
      if(i != inc && answerer != -1 && pressed[i] == 1) {
        ansChoices[i].style.backgroundColor = "#755d73";
        ansChoices[i].style.color = "#8c7b8b";
        pressed[i] = 0;
        playerList[answerer].answered = true;
        correct.play();
        ansNxt();
      } else if (i == inc) {
        // shows death on first click, moves on for second
        if(answerer != -1) {
          ansChoices[i].style.backgroundColor = "#160040";
          ansChoices[i].style.color = "#ffffff";
          playerList[answerer].explode = true;
          playerList[answerer].alive = false;
          document.getElementById("explode").style.display = "block";
          boom.play();
          setTimeout(() => {document.getElementById("explode").style.display = "none";}, 1500); 
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

  // resets  
  let numAlive = 0;
  let winner;
  pressed = [1, 1, 1, 1, 1, 1, 1];
  
  // checks playerList to count alive players 
  for (let i in playerList) {
    if (playerList[i].alive){
      numAlive++;
      winner = playerList[i].name;
    }
    playerList[i].answered = false;
    playerList[i].explode = false; 
  }

  // checks if game over
  if (numAlive == 1) {
    congrats(winner);
  }

  // selects random slot for inc answer to be in 
  inc = Math.floor(Math.random() * (numAlive + 1));

  ansNxt();
  updatePlayers();

  // makes extra buttons invisible
  for (let i = 0; i < ansChoices.length; i++) {
    ansChoices[i].style.display = "none";
  }

  // randomize answer order
  let array = questionList[qtsn].correct;
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  // set answer text, show needed buttons
  const ansRst = (j, d) => {
    ansChoices[j].innerHTML = d;
    ansChoices[j].style.display = "inline";
    ansChoices[j].style.backgroundColor = "#e0007b";
    ansChoices[j].style.color = "white";
  }
  ansRst(inc, questionList[qtsn].wrong);
  for (let i = 0; i < numAlive; i++) {
    if(i >= inc) {
      ansRst(+i+1, questionList[qtsn].correct[i]);
    } else {
      ansRst(i, questionList[qtsn].correct[i]);
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
  
  if(avbl) {
    let found = false;
    while (!found) {
      answerer = Math.floor(Math.random() * (names.length));
      // checks if chosen answerer is eligible
      if(!playerList[answerer].answered && playerList[answerer].alive) {
        found = true;
      }
    }
  } else {
    answerer = -1;
    ansChoices[inc].style.backgroundColor = "#42ceeb";
    ansChoices[inc].style.color = "white";
  }
};

function congrats(t) {
  clap.play();
  document.getElementById("main").style.display = "none";
  document.getElementById("win").style.display = "block";
  document.getElementById("wintext").style.display = "block";
  document.getElementById("wintext").innerHTML = `congrats ${t}`;
}