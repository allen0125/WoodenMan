const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };
let direction;
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};
let score = 0;
let game;

document.addEventListener("keydown", directionControl);

// Add roundRect to CanvasRenderingContext2D if not exists
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
    };
}

function directionControl(event) {
    if (event.keyCode == 37 && direction != "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction != "DOWN") {
        direction = "UP";
    } else if (event.keyCode == 39 && direction != "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction != "UP") {
        direction = "DOWN";
    }
}

function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x == snake[i].x && newHead.y == snake[i].y) {
            // Game over
            clearInterval(game);
            document.getElementById('gameOver').style.display = 'block';
            document.getElementById('finalScore').textContent = score;
            return true;
        }
    }
    return false;
}

function draw() {
    // Modern background
    ctx.fillStyle = "#f7fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food with modern style
    ctx.fillStyle = "#e53e3e";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake with modern style
    for (let i = 0; i < snake.length; i++) {
        if (i == 0) {
            // Snake head
            ctx.fillStyle = "#4a5568";
        } else {
            // Snake body with gradient
            ctx.fillStyle = `hsl(${120 - (i * 2)}, 70%, 50%)`;
        }
        ctx.beginPath();
        ctx.roundRect(snake[i].x, snake[i].y, box, box, 4);
        ctx.fill();
        
        // Add subtle shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
    }
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        document.getElementById('score').textContent = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        return;
    }

    snake.unshift(newHead);

    // Draw score on canvas
    ctx.fillStyle = "#4a5568";
    ctx.font = "20px Inter";
    ctx.fillText("Score: " + score, 10, 25);
}

function resetGame() {
    document.getElementById('gameOver').style.display = 'none';
    score = 0;
    document.getElementById('score').textContent = score;
    // Reset game state and start again
    snake = [{x: 9 * box, y: 10 * box}];
    direction = null;
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
    clearInterval(game);
    game = setInterval(draw, 100);
}

// Start the game
game = setInterval(draw, 100);
