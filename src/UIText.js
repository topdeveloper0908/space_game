import State from "./State";

export class UIText {
  playAgainPressed = false;
  randNum = Math.floor(Math.random() * 10);
  gameHints = [
    "You start with a number of lives but if invaders get past you, it's game over.",
    "By 1982, Space Invaders was the highest-grossing entertainment product at the time.",
    "Alien formations get stronger, larger and more aggressive with each level.",
    'British paper, The Times, ranked Space Invaders No. 1 on its list of "The ten most influential video games ever".',
    "Destroy motherships for a huge score bonus.",
    "Tomohiro Nishikado developed Space Invaders in 1978. His name was never put on the game for contractual reasons.",
  ];

  constructor() {
    this.startButtonInit();
    this.modeSelectorInit();
    // my mod:
    this.pauseButtonsInit();
    // my mod:
  }

  startButtonInit() {
    document.getElementById("start-game").addEventListener("click", (el) => {
      this.startButtonClick();
    });
  }

  // my mod:
  pauseButtonsInit() {
    document.getElementById("pause-game").addEventListener("click", (el) => {
      this.pauseButtonClick();
    });
    document.getElementById("resume-game").addEventListener("click", (el) => {
      this.resumeButtonClick();
      this.showFireButton();
      this.showDirectionButton();
    });
    document.getElementById("restart-game").addEventListener("click", (el) => {
      this.restartButtonClick();
    });
    window.addEventListener("keyup", (key) => {
      key.preventDefault();
      key.stopPropagation();
      let keyPressed = key.key;
      if (key.key === "p") {
        this.pauseButtonClick();
      } else if (key.key === "r") {
        this.resumeButtonClick();
      } else if (key.key === "n") {
        this.restartButtonClick();
      }
    });
  }

  togglePause() {
    if (State.last_state == "") {
      State.last_state = State.state;
      State.state = "PAUSEGAME";
      this.pauseGame();
    } else {
      State.state = State.last_state;
      State.last_state = "";
    }
  }

  pauseButtonClick() {
    if (State.state != "GAMELOOP") {
      return;
    }
    this.togglePause();
  }

  resumeButtonClick() {
    if (State.state != "PAUSEGAME" && State.state != "PAUSEGAME2") {
      return;
    }
    resumeRenderLoop();
    this.togglePause();
    this.hidePauseBlock();
  }

  restartButtonClick() {
    if (State.state == "GAMEOVER") {
      let UI = document.querySelector("#panel-play-again");
      UI.click();
      return;
    }

    if (State.state != "PAUSEGAME" && State.state != "PAUSEGAME2") {
      return;
    }
    restartGame();
    // this.togglePause()
    this.hidePauseBlock();
  }

  showFireButton() {
    let pauseUI = document.getElementById("fire-bullet");
    pauseUI.classList.add("active");
  }
  hideFireButton() {
    let pauseUI = document.getElementById("fire-bullet");
    pauseUI.classList.remove("active");
  }

  // Direction Button
  hideDirectionButton() {
    let pauseUILeft = document.getElementById("ship-left");
    let pauseUIRight = document.getElementById("ship-right");
    pauseUILeft.classList.remove("active");
    pauseUIRight.classList.remove("active");
  }
  showDirectionButton() {
    let pauseUILeft = document.getElementById("ship-left");
    let pauseUIRight = document.getElementById("ship-right");
    pauseUILeft.classList.add("active");
    pauseUIRight.classList.add("active");
  }
  pauseGame() {
    this.hideFireButton();
    this.hideDirectionButton();
    let pauseUI = document.getElementById("game-pause-ui");
    pauseUI.classList.add("active");
  }
  showPauseButton() {
    let pauseUI = document.getElementById("pause-game");
    pauseUI.classList.add("active");
  }
  hidePauseButton() {
    let pauseUI = document.getElementById("pause-game");
    pauseUI.classList.remove("active");
  }
  hidePauseBlock() {
    let pauseUI = document.getElementById("game-pause-ui");
    pauseUI.classList.remove("active");
  }
  // my mod:

  modeSelectorInit() {
    let selector = document.getElementById("change-mode");
    let mode = parseInt(window.localStorage.getItem("mode") ?? 0);
    selector.getElementsByTagName("option")[mode].selected = true;

    selector.onchange = function (el) {
      window.localStorage.setItem("mode", selector.value);
      location.reload();
    };
  }

  startButtonClick(el) {
    this.hideTitleScreen();
    State.state = "STARTGAME";
  }

  enable() {
    let UI = document.querySelector("#ui");
    UI.classList.add("active");
  }

  disable() {
    let UI = document.querySelector("#ui");
    UI.classList.remove("active");
  }

  showGameUI() {
    this.enable();
    let UI = document.querySelector("#game-ui");
    UI.classList.add("active");
  }

  hideGameUI() {
    let UI = document.querySelector("#game-ui");
    UI.classList.remove("active");
  }

  showGameOver() {
    this.hideFireButton();
    this.hideDirectionButton();
    this.enable();
    let UI = document.querySelector("#panel-game-over");
    UI.classList.add("active");
  }

  hideGameOver() {
    let UI = document.querySelector("#panel-game-over");
    UI.classList.remove("active");
  }

  showGameHints() {
    this.hideFireButton();
    this.hideDirectionButton();
    this.newGameHint();
    this.enable();
    let UI = document.querySelector("#panel-game-hints");
    UI.classList.add("active");
  }

  hideGameHints() {
    let UI = document.querySelector("#panel-game-hints");
    UI.classList.remove("active");
    this.showFireButton();
  }

  newGameHint() {
    let i = (this.randNum + State.level) % this.gameHints.length;
    document.querySelector("#panel-game-hints .value").innerHTML =
      this.gameHints[i];
  }

  showPlayAgain() {
    let UI = document.querySelector("#panel-play-again");
    UI.classList.add("active");
    UI.onclick = () => {
      this.playAgainPressed = true;
    };
  }

  hidePlayAgain() {
    let UI = document.querySelector("#panel-play-again");
    UI.classList.remove("active");
    this.playAgainPressed = false;
  }

  showNewHighScore() {
    this.enable();
    document.querySelector("#panel-new-highscore .value").innerHTML =
      window.localStorage.getItem("highScore");
    let UI = document.querySelector("#panel-new-highscore");
    UI.classList.add("active");
  }

  hideNewHighScore() {
    let UI = document.querySelector("#panel-new-highscore");
    UI.classList.remove("active");
  }

  showTitleScreen() {
    this.enable();
    let UI = document.querySelector("#title-screen");
    UI.classList.add("active");
    let buttons = document.querySelector("#intro");
    buttons.classList.add("active");
  }

  hideTitleScreen() {
    let UI = document.querySelector("#title-screen");
    UI.classList.remove("active");
    let buttons = document.querySelector("#intro");
    buttons.classList.remove("active");
  }

  hideLoadingScreen() {
    let loading = document.querySelector("#loading");
    loading.classList.remove("active");
  }
}
