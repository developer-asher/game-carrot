'use strict';

export default class PopUp {
  constructor() {  
    this.popUp = document.querySelector('.pop-up');
    this.popUpMessage = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__refresh');
    this.popUpRefresh.addEventListener('click', () => {
      if(this.onClick) this.onClick();
      this.hide();
    });
  }
  
  setClickLisenter(onClick) {
    this.onClick = onClick;
  }

  showWithText(text) {
    this.popUpMessage.innerText = text;
    this.popUp.classList.remove('hide');
  }

  hide() {
    this.popUp.classList.add('hide');
  }
}