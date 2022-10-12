import spaceinvadersConfig from "../spaceinvaders.config";
parseSelectedMode();
import { Engine } from "@babylonjs/core";
import { Environment } from "./Environment";
import State from "./State";
import { DeltaTime } from "./DeltaTime";
import { GameController } from "./GameController";
import { InputController } from "./InputController";
import { Starfield } from "./Starfield";
import { GameAssetsManager } from "./GameAssetsManager";
import { UIText } from "./UIText";
import { MobileInputs } from "./MobileInputs";

const canvas = document.querySelector("canvas");
const engine = new Engine(canvas, true);
const environment = new Environment(engine);

const stars = new Starfield(environment.scene);
const deltaTime = new DeltaTime(environment.scene);
const gameAssets = new GameAssetsManager(environment.scene);
const inputController = new InputController(environment.scene);
const UI = new UIText();
const gameController = new GameController(
  environment,
  inputController,
  gameAssets,
  UI
);

// Set default FPS to 60.
// Low FPS in oldSchoolEffects mode
let lastRenderTime = 0;
let FPS = 60;
if (spaceinvadersConfig.oldSchoolEffects.enabled) FPS = 18;

// my mod
let isPlaying_motherShip = false;
window.resumeRenderLoop = function () {
  resumeSounds();
  // if ( isPlaying_motherShip ) {
  // gameAssets.sounds.motherShip.play();
  // }
};
window.restartGame = function () {
  State.gameOverStep = 3;
  State.state = "RESTARTGAME";
};
window.gamePaused = function () {
  return State.state == "PAUSEGAME" || State.state == "PAUSEGAME2";
};
window.stopMotherShipSound = function () {
  gameAssets.sounds.motherShip.stop();
};

let isPlaying_Sound = {};
window.stopSounds = function () {
  for (const [key, sound] of Object.entries(gameAssets.sounds)) {
    if (key != "clearLevel") {
      isPlaying_Sound[key] = sound.isPlaying;
      if (isPlaying_Sound[key]) {
        sound.stop();
      }
    }
  }
};
window.resumeSounds = function () {
  for (const [key, sound] of Object.entries(gameAssets.sounds)) {
    if (typeof isPlaying_Sound[key] != "undefined" && isPlaying_Sound[key]) {
      sound.play();
    }
  }
};
// my mod

let runGameLoop = function () {
  if (gameAssets.isComplete) {
    switch (State.state) {
      case "LOADING":
        break;
      case "TITLESCREEN":
        gameController.titleScreen();
        break;
      case "STARTGAME":
        Engine.audioEngine.unlock();
        gameController.startGame();
        // my mod
        UI.showPauseButton();
        UI.showFireButton();
        UI.showDirectionButton();
        // my mod
        break;
      case "NEXTLEVEL":
        gameController.nextLevel();
        break;
      case "GAMELOOP":
        gameController.checkStates();
        break;
      case "ALIENSWIN":
        UI.hideFireButton();
        UI.hideDirectionButton();
        gameController.aliensWin();
        break;
      case "CLEARLEVEL":
        gameController.clearLevel();
        break;
      case "GAMEOVER":
        UI.hideFireButton();
        UI.hideDirectionButton();
        gameController.gameOver();
        // my mod
        UI.hidePauseBlock();
        UI.hidePauseButton();
        // my mod
        break;

      // my mod
      case "PAUSEGAME":
        UI.hideFireButton();
        UI.hideDirectionButton();
        State.state = "PAUSEGAME2";
        stopSounds();
        // isPlaying_motherShip = gameAssets.sounds.motherShip.isPlaying;
        // if ( isPlaying_motherShip ) {
        // stopMotherShipSound();
        // }
        return;
        break;
      case "PAUSEGAME2":
        return;
        break;
      case "RESTARTGAME":
        UI.togglePause();
        State.state = "GAMEOVER";
        gameController.gameOver();
        gameController.clearLevel();
        gameController.destroyGameGUI();
        UI.showFireButton();
        UI.showDirectionButton();

        // stopMotherShipSound();
        stopSounds();

        // from GameController gameOver UI.playAgainPressed
        // this.destroyGameGUI();
        // this.UI.hideGameOver();
        // this.UI.hidePlayAgain();
        // this.UI.hideNewHighScore();
        // State.gameOverStep = 3;
        gameAssets.sounds.clearLevel.play();

        return;
        break;
      // my mod

      default:
        // does nothing.
        break;
    }
    // Force a low FPS if required by oldSchoolEffects mode.
    let timeNow = Date.now();
    while (timeNow - lastRenderTime < 1000 / FPS) {
      timeNow = Date.now();
    }
    lastRenderTime = timeNow;
    window.scrollTo(0, 0);
    environment.scene.render();
  }
};
engine.runRenderLoop(runGameLoop);

window.addEventListener("resize", () => {
  engine.resize();
});

function parseSelectedMode() {
  let mode = parseInt(window.localStorage.getItem("mode") ?? 0);
  document.querySelector("body").classList.add("mode" + mode);
  switch (mode) {
    case 0:
      break;
    case 1:
      spaceinvadersConfig.oldSchoolEffects.enabled = true;
      break;
    case 2:
      spaceinvadersConfig.actionCam = true;
      break;
    default:
      break;
  }
}
