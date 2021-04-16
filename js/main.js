'use strict';
import PopUp from './popup.js';
import * as sound from './sound.js';
import { GameBuilder, Reason } from './game.js';

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .withGameDuration(10)
  .withCarrotCount(10)
  .withBugCount(10)
  .build();

game.setGameStopListener((reason) => {
  let message;

  switch (reason) {
    case 'cancel':
      message = 'Replay??';
      sound.playAlert();
      break;
    case 'win':
      message = 'You win !! : )';
      sound.playWin();
      break;
    case 'lose':
      message = 'You Lost ~ ^^';
      sound.playBug();
      break;
    default:
      throw new Error('not valid reason');
  }

  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickLisenter(() => {
  game.start();
});
