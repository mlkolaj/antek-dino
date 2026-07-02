// Game variables
const gameContainer = document.getElementById('gameContainer');
const dino = document.getElementById('dino');
const gameOverScreen = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const finalScoreDisplay = document.getElementById('finalScore');

let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let isJumping = false;
let gameRunning = true;
let gameSpeed = 5;
let spawnRate = 100;
let obstacleCount = 0;

// Update high score display
highScoreDisplay.textContent = 'Najlepszy wynik: ' + highScore;

// Jump function
function jump() {
    if (!isJumping && gameRunning) {
        isJumping = true;
        dino.classList.add('jump');
        
        setTimeout(() => {
            dino.classList.remove('jump');
            isJumping = false;
        }, 600);
    }
}

// Restart game
function restartGame() {
    score = 0;
    gameSpeed = 5;
    spawnRate = 100;
    obstacleCount = 0;
    isJumping = false;
    gameRunning = true;
    scoreDisplay.textContent = score;
    gameOverScreen.style.display = 'none';
    
    // Remove all obstacles
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obs => obs.remove());
}

// Game over function
function endGame() {
    gameRunning = false;
    gameOverScreen.style.display = 'flex';
    finalScoreDisplay.textContent = score;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoHighScore', highScore);
        highScoreDisplay.textContent = 'Najlepszy wynik: ' + highScore;
    }
}

// Spawn obstacles
function spawnObstacle() {
    if (!gameRunning) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    gameContainer.appendChild(obstacle);
    
    obstacleCount++;
    let obstacleLeft = gameContainer.offsetWidth;
    
    const moveInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(moveInterval);
            return;
        }
        
        obstacleLeft -= gameSpeed;
        obstacle.style.right = (gameContainer.offsetWidth - obstacleLeft) + 'px';
        
        // Check collision
        if (checkCollision(obstacle)) {
            clearInterval(moveInterval);
            endGame();
            return;
        }
        
        // Remove obstacle when off screen
        if (obstacleLeft < -50) {
            clearInterval(moveInterval);
            obstacle.remove();
            score += 10;
            scoreDisplay.textContent = score;
            
            // Increase difficulty
            if (score % 100 === 0) {
                gameSpeed += 0.5;
                spawnRate = Math.max(80, spawnRate - 5);
            }
        }
    }, 20);
}

// Collision detection
function checkCollision(obstacle) {
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
    return !(
        dinoRect.right < obstacleRect.left ||
        dinoRect.left > obstacleRect.right ||
        dinoRect.bottom < obstacleRect.top ||
        dinoRect.top > obstacleRect.bottom
    );
}

// Game loop - spawn obstacles
setInterval(() => {
    if (gameRunning) {
        spawnObstacle();
    }
}, spawnRate);

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameRunning) {
            jump();
        } else {
            restartGame();
        }
    }
});

gameContainer.addEventListener('click', () => {
    if (gameRunning) {
        jump();
    } else {
        restartGame();
    }
});

// Touch support for mobile
let touchStartX = 0;
gameContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

gameContainer.addEventListener('touchend', (e) => {
    if (gameRunning) {
        jump();
    } else {
        restartGame();
    }
});

// Initialize score display
scoreDisplay.textContent = score;
console.log('🎮 Gra załadowana! Powodzenia!');
