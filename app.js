const canvasR = document.getElementById("right");
const ctxR = canvasR.getContext("2d");

canvasR.width = 100;
canvasR.height = window.innerHeight;

const rightImg = new Image();



const canvasL = document.getElementById("left");
const ctxL = canvasL.getContext("2d");

canvasL.width = 100;
canvasL.height = window.innerHeight;

const leftImg = new Image();


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = window.innerHeight;


const themes = {
    default: {
        road: "images/road.jpg",
        left: "images/left.png",
        right: "images/right.png"
    },
    desert: {
        road: "images/road.jpg",
        left: "images/left2.png",
        right: "images/right2.png"
    },
    snow: {
        road: "images/road.jpg",
        left: "images/left3.png",
        right: "images/right3.png"
    }
};





const engineSound = new Audio("sounds/engine.mp3");   
const crashSound = new Audio("sounds/crash.mp3");
const coinSound = new Audio("sounds/coin.mp3");

engineSound.loop = true;



let gameOver = false; 
let engineSoundPlaying = false;
let brakePressed = false;
let boostActive = false;
let currentBackgroundSpeed = 0;
let currentObstacleSpeed = 0;
let backgroundY = 0;
let backgroundSpeed = 5;
let score = 0;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
let speedObstacle = 3;
let imageX = canvas.width / 2 - 25;
let imageY = canvas.height - 120;
const imageWidth = 40;
const imageHeight = 80;
const movespeed = 4;

const img = new Image();
img.src = themes.default.road;
leftImg.src = themes.default.left;
rightImg.src = themes.default.right;

const moto = new Image();
moto.src = "images/car2.png";

const obstacleImgs = [
    "images/car1.png",
    "images/car2.png",
    "images/car3.png",
    "images/car4.png",
    "images/car5.png",
    "images/car6.png"
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});


const powerupImgs = [
    { src: "images/coin.png", type: "coin" },
    { src: "images/shield.png", type: "shield" },
    { src: "images/speed.png", type: "speed" }
].map(p => {
    const img = new Image();
    img.src = p.src;
    return { img, type: p.type };
});

const powerups = [];
const powerupSize = 30;
let shieldActive = false;


const obstacleWidth = 40;
const obstaclesHeight = 80;
const obstacles = [];




setInterval(() => {
    if(speedObstacle < 8){
        speedObstacle += 1;    
    }
    console.log(speedObstacle); 
    }, 10000);

    setInterval(createObstacle, 700);

    setInterval(() => {
        score += 1;
    }, 10);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (rightImg.complete) {
        ctxR.drawImage(rightImg, 0, backgroundY, canvasR.width, canvasR.height);
        ctxR.drawImage(rightImg, 0, backgroundY - canvasR.height, canvasR.width, canvasR.height);
    }
    if (leftImg.complete) {    
        ctxL.drawImage(leftImg, 0, backgroundY, canvasL.width, canvasL.height);
        ctxL.drawImage(leftImg, 0, backgroundY - canvasL.height, canvasL.width, canvasL.height);
    }
    if (img.complete) {
        ctx.drawImage(img, 0, backgroundY, canvas.width, canvas.height);
        ctx.drawImage(img, 0, backgroundY - canvas.height, canvas.width, canvas.height);
    }
    
    if (moto.complete) {
        ctx.drawImage(moto, imageX, imageY, imageWidth, imageHeight);
        // ctx.strokeStyle = "black";  
        // ctx.strokeRect(imageX, imageY, imageWidth, imageHeight);
    }
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

function update() {
    if (gameOver) return;
    
      currentBackgroundSpeed = backgroundSpeed;
      currentObstacleSpeed = speedObstacle;

    if (boostActive) {
        
        currentBackgroundSpeed = backgroundSpeed * 2;
        currentObstacleSpeed = speedObstacle * 1.5;
    } else if (brakePressed) {
    
        currentBackgroundSpeed = backgroundSpeed / 2;
        currentObstacleSpeed = speedObstacle / 2;
    }

       
    const leftBoundary = 60;
    const rightBoundary = 445 - imageWidth;
    
    if (leftPressed && imageX > leftBoundary) {
        imageX -= movespeed;
    }
    if (rightPressed && imageX < rightBoundary) {
        imageX += movespeed;
    }

    backgroundY = (backgroundY + currentBackgroundSpeed) % canvas.height;

    draw();
    moveObstacles();
    drawObstacles();
    movePowerups();
    drawPowerups();
    requestAnimationFrame(update);

    if (!engineSoundPlaying) {
    engineSound.loop = true;
    engineSound.volume = 0.3;
    engineSound.play();
    engineSoundPlaying = true;
}

}

