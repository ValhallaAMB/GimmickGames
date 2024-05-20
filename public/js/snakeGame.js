document.addEventListener("DOMContentLoaded", () => {
  // Define HTML elements
  const board = document.getElementById("game-board");
  const instructionText = document.getElementById("instruction-text");
  const logo = document.getElementById("logo");
  const score = document.getElementById("score");
  const highScoreText = document.getElementById("highScore");

  // Define game variables
  const gridSizeX = 25;
  const gridSizeY = 20;
  let snake = [{ x: 12, y: 10 }];
  let food = generateFood();
  let direction = "right";
  let gameInterval;
  let gameSpeedDelay = 150;
  let gameStarted = false;
  let highScore = 0;

  // Draw game map, snake and food
  function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
  }

  // Draw snake
  function drawSnake() {
    snake.forEach((segment, index) => {
      let className;
      if (index === 0) {
        className = `snake-head-${direction}`;
      } else if (index === snake.length - 1) {
        className = getTailClass(snake[index - 1], segment);
      } else {
        className = getBodyClass(snake[index - 1], segment, snake[index + 1]);
      }
      const snakeElement = createGameElement("div", className);
      setPosition(snakeElement, segment);
      board.appendChild(snakeElement);
    });
  }

  // Create a snake or food cube/div
  function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  // Set the position of snake or food
  function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
  }

  // Draw food function
  function drawFood() {
    if (gameStarted) {
      const foodElement = createGameElement("div", "food");
      setPosition(foodElement, food);
      board.appendChild(foodElement);
    }
  }

  // Generate food function
  function generateFood() {
    let foodPosition;
    do {
      foodPosition = {
        x: Math.floor(Math.random() * gridSizeX) + 1,
        y: Math.floor(Math.random() * gridSizeY) + 1,
      };
    } while (isSnakeOverlapping(foodPosition));

    return foodPosition;
  }

  // Check if snake is overlapping with food
  function isSnakeOverlapping(position) {
    // some() returns true if at least one element in the array satisfies the condition
    return snake.some((segment) => {
      segment.x === position.x && segment.y === position.y;
    });
  }

  // Moving the snake
  function move() {
    const head = { ...snake[0] };
    switch (direction) {
      case "right":
        head.x++;
        break;
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      food = generateFood();
      increaseSpeed();
      //The clearInterval() function in JavaScript is used to stop a repeating interval that was previously set using the setInterval() function.
      clearInterval(gameInterval); // Clear past interval
      // The setInterval() function in JavaScript is used to repeatedly execute a specified function or code block at a fixed time interval.
      gameInterval = setInterval(() => {
        move();
        checkCollisions();
        draw();
      }, gameSpeedDelay);
    } else {
      snake.pop();
    }
  }

  // Start game function
  function startGame() {
    gameStarted = true; // Keep track of a running game
    instructionText.style.display = "none"; // Hide instruction text
    logo.style.display = "none"; // Hide logo
    gameInterval = setInterval(() => {
      move();
      checkCollisions();
      draw();
    }, gameSpeedDelay);
  }

  // Key press event listener
  function handleKeyPress(event) {
    if (
      (!gameStarted && event.code === "Space") ||
      (!gameStarted && event.key === " ")
    ) {
      startGame();
    } else {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== "down") direction = "up";
          break;
        case "ArrowDown":
          if (direction !== "up") direction = "down";
          break;
        case "ArrowLeft":
          if (direction !== "right") direction = "left";
          break;
        case "ArrowRight":
          if (direction !== "left") direction = "right";
          break;
      }
    }
  }

  function increaseSpeed() {
    if (gameSpeedDelay > 125) {
      gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
      gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
      gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
      gameSpeedDelay -= 1;
    }
  }

  function checkCollisions() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSizeX || head.y < 1 || head.y > gridSizeY) {
      gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
      }
    }
  }

  function gameOver() {
    updateHighScore();
    stopGame();
    showScoreModal();
    snake = [{ x: 12, y: 10 }];
    food = generateFood();
    direction = "right";
    gameSpeedDelay = 150;
    updateScore();
  }

  function showScoreModal() {
    const finalScore = snake.length - 1;
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

  function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, "0");
  }

  function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
  }

  function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
      highScore = currentScore;
      highScoreText.textContent = highScore.toString().padStart(3, "0");
      highScoreText.style.display = "block";
    }
  }

  // Add event listener for keydown event
  document.addEventListener("keydown", (event) => {
    // Check if the modal is open
    const scoreModal = document.getElementById("scoreModal");
    if (scoreModal && scoreModal.classList.contains("show")) {
      // Prevent default action to stop keyboard input
      event.preventDefault();
    } else {
      handleKeyPress(event);
    }
  });

  // Get the correct tail class based on direction
  function getTailClass(prevSegment, tailSegment) {
    if (prevSegment.x > tailSegment.x) return "snake-tail-left";
    if (prevSegment.x < tailSegment.x) return "snake-tail-right";
    if (prevSegment.y > tailSegment.y) return "snake-tail-up";
    if (prevSegment.y < tailSegment.y) return "snake-tail-down";
  }

  // Get the correct body class based on direction
  function getBodyClass(prevSegment, currSegment, nextSegment) {
    if (
      (prevSegment.x < currSegment.x && currSegment.x < nextSegment.x) ||
      (prevSegment.x > currSegment.x && currSegment.x > nextSegment.x)
    ) {
      return "snake-body-horizontal";
    }
    if (
      (prevSegment.y < currSegment.y && currSegment.y < nextSegment.y) ||
      (prevSegment.y > currSegment.y && currSegment.y > nextSegment.y)
    ) {
      return "snake-body-vertical";
    }
    if (
      (prevSegment.x < currSegment.x && currSegment.y > nextSegment.y) ||
      (nextSegment.x < currSegment.x && currSegment.y > prevSegment.y)
    ) {
      return "snake-BR-corner";
    }
    if (
      (prevSegment.x < currSegment.x && currSegment.y < nextSegment.y) ||
      (nextSegment.x < currSegment.x && currSegment.y < prevSegment.y)
    ) {
      return "snake-TR-corner";
    }
    if (
      (prevSegment.x > currSegment.x && currSegment.y > nextSegment.y) ||
      (nextSegment.x > currSegment.x && currSegment.y > prevSegment.y)
    ) {
      return "snake-BL-corner";
    }
    if (
      (prevSegment.x > currSegment.x && currSegment.y < nextSegment.y) ||
      (nextSegment.x > currSegment.x && currSegment.y < prevSegment.y)
    ) {
      return "snake-TL-corner";
    }
  }
});
