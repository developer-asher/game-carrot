'use strict';
import Field from './field.js';
import * as sound from './sound.js';

const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount,
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(this.carrotCount, this.bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.timer = undefined;
    this.score = 0;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === 'carrot') {
      this.score++;
      this.updateScore();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === 'bug') {
      this.stop(Reason.lose);
    }
  };

  start() {
    this.started = true;
    this.score = 0;
    this.initGame();
    this.showAndHideButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }

  stop(reason) {
    this.started = false;
    this.showAndHideButton();
    this.stopGameTimer();
    sound.stopBackground();

    this.onGameStop && this.onGameStop(reason);
  }

  initGame() {
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }

  showAndHideButton() {
    const icon = this.gameBtn.querySelector('.fas');
    const ICON_PLAY = 'fa-play';
    const ICON_STOP = 'fa-stop';

    if (icon.classList.contains(ICON_PLAY)) {
      icon.classList.add(ICON_STOP);
      icon.classList.remove(ICON_PLAY);
      this.gameBtn.style.visibility = 'visible';
    } else if (icon.classList.contains(ICON_STOP)) {
      icon.classList.add(ICON_PLAY);
      icon.classList.remove(ICON_STOP);
      this.gameBtn.style.visibility = 'hidden';
    }
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  updateScore() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    this.gameTimer.innerText = '';
    this.gameTimer.innerText = `${minutes >= 10 ? minutes : `0${minutes}`}:${
      seconds >= 10 ? seconds : `0${seconds}`
    }`;
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;

    this.updateTimerText(remainingTimeSec);

    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }
}

export { GameBuilder, Reason };
