//board
let tileSize = 32;
let rows = 16;
let columns = 16;

//audio files
let deathAudio = new Audio("../audio/enemy-death.wav");
let shootAudio = new Audio("../audio/shoot.wav");
let titleScreenAudio = new Audio("../audio/title-screen.wav");
let earthAudio = new Audio("../audio/earth.wav");
let gameOverAudio = new Audio("../audio/game-over.wav");

// Logo & Instruction text
const instructionText = document.getElementById("instruction-text");

let board;
let boardWidth = tileSize * columns; //32*16
let boardHeight = tileSize * rows; //32*16
let context;

//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = (tileSize * columns) / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight,
};

let shipImg;
let shipVelocityX = tileSize; //ship moving speed

//aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1; //alien moving speed

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed, it negative bc its moving up; keeping in mind that the top of the board is zero

//score
let score = 0;
let gameOver = false;
let gameStarted = false;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d"); //used for drawing on the board

  titleScreenAudio.play();

  //load images
  shipImg = new Image();
  shipImg.src = "../images/spaceInvadersImg/player.png";
  shipImg.onload = function () {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  };

  //load alien images
  alienImg = new Image();
  alienImg.src = "../images/spaceInvadersImg/alien-cyan.png";
  createAliens();

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", pressToRestart);

  //update score display initially
  updateScoreDisplay();
};

function update() {
  requestAnimationFrame(update);

  if (!gameStarted) {
    // Add this condition to skip updating if the game hasn't started
    return;
  }

  if (gameStarted) {
    titleScreenAudio.pause();
    earthAudio.play();
  }

  if (gameOver) {
    context.clearRect(0, 0, board.width, board.height); // Clear the canvas
    earthAudio.pause();
    // earthAudio.currentTime = 0;

    gameOverAudio.play();
    showScoreModal();
    return;
  }

  context.clearRect(0, 0, board.width, board.height); //clears the board with every moving frame so the images wont smear across the board

  //drawing the ship over and over again
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  //draw the aliens
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVelocityX;

      //if alien touches borders, reverse course
      if (alien.x + alien.width > board.width || alien.x <= 0) {
        alienVelocityX *= -1;
        alien.x += alienVelocityX * 2; //syncing the rest of the aliens but taking one step forward and two steps back

        //move all aliens up by 1 row
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienHeight;
        }
      }
      context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

      if (alien.y >= ship.y) {
        gameOver = true;
        instructionText.style.display = "block";
      }
    }
  }

  //bullets
  for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    context.fillStyle = "red"; //bullet color
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    // shootAudio.play();

    //bullet collision with aliens
    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
        bullet.used = true;
        alien.alive = false;
        alienCount--;
        score += 100;
        deathAudio.currentTime = 0;
        deathAudio.play();
      }
    }

    //clear bullets
    while (
      (bulletArray.length > 0 && bulletArray[0].used) ||
      bulletArray[0].y < 0
    ) {
      bulletArray.shift(); //removes the first element in the array
    }

    //next level
    if (alienCount == 0) {
      //increase the number of aliens in rows and columns
      alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); // cap at 16/2 -2, so max 6 column of aliens
      alienRows = Math.min(alienRows + 1, rows - 4); //cap at 16-4, so at most 12 rows of aliens... the 4 is so that the aliens wont reach the last 4 rows of the board and overlap with the ship
      alienVelocityX += 0.3; //increase alien moevment speed
      alienArray = [];
      bulletArray = []; //clearing the bullets here bc when a new row of aliens is created one of the bullets fired in the previous level might touch the new aliens
      createAliens();
    }
  }
  //update the score display continuously
  updateScoreDisplay();
}

function updateScoreDisplay() {
  document.getElementById("score").innerText = "Score: " + score;
  // document.getElementById("highScore").innerText = "/ Highscore: " + highScore;
}

function moveShip(e) {
  //e stands for event
  if (gameOver) {
    context.clearRect(0, 0, board.width, board.height); // Clear the canvas        return;
  }

  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX; //move left one tile
  } else if (
    e.code == "ArrowRight" &&
    ship.x + shipVelocityX + ship.width <= board.width
  ) {
    ship.x += shipVelocityX; //move right one tile
  }
}

function createAliens() {
  for (let c = 0; c < alienColumns; c++) {
    for (let r = 0; r < alienRows; r++) {
      let alien = {
        img: alienImg,
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true,
      };
      alienArray.push(alien);
    }
  }
  alienCount = alienArray.length;
}

function shoot(e) {
  if (gameOver) {
    context.clearRect(0, 0, board.width, board.height); // Clear the canvas
    return;
  }

  if (e.code === "Space") {
    shootAudio.currentTime = 0;
    shootAudio.play();

    // shoot
    let bullet = {
      x: ship.x + (shipWidth * 15) / 32,
      y: ship.y,
      width: tileSize / 8,
      height: tileSize / 2,
      used: false,
    };
    bulletArray.push(bullet);

    // Hide instructions
    instructionText.style.display = "none";

    gameStarted = true;
  }
}

function detectCollision(a, b) {
  //condition to check the collision between 2 rectangles
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesnt reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

function pressToRestart(e) {
  if (gameOver && e.code == "Space") {
    restartGame();
    gameOverAudio.pause();
    earthAudio.currentTime = 0;
    earthAudio.play();
  } else {
    shoot(e);
  }
}

function restartGame() {
  score = 0;
  gameOver = false;
  ship.x = shipX;
  ship.y = shipY;
  alienArray = [];
  bulletArray = [];
  alienColumns = 3;
  alienRows = 2;
  alienVelocityX = 1;
  createAliens();
  instructionText.style.display = "none";
}

// Custom function to show the score modal
function showScoreModal() {
  const finalScore = score; // Use the game score
  const finalScoreElement = document.getElementById("finalScore");
  finalScoreElement.textContent = finalScore.toString().padStart(3, "0");

  const scoreInput = document.getElementById("scoreInput");
  scoreInput.value = finalScore;
  try {
    const scoreModal = new bootstrap.Modal(
      document.getElementById("scoreModal")
    );
    scoreModal.show();
  } catch (error) {
    console.log(error);
  }
}

// Add event listener for keydown event
document.addEventListener("keyup", (event) => {
  // Check if the modal is open
  const scoreModal = document.getElementById("scoreModal");
  if (scoreModal && scoreModal.classList.contains("show")) {
    // Prevent default action to stop keyboard input
    event.preventDefault();
  } else {
    pressToRestart(event);
  }
});
