document.addEventListener('DOMContentLoaded', () => {
  const gameArena = document.querySelector('#game-arena');
  const arenaSize = 600;
  const cellSize = 20;
  let gameStarted = false;
  let foodPosition = { x: 300, y: 200 }; // food position={x:15*cellSize, y:10*cellSize} so intial food position is (15,10)
  let snake = [
    { x: 160, y: 200 }, //head position co-ordinates : {x:8*cellSize, y:10*cellSize} so intial snake position is (8,10)
    { x: 140, y: 200 }, //  co-ordinates: {x:7*cellSize, y:10*cellSize} so intial snake position is (7,10)
    { x: 120, y: 200 }, //tail position co-ordinates: {x:6*cellSize, y:10*cellSize} so intial snake position is (6,10)
  ];
  let dx = cellSize; //change in x - meaning add 20px to x coordinate
  let dy = 0; //change in y - meaning add 0px to y coordinate
  let score = 0;
  let intervalId;

  let gameSpeed = 200;
  function drawScoreBoard() {
    const scoreBoard = document.querySelector('#score-board');
    scoreBoard.innerText = `Score: ${score}`;
  }
  function changeDirection(event) {
    //if snake is going down, it should not go up
    if (event.key === 'ArrowUp' && dy !== cellSize) {
      dx = 0;
      dy = -cellSize; // move up
      //if snake is going up, it should not go down
    } else if (event.key === 'ArrowDown' && dy !== -cellSize) {
      dx = 0;
      dy = cellSize; // move down
      //if snake is going left, it should not go right
    } else if (event.key === 'ArrowLeft' && dx !== cellSize) {
      dx = -cellSize; // move left
      dy = 0;
      //if snake is going right, it should not go left
    } else if (event.key === 'ArrowRight' && dx !== -cellSize) {
      dx = cellSize; // move right
      dy = 0;
    }
  }
  function gameOver() {
    //Check if Snake hits itself
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        clearInterval(intervalId); // stop the game loop
        return true; // Game over if snake hits itself
      }
    }
    //Check if Snake hits the wall
    if (
      snake[0].x < cellSize || //Touches Left Wall
      snake[0].x >= arenaSize - cellSize || //Touches Right Wall
      snake[0].y < cellSize || //Touches Top Wall
      snake[0].y >= arenaSize - cellSize //Touches Bottom Wall
    ) {
      clearInterval(intervalId); // stop the game loop
      return true; // Game over if snake hits the wall
    }
    return false; // Game continues if snake is within the arena
  }

  function generateFood() {
    let newX, newY;
    do {
      newX =
        Math.floor(Math.random() * ((arenaSize - cellSize) / cellSize)) *
        cellSize;
      newY =
        Math.floor(Math.random() * ((arenaSize - cellSize) / cellSize)) *
        cellSize;
    } while (
      snake.some((snakeCell) => snakeCell.x === newX && snakeCell.y === newY)
    );

    foodPosition = { x: newX, y: newY };
  }
  function updateSnake() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead); // add new head to the front of the snake
    // Check if snake has eaten the food
    if (newHead.x === foodPosition.x && newHead.y === foodPosition.y) {
      score += 10; // increase score by 10
      generateFood(); // generate new food
      if (gameSpeed > 50) {
        gameSpeed -= 10; // increase speed of the game
        clearInterval(intervalId); // stop the game loop
        gameLoop(); // restart the game loop with new speed
      }
    } // if snake has not eaten the food
    else {
      snake.pop(); // remove the last segment of the snake
    }
  }
  function initiateGame() {
    const scoreBoard = document.createElement('div');
    scoreBoard.setAttribute('id', 'score-board');
    document.body.insertBefore(scoreBoard, gameArena); // Insert scoreboard before game-arena
    const start = document.createElement('button');
    start.setAttribute('class', 'start-button');
    start.innerText = 'Start Game';
    start.addEventListener('click', () => {
      start.style.display = 'none';
    });
    document.body.appendChild(start);
    runGame();
  }
  function drawDiv(x, y, className) {
    const div = document.createElement('div');
    div.setAttribute('class', className);
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;
    return div;
  }
  function gameLoop() {
    intervalId = setInterval(() => {
      gameArena.innerHTML = ''; // Clear the game arena
      const foodElement = drawDiv(foodPosition.x, foodPosition.y, 'food');
      gameArena.appendChild(foodElement);
      snake.forEach((segment) => {
        const snakeElement = drawDiv(segment.x, segment.y, 'snake');
        gameArena.appendChild(snakeElement);
      });
      if (gameOver()) {
        gameStarted = false;
        clearInterval(intervalId); // stop the game loop
        document.removeEventListener('keydown', changeDirection);
        gameArena.innerHTML = ''; // Clear the game arena
        alert(`Game Over, Score = ${score}`);
        window.location.reload();
        return;
      }
      drawScoreBoard();
      updateSnake();
    }, gameSpeed);
  }
  function runGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameLoop();
      document.addEventListener('keydown', changeDirection);
    }
  }
  initiateGame();
});
/**
 If you want insert some element before another element, you can use the insertBefore() method.
 insertBefore(node you want to insert, node before which you want to insert)
 innerText v/s textContent:
 innerText: It is a property of the HTML element that represents the visible text content of the element.
 textContent: It is a property of the HTML element that represents the text content of the element, including hidden text.

 unshift() method: The unshift() method adds one or more elements to the beginning of an array and returns the new length of the array.
 shift() method: The shift() method removes the first element from an array and returns that removed element. This method changes the length of the array.
 */
