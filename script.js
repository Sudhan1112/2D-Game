const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');

// Constants
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

// Initial Positions
let currentPosition = [230, 10];
let ballCurrentPosition = [270, 40];
let xDirection = -2;
let yDirection = 2;
let timerId;
let score = 0;

// Block Class
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

// Blocks Array
const blocks = [];
for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
        blocks.push(new Block(10 + col * 110, 210 + row * 30));
    }
}

// Add Blocks
function addBlocks() {
    blocks.forEach((block) => {
        const blockEl = document.createElement('div');
        blockEl.classList.add('block');
        blockEl.style.left = block.bottomLeft[0] + 'px';
        blockEl.style.bottom = block.bottomLeft[1] + 'px';
        grid.appendChild(blockEl);
    });
}
addBlocks();

// Add User Paddle
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

// Draw User
function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

// Move User
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
    } else if (e.key === 'ArrowRight' && currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
    }
});

// Add Ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();

// Draw Ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Move Ball
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}
timerId = setInterval(moveBall, 20);

// Check Collisions
function checkForCollisions() {
    // Block Collisions
    for (let i = 0; i < blocks.length; i++) {
        if (
            ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
            ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
            ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
            ballCurrentPosition[1] < blocks[i].topLeft[1]
        ) {
            const allBlocks = document.querySelectorAll('.block');
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.textContent = score;

            if (blocks.length === 0) {
                scoreDisplay.textContent = 'You Win!';
                clearInterval(timerId);
            }
        }
    }

    // Wall Collisions
    if (
        ballCurrentPosition[0] >= boardWidth - ballDiameter ||
        ballCurrentPosition[0] <= 0 ||
        ballCurrentPosition[1] >= boardHeight - ballDiameter
    ) {
        changeDirection();
    }

    // Paddle Collision
    if (
        ballCurrentPosition[0] > currentPosition[0] &&
        ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
        ballCurrentPosition[1] > currentPosition[1] &&
        ballCurrentPosition[1] < currentPosition[1] + blockHeight
    ) {
        changeDirection();
    }

    // Game Over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.textContent = 'Game Over!';
    }
}

// Change Ball Direction
function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}
