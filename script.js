// list of player names to manually set
const names = ["joey", "vikas", "esther", "gerry"];

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

while(playerList.length - names.length > 0) {
  playerList.pop();
}

// question database
const questionList = [
  {
    question: "Name an ultimate ability from League of Legends",
    wrong: "Shadow Flare",
    correct: ["Unbreakable Will", "Voice of Light", "Glacial Fissure", "Hextech Ultimatum", "Last Caress", "Cataclysm"],
  },
  {
    question: "Name a video game released for the Nintendo Wii",
    wrong: "LSD: Dream Emulator",
    correct: ["Call of Duty: Black Ops", "Wii Chess", "Enjoy your Massage!", "Anubis 2", "Alvin and the Chipmunks", "Dragonball Z Budokai Tenkaichi 3"],
  },
  {
    question: "Name a United States involvement with regime change",
    wrong: "Madagascar",
    correct: ["South Korea", "Iran", "Indonesia", "Nicaragua", "Laos", "Brazil"],
  },
  {
    question: "Name a former president of the Philippines",
    wrong: "Yingluck Shinawatra",
    correct: ["Emilio Aguinaldo", "Manuel L. Quezon", "Jose P. Laurel", "Sergio Osmeña", "Manuel Roxas", "Ramon Magsaysay"],
  },
  {
    question: "Name a Taylor Switft Song",
    wrong: "Bestie",
    correct: ["Better Than Revenge", "Ivy", "Change", "Betty", "Starlight", "Long Story Short"],
  },
  {
    question: "Name a dog breed",
    wrong: "Moroccan Griffon",
    correct: ["Basset Hound", "Australian Shepherd", "Maltipoo", "Chow Chow", "Afghan Hound", "Portuguese Water Dog"],
  },
  {
    question: "Name one of the Apostles in the New Testament",
    wrong: "Joseph",
    correct: ["Bartholomew", "James", "Philip", "Matthew", "Andrew", "Simon"],
  },
  {
    question: "Name a word invented by Shakespeare",
    wrong: "Weary",
    correct: ["Skim-milk", "Swagger", "Unaware", "Undress", "Critic", "Lonely"],
  },
  {
    question: "Name an anime",
    wrong: "Watashi no Oshiri ga Ookii!",
    correct: ["Gintama", "Clannad", "Owarimonogatari", "Monster", "Sen to Chihiro no Kamikakushi", "Berserk"],
  },
  {
    question: "Name a romanized line from Gangnam Style",
    wrong: "allanggamolla wae hwakkeunhaeya haneungeonji",
    correct: ["naneun mwol jom aneun nom", "jeongsukhae boijiman nol ttaen noneun yeoja", "ttaega doemyeon wanjeon michyeobeorineun sanai", "ttwineun nom geu wie naneun nom", "kopi hanjanui yeoyureul aneun pumgyeok inneun yeoja", "areumdawo sarangseureowo"],
  },
  {
    question: "Name a character from The Office",
    wrong: "Paul Keaton",
    correct: ["Holly Flax", "David Wallace", "Darryl Philbin", "Jan Levinson", "Karen Filippelli", "Hidetoshi Hasagawa"],
  },
  {
    question: "Name an AP course or exam offered by CollegeBoard",
    wrong: "AP Veterinary Science",
    correct: ["AP Art History", "AP Comparative Government and Politics", "AP Music Theory", "AP Latin", "AP Physics C: Mechanics", "Studio Art: 3-D Design"],
  },
  {
    question: "Name a territory that gained independence from the United Kingdom",
    wrong: "Ethiopia",
    correct: ["Myanmar", "Fiji", "Zanzibar", "Malaya", "Iraq", "Egypt"],
  },
  {
    question: "Name an Asian",
    wrong: "Robert E. Lee",
    correct: ["Elaine Chao", "Zach King", "Roger H. Chen", "Perry Chen", "Ellen Pao", "Ken Jeong"],
  }
];
let ansChoices, playerIcons, answerer, incorrect, explode, main, win, wintext;
let currentQuestion = 0;
const boom = new Howl({
  src: ['boom.mp3']
});
const ding = new Howl({
  src: ['correct.mp3']
});
const clap = new Howl({
  src: ['clap.mp3']
});

