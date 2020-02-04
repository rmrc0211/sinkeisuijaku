const start = document.getElementById('start');
const modal = document.getElementById('modal');
const mask = document.getElementById('mask');


let array1 = [];
let array2 = [];
let array3 = [];

window.onload = function(){
this.alert('好きな写真で遊べる神経衰弱だよ！\n写真を６枚選んでね！');
}


const chooseImg = function (event){    
  const p = new Promise(function(resolve) {
        for (let j=0; j<=5; j++){
            let file = event.target.files[j];
            if(file == undefined){
                alert('写真は６枚だよ！');
                array1.length = 0;
                break;
            }
            let reader = new FileReader();            
            reader.readAsDataURL(file);
            reader.onload = function() { 
                array1.push(reader.result);
                if(array1.length == 6){
                    resolve(array1);            
                }
            };
        }  
  });
  
  p.then(function shuffle (){
    array2 = array1.slice(0,array1.length);
    array3 = array1.concat(array2);
    let n = array3.length;
    let temp, i;
    while (n) {
        i = Math.floor(Math.random() * n--);
        temp = array3[n];
        array3[n] = array3[i];
        array3[i] = temp;
    }
  })
  
  .then(function() {
    document.getElementById('thum-text').innerText = 'この写真でいい？';
    for (let i = 0; i < array1.length; i++){
        thum = document.getElementById('thum');
        let img = document.createElement('img');                    
        img.setAttribute('src', array1[i]);
        img.setAttribute('width','50px');
        img.setAttribute('height','70px');
        thum.appendChild(img);                
    }                    
    start.classList.remove('hidden');
    document.getElementById('file-btn').classList.add('hidden');
    document.getElementById('reload').classList.remove('hidden');    
  })

  .then(function(){
    start.addEventListener('click', function () {
      modal.classList.add('hidden');
      mask.classList.add('hidden');
    });    
  })

};

const startGame = function(){    
  
  let count = 0;
  let firstCard = null;
  let secondCard = null;
  
  let startTime;
  let isRunning = false;
  let correctCount = 0;
  let timeoutId;
  
  function init() {
    for (let i = 0; i < array3.length; i++) {
    document.getElementById('stage').appendChild(createCard(i));
    }
  }
  
  function createCard(num) {
    let container;
    let card;
    let inner;
    inner = '<div class="card-front"><img src='
      + array3[num] +  
      ' width=50px height=70px></div><div class="card-back">?</div>';
    card = document.createElement('div');
    card.innerHTML = inner;
    card.className = 'card';
    card.addEventListener('click', function() {
    flipCard(this);
      if (isRunning === true) {
        return;
      }
    isRunning = true;
    startTime = Date.now();
    runTimer();
    document.getElementById('restart').className = '';
    });
    container = document.createElement('div');
    container.className = 'card-container';
    container.appendChild(card);
    return container;
  }
    
  function flipCard(card) {
    if (firstCard !== null && secondCard !== null) {
    return;
    }
    if (card.className.indexOf('open') !== -1) {
    return;
    }
    card.className = 'card open';
    count++;
    if (count % 2 === 1) {
    firstCard = card;
    } else {
    secondCard = card;
    secondCard.addEventListener('transitionend', check);
    }
  }
  
  function check() {
    let firstSrc = firstCard.children[0].children[0].getAttribute('src');
    let secondSrc = secondCard.children[0].children[0].getAttribute('src');
    if (firstSrc !== secondSrc) {
      firstCard.className = 'card';
      secondCard.className = 'card';
    } 
    else {
      correctCount++;
      if (correctCount === 6) {
        clearTimeout(timeoutId);
        alert('おめでとう！');
      }
    }
    secondCard.removeEventListener('transitionend', check);
    firstCard = null;
    secondCard = null;
  }
  
  function runTimer() {
    document.getElementById('score').textContent = ((Date.now() - startTime) / 1000).toFixed(2);
    timeoutId = setTimeout(function() {
      runTimer();
    }, 10);
  }
  
  init();
};
