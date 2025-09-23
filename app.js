const canvasR = document.getElementById("right");
const ctxR = canvasR.getContext("2d");

canvasR.width = 100;
canvasR.height = window.innerHeight;

const rightImg = new Image();
rightImg.src = "images/right.png";


const canvasL = document.getElementById("left");
const ctxL = canvasL.getContext("2d");

canvasL.width = 100;
canvasL.height = window.innerHeight;

const leftImg = new Image();
leftImg.src = "images/left.png";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = window.innerHeight;


let gameOver = false;
let backgroundY = 0;
let backgroundSpeed = 5;
let score = 0;
let speedObstacle = 3;
let imageX = canvas.width / 2 - 25;
let imageY = canvas.height - 120;
const imageWidth = 40;
const imageHeight = 80;
const movespeed = 10;

const img = new Image();
img.src = "images/road.jpg";

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

// --- Powerups ---
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


// Increase difficulty over time

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
}

function update() {
    
    if (gameOver) return;

    backgroundY = (backgroundY + backgroundSpeed) % canvas.height;

    draw();
    moveObstacles();
    drawObstacles();
    movePowerups();
    drawPowerups();
    requestAnimationFrame(update);
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
        img: obstacleImgs[Math.floor(Math.random() * obstacleImgs.length)]
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
        obstacles[i].y += speedObstacle;
        if(checkCollision({
            x: imageX,
            y: imageY, 
            width: imageWidth, 
            height: imageHeight},
            obstacles[i]
        )) {
            console.log("Collision detected!");
            gameOver = true;
            alert(`Game Over!
Your score: ${score}`);
            document.location.reload();
            return;
        }
        if(obstacles[i].y > canvas.height){
            obstacles.splice(i, 1);
            i--; //
    }
}
};
document.addEventListener("keydown", (e)=> {
    if(e.key === "ArrowLeft" && imageX > 50){
        imageX -= movespeed;
    }
    if(e.key === "ArrowRight" && imageX < 454 - imageWidth){
        imageX += movespeed;
    }
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
drawPowerups();

function movePowerups() {
    for (let i = 0; i < powerups.length; i++) {
        const p = powerups[i];
        p.y += speedObstacle;

        // Check collision with car
        if (checkCollision({ x: imageX, y: imageY, width: imageWidth, height: imageHeight }, p)) {
            if (p.type === "coin") {
                score += 50; // bonus points
            } else if (p.type === "speed") {
                speedObstacle += 2;
                setTimeout(() => speedObstacle -= 2, 5000); // boost lasts 5s
            } else if (p.type === "shield") {
                shieldActive = true;
                setTimeout(() => shieldActive = false, 5000);
            }

            powerups.splice(i, 1); // remove after collected
            i--;
            continue;
        }

        // Remove if off-screen
        if (p.y > canvas.height) {
            powerups.splice(i, 1);
            i--;
        }
    }
}

movePowerups();
if (checkCollision(
    { x: imageX, y: imageY, width: imageWidth, height: imageHeight },
    obstacles[i]
)) {
    if (!shieldActive) {
        console.log("Collision detected!");
        gameOver = true;
        alert(`Game Over!\nYour score: ${score}`);
        document.location.reload();
        return;
    } else {
        // destroy obstacle if shield is active
        obstacles.splice(i, 1);
        i--;
    }
}


update();