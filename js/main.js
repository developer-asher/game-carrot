'use strict';
import PopUp from './popup.js';
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
      break;
    case 'win':
      message = 'You win !! : )';
      break;
    case 'lose':
      message = 'You Lost ~ ^^';
      break;
    default:
      throw new Error('not valid reason');
  }

  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickLisenter(() => {
  game.start();
});