function createObstacle() {
    const x = Math.random() * (canvas.width - obstacleWidth - 100) + 50;
    const y = -obstaclesHeight;
    const randomImg = obstacleImgs[Math.floor(Math.random() * obstacleImgs.length)];

    obstacles.push({ 
        x,
        y,
        width: obstacleWidth,
        height: obstaclesHeight,
        img: randomImg // Use the already selected image
    });
}      

function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (obs.img.complete){
            ctx.drawImage(obs.img, obs.x, obs.y, obs.width, obs.height);
            // ctx.strokeStyle = "black";
            // ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        }else {
            ctx.fillStyle = "red";
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }
    }
}
function checkCollision(rect1, rect2) {
    return (
        rect1.x <= rect2.x + rect2.width - 12 &&
        rect1.x + rect1.width - 12 >= rect2.x &&
        rect1.y <= rect2.y + rect2.height - 19 &&
        rect1.y + rect1.height - 19 >= rect2.y
    );
}

function moveObstacles(){
    for(let i = 0; i < obstacles.length; i++){
        obstacles[i].y += currentObstacleSpeed;
        if(checkCollision({
            x: imageX,
            y: imageY, 
            width: imageWidth, 
            height: imageHeight},
            obstacles[i]
        )) {
            crashSound.volume = 0.5;
            crashSound.play();

            console.log("Collision detected!");
            gameOver = true;

            if(score > highScore){
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }

            // Show Game Over message and Play Again button
            const gameOverContainer = document.getElementById("gameOverContainer");
            const gameOverMessage = document.getElementById("gameOverMessage");
            gameOverContainer.style.display = "block";
            gameOverMessage.innerHTML = score > highScore
                ? `Game Over!<br>Your score: ${score}<br>New High Score!`
                : `Game Over!<br>Your score: ${score}<br>High Score: ${highScore}`;

            return;
        }
        if(obstacles[i].y > canvas.height){
            obstacles.splice(i, 1);
            i--; //
    }
}
};
let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
    if (e.key === "ArrowDown") brakePressed = true; 

    
    if (e.key === "ArrowUp" && !boostActive) {
        boostActive = true;
        setTimeout(() => {
            boostActive = false;
        }, 2000);
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
    if (e.key === "ArrowDown") brakePressed = false; 
});

function createPowerup() {
    const x = Math.random() * (canvas.width - powerupSize - 100) + 50;
    const y = -powerupSize;
    const randomPowerup = powerupImgs[Math.floor(Math.random() * powerupImgs.length)];

    powerups.push({
        x,
        y,
        width: powerupSize,
        height: powerupSize,
        img: randomPowerup.img,
        type: randomPowerup.type
    });
}
setInterval(createPowerup, 5000);

function drawPowerups() {
    for (let i = 0; i < powerups.length; i++) {
        const p = powerups[i];
        if (p.img.complete) {
            ctx.drawImage(p.img, p.x, p.y, p.width, p.height);
        } else {
            ctx.fillStyle = "yellow";
            ctx.fillRect(p.x, p.y, p.width, p.height);
        }
    }
}

function movePowerups() {
    for (let i = 0; i < powerups.length; i++) {
        const p = powerups[i];
        p.y += currentObstacleSpeed;


if (checkCollision(
    { x: imageX, y: imageY, width: imageWidth, height: imageHeight },
    p   
)) {
    if (p.type === "coin") {
        score += 50; 
        coinSound.currentTime = 0; 
        coinSound.play();           


    } else if (p.type === "speed") {
        speedObstacle += 2;
        setTimeout(() => speedObstacle -= 2, 5000); // speed boost lasts 5s
    } else if (p.type === "shield") {
        shieldActive = true;
        setTimeout(() => shieldActive = false, 5000); // shield lasts 5s
    }

    
    powerups.splice(i, 1);
    i--;
    continue;

}
       
        if (p.y > canvas.height) {
            powerups.splice(i, 1);
            i--;
        }
    }
}


const themeButtons = document.querySelectorAll(".themeBtn");
themeButtons.forEach(button => {
    button.addEventListener("click", () => {
        themeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedTheme = button.dataset.theme;

        img.src = themes[selectedTheme].road;
        leftImg.src = themes[selectedTheme].left;
        rightImg.src = themes[selectedTheme].right;
    });
});

const playAgainBtn = document.getElementById("playAgainBtn");
playAgainBtn.addEventListener("click", () => {
    score = 0;
    gameOver = false;
    backgroundY = 0;
    speedObstacle = 3;
    imageX = canvas.width / 2 - 25;
    imageY = canvas.height - 120;
    obstacles.length = 0;
    powerups.length = 0;
    shieldActive = false;
    document.getElementById("gameOverContainer").style.display = "none";
    update();
});
update();