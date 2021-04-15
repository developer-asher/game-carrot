'use strict';

const CARROT_SIZE = 80;
const carrotSound = new Audio('sound/carrot_pull.mp3');

export default class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener('click', (event) => this.onClick(event));
  }

  init() {
    this.field.innerHTML = '';
    this._addItem('bug', this.carrotCount, 'img/bug.png');
    this._addItem('carrot', this.bugCount, 'img/carrot.png');
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem(className, count, imgPath) {
    const x1 = 0;
    const x2 = this.fieldRect.width;
    const y1 = 0;
    const y2 = this.fieldRect.height;
  
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
      
      this.field.appendChild(item);
    }
  }

  onClick(event) {
    const target = event.target;
    const popUp = document.querySelector('.pop-up');
    
    if(target.matches('.carrot')) {
      if(!popUp.classList.contains('hide')) {
        return;
      }
      target.remove();
      playSound(carrotSound);
      this.onItemClick && this.onItemClick('carrot');
    } else if(target.matches('.bug')) {
      this.onItemClick && this.onItemClick('bug');
    }
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}