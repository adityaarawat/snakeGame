const board = document.querySelector(".board");
const startbutton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startgameModal = document.querySelector(".start-game");
const gameoverModal = document.querySelector(".game-over");
const restartButton=document.querySelector(".btn-restart");
const highScoreElement=document.querySelector("#high-score");
const scoreElement=document.querySelector("#score");
const timeElement=document.querySelector("#time");


const boxwidth = 50;
const boxheight = 50;
const rows = Math.floor(board.clientHeight / boxheight);
const cols = Math.floor(board.clientWidth / boxwidth);

let direction = "down";
let intervalId = null;

let timeIntervalId=null;

let highScore=localStorage.getItem("highScore")||0;
let time=`00-00`;
let score=0;
highScoreElement.innerText=highScore;


const blocks = {};
const snake = [{ x: 2, y: 1 }];

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${i}-${j}`] = block;
  }
}

function placeFood() {
  let fx, fy, key;
  do {
    fx = Math.floor(Math.random() * rows);
    fy = Math.floor(Math.random() * cols);
    key = `${fx}-${fy}`;
  } while (snake.some(s => `${s.x}-${s.y}` === key));
  food = { x: fx, y: fy };
  blocks[key].classList.add("food-color");
}

let food = null;
placeFood();

function renderSnake() {
  let head = null;
  if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
  else if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
  else if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };
  else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };

  if (!head) return;

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    intervalId = null;
    modal.style.display="flex";
    startgameModal.style.display='none';
    gameoverModal.style.display='flex';
    return;
  }

  const headKey = `${head.x}-${head.y}`;
  if (snake.some(seg => `${seg.x}-${seg.y}` === headKey)) {
    clearInterval(intervalId);
    intervalId = null;
    alert("game Over");
    return;
  }

  //Food consumne Logic

  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food-color");
    snake.unshift(head);
    placeFood();
    score+=10;
    scoreElement.innerText=score;
    if(score>highScore){
      highScore=score;
      localStorage.setItem("highScore",highScore.toString());
      highScoreElement.innerText=highScore;
    }
  } else {
    snake.forEach(s => {
      const key = `${s.x}-${s.y}`;
      if (blocks[key]) blocks[key].classList.remove("snake");
    });
    snake.unshift(head);
    snake.pop();
  }

  snake.forEach(segment => {
    const key = `${segment.x}-${segment.y}`;
    if (blocks[key]) blocks[key].classList.add("snake");
  });
}

window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  else if (e.key === "ArrowRight" && direction !== "left") direction = "right";
  else if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  else if (e.key === "ArrowDown" && direction !== "up") direction = "down";
});

startbutton.addEventListener("click", () => {
  if (intervalId) return;
  if (modal) modal.style.display = "none";
  renderSnake();
  intervalId = setInterval(renderSnake, 300);
  timeIntervalId=setInterval(()=>{
  let [min,sec]=time.split("-").map(Number)
  if(sec==59){
  min+=1;
  sec=0
  }
  else{
  sec+=1;
  }
  time = `${String(min).padStart(2, "0")}-${String(sec).padStart(2, "0")}`;
  timeElement.innerText=time;
  },1000)
});


//restart button

restartButton.addEventListener("click",restart)

function restart() {
 
  clearInterval(intervalId);
  intervalId = null;
  score=0;
  time=`00-00`;
   scoreElement.innerText=score;
   timeElement.innerHTML=time;
   highScoreElement.innerText=highScore;

  if (food) {
    blocks[`${food.x}-${food.y}`].classList.remove("food-color");
  }

  


  snake.forEach(seg => {
    let key = `${seg.x}-${seg.y}`;
    if (blocks[key]) blocks[key].classList.remove("snake");
  });


  snake.length = 0;
  snake.push({ x: 1, y: 3 });


  direction = "down";


  modal.style.display = "none";
  startgameModal.style.display = "none";
  gameoverModal.style.display = "none";

  placeFood();


  intervalId = setInterval(renderSnake, 300);
}


// mobile controls 


let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30; // minimum px to consider a swipe

window.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

  // horizontal swipe
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "left") {
      direction = "right";
    } else if (dx < 0 && direction !== "right") {
      direction = "left";
    }
  } else { // vertical swipe
    if (dy > 0 && direction !== "up") {
      direction = "down";
    } else if (dy < 0 && direction !== "down") {
      direction = "up";
    }
  }
});