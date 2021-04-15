'use strict';
import PopUp from './popup.js';
import Field from './field.js';
import * as sound from './sound.js';

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

function startGame() {
  started = true;
  score = 0;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  sound.playBackground();
}

function stopGame() {
  started = false;
  hideStopButton();
  stopGameTimer();
  gameFinishBanner.showWithText('REPLAY???');
  sound.stopBackground();
  sound.playAlert();
}

function finishGame(win) {
  started = false;
  stopGameTimer();
  hideStopButton();
  if (win) {
    gameFinishBanner.showWithText('You Win!!');
    sound.playWin();
  } else {
    gameFinishBanner.showWithText('Game Over ^^~');
    sound.playBug();
  }
  sound.stopBackground();
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