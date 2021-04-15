'use strict';
import PopUp from './popup.js';
import Field from './field.js';

const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const gameFinishBanner = new PopUp();
const gameField = new Field(CARROT_COUNT, BUG_COUNT);

let started = false;
let score = 0;
let timer = undefined;

const carrotSound = new Audio('sound/carrot_pull.mp3');
const bugSound = new Audio('sound/bug_pull.mp3');
const alertSound = new Audio('sound/alert.wav');
const bgSound = new Audio('sound/bg.mp3');
const winSound = new Audio('sound/game_win.mp3');

function startGame() {
  started = true;
  score = 0;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  hideStopButton();
  stopGameTimer();
  gameFinishBanner.showWithText('REPLAY???');
  stopSound(bgSound);
  playSound(alertSound);
}

function finishGame(win) {
  started = false;
  stopGameTimer();
  hideStopButton();
  if (win) {
    gameFinishBanner.showWithText('You Win!!');
    playSound(winSound);
  } else {
    gameFinishBanner.showWithText('Game Over ^^~');
    playSound(bugSound);
  }
  stopSound(bgSound);
}

function initGame() {
  gameScore.innerText = CARROT_COUNT;
  gameField.init();
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fa-play');

  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

function hideStopButton() {
  const icon = gameBtn.querySelector('.fa-stop');

  icon.classList.add('fa-play');
  icon.classList.remove('fa-stop');

  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function updateScore() {
  gameScore.innerText = CARROT_COUNT - score ;
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  
  gameTimer.innerText = '';
  gameTimer.innerText = `${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}`;
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;

  updateTimerText(remainingTimeSec);

  timer = setInterval(() => {
    if(remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function onItemClick(item) {
  if(!started) {
    return;
  }
  if(item === 'carrot') {
    score++;
    updateScore();
    if(score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if(item === 'bug') {
    finishGame(false);
  }
}

gameBtn.addEventListener('click', () => {
  if(started) {
    stopGame();
  } else {
    startGame();
  }
});

// field.addEventListener('click', onFieldClick);
gameField.setClickListener(onItemClick);

gameFinishBanner.setClickLisenter(() => {
  startGame();
});