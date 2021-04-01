const playIcon = document.querySelector('.btn_play>i');
const field = document.querySelector('.field');
const replayWrap = document.querySelector('.replay_wrap');

const counter = document.querySelector('.counter');
const carrot_num = 7;
let changeTime = null;

function createPopUpBox(state, sentence) {
  replayWrap.innerHTML = `
    <button class='btn_${state}'>
      <i class="fas fa-redo-alt"></i>
    </button>
    <p>
      ${sentence}
    </p>
  `;
  replayWrap.classList.add('on');
}

function completeGame() {
  if(replayWrap.classList.contains('on')) {
    return;
  }

  const countCarrots = field.querySelectorAll('img[data-img="carrot"]').length;

  counter.innerText = `${countCarrots}`;

  if(countCarrots === 0) {
    createPopUpBox('win', 'You win!');
    clearInterval(changeTime);
    playIcon.setAttribute('class', 'fas fa-play');
  }
}

function handleGame(e) {
  if(replayWrap.classList.contains('on')) {
    return;
  }

  const clickedTarget = e.target;

  if(clickedTarget.alt === 'bug') {
    createPopUpBox('lose', 'Game Over!');
    clearInterval(changeTime);
    playIcon.setAttribute('class', 'fas fa-play');
  } else {
    clickedTarget.remove();
    completeGame();
  }
}

function randomPosition(max, min) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function createBugCarrot() {
  if(field.childNodes.length !== 0) {
    return;
  }

  for(let i = 0; i < carrot_num; i++) {
    field.innerHTML += `
      <img src='img/bug.png' alt='bug' style='left:${randomPosition(10, 90)}%; top:${randomPosition(55, 90)}%;' data-img='bug' />
      <img src='img/carrot.png' alt='carrot' style='left:${randomPosition(10, 90)}%; top:${randomPosition(55, 90)}%;' data-img='carrot' />
    `;
  }

  field.addEventListener('click', (e) => handleGame(e));
}

function handleMainPlay(e) {
  if(replayWrap.classList.contains('on')) {
    return;
  }
  counter.innerText = carrot_num;

  if(playIcon.classList.contains('on') && !replayWrap.classList.contains('on')) {
    playIcon.setAttribute('class', 'fas fa-play');
    clearInterval(changeTime);
    createPopUpBox('replay', 'Replay?');
  } else if (!playIcon.classList.contains('on') && !replayWrap.classList.contains('on')){
    playIcon.setAttribute('class', 'fas fa-pause on');
  }
}

function handleReplay(e) {
  field.innerHTML = '';
  createBugCarrot();
  playIcon.setAttribute('class', 'fas fa-pause on');
  replayWrap.classList.remove('on')
  counter.innerText = carrot_num;
  playTimer();
}

function playTimer() {
  if(replayWrap.classList.contains('on')) {
    return;
  }

  const timer = document.querySelector('.timer'); 
  let i = 1;

  timer.innerText = `00:10`;
  changeTime = setInterval(function() {
    if(i > 10) return;
    timer.innerText = `00:0${10 - i}`;
    i++;
  }, 1000);
}

function init(){
  const btnPlay = document.querySelector('.btn_play');

  btnPlay.addEventListener('click', () => {
    handleMainPlay(); // play 버튼 변경.
    createBugCarrot(); // bug, carrot을 random한 위치에 각각 생성.
    playTimer();
  });
  replayWrap.addEventListener('click', handleReplay);
}

init();