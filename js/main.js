'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();

const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

let started = false;
let score = 0;
let timer = undefined;

const popUp = document.querySelector('.pop-up');
const popUpMessage = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('sound/carrot_pull.mp3');
const bugSound = new Audio('sound/bug_pull.mp3');
const alertSound = new Audio('sound/alert.wav');
const bgSound = new Audio('sound/bg.mp3');
const winSound = new Audio('sound/game_win.mp3');

function startGame() {
  started = true;
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
  showPopUpWithText('REPLAY???');
  stopSound(bgSound);
  playSound(alertSound);
}

function finishGame(win) {
  started = false;
  stopGameTimer();
  hideStopButton();
  if (win) {
    showPopUpWithText('You Win!!');
    playSound(winSound);
  } else {
    showPopUpWithText('Game Over ^^~');
    playSound(bugSound);
  }
  stopSound(bgSound);
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const x2 = fieldRect.width;
  const y1 = 0;
  const y2 = fieldRect.height;

  for(let i = 0; i<count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.setAttribute('alt', className);
    const x = randomNumber(x1, (x2 - CARROT_SIZE));
    const y = randomNumber(y1, (y2 - CARROT_SIZE));
    item.style.position = 'absolute';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    
    field.appendChild(item);
  }
}

function initGame() {
  field.innerHTML = '';
  gameScore.innerText = CARROT_COUNT;
  addItem('bug', CARROT_COUNT, 'img/bug.png');
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
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

function showPopUpWithText(text) {
  popUpMessage.innerText = text;
  popUp.classList.remove('hide');
}

function hidePopUp() {
  popUp.classList.add('hide');
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function onFieldClick(event) {
  if(!started) {
    return;
  }
  const target = event.target;
  if(target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScore();
    if(score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if(target.matches('.bug')) {
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

popUpRefresh.addEventListener('click', () => {
  score = 0;
  hidePopUp();
  startGame();
});

field.addEventListener('click', onFieldClick);