// setup and html elements 
function loadElements() {
  playerIcons = document.querySelectorAll(".player");
  ansChoices = document.querySelectorAll(".opt");
  explode = document.getElementById("explode");
  main = document.getElementById("main");
  win = document.getElementById("win");
  wintext = document.getElementById("wintext");

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
      if(i != incorrect && answerer != -1 && ansChoices[i].style.backgroundColor != "rgb(210, 255, 204)") {
        updateAns("#d2ffcc", "#dbdbdb");
        playerList[answerer].answered = true;
        ding.play();
        ansNxt();
      } else if (i == incorrect) {
        // shows death on first click, moves on for second
        if(ansChoices[i].style.color != "white") {
          updateAns("red", "white");
          if (answerer != -1) {
            playerList[answerer].alive = false;
            playerList[answerer].explode = true;
            explode.style.display = "block";
            boom.play();
            setTimeout(() => {explode.style.display = "none";}, 1500);
          } 
          // prevent choosing new answerer
          answerer = -1;
        } else {
          currentQuestion++;
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
  document.getElementById("progress").innerHTML = `Question ${currentQuestion+1}`;
  document.getElementById("qstn").innerHTML = questionList[currentQuestion].question;

  // checks playerList to count alive players and resets answered 
  let numAlive = 0;
  let winner;
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

  // selects random slot for incorrect answer to be in 
  incorrect = Math.floor(Math.random() * (numAlive + 1));

  ansNxt();
  updatePlayers();

  // sets up answer colors and click events
  for (let i = 0; i < ansChoices.length; i++) {
    // makes extra buttons invisible
    ansChoices[i].style.display = "none";
  }

  let array = questionList[currentQuestion].correct;
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  // MEOW: clean this code up. methods??
  // set answer text, show needed buttons
  ansChoices[incorrect].innerHTML = questionList[currentQuestion].wrong;
  ansChoices[incorrect].style.display = "block";
  ansChoices[incorrect].style.backgroundColor = "LightGoldenrodYellow";
  ansChoices[incorrect].style.color = "black"; 
  for (let i = 0; i < numAlive; i++) {
    if(i >= incorrect) {
      ansChoices[+i+1].innerHTML = questionList[currentQuestion].correct[i];
      ansChoices[+i+1].style.display = "block";
      ansChoices[i+1].style.backgroundColor = "LightGoldenrodYellow";
      ansChoices[i+1].style.color = "black";
    } else {
      ansChoices[i].innerHTML = questionList[currentQuestion].correct[i];
      ansChoices[i].style.display = "block";
      ansChoices[i].style.backgroundColor = "LightGoldenrodYellow";
      ansChoices[i].style.color = "black";
    }
  }
}

// updates player icons 
function updatePlayers() {
  for (let i in playerList) {
    let c = playerList[i];
    
    // icon update function
    const iconupdt = (e, bg, tc) => {
      playerIcons[i].innerHTML = `${c.name} ${e}`;
      playerIcons[i].style.backgroundColor = bg;
      playerIcons[i].style.color = tc;
    }
    
    // updates player icon colors
    if(c.explode) {
      iconupdt("💥", "black", "white");
    } else if(i == answerer) {
      iconupdt("🤔", "#ffd642", "black");
    } else if(c.answered) {
      iconupdt("😃", "#aeffa3", "black");
    } else if(c.alive) {
      iconupdt("😐", "#dbdbdb", "black");
    } else if(c.redemption ) {
      iconupdt("👻", "#ededed", "#808080");
    } else {
      iconupdt("💀", "#f0f0f0", "#dbdbdb");
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