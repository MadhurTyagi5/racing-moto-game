const canvasR = document.getElementById("right");
const ctxR = canvasR.getContext("2d");

canvasR.width = 100;
canvasR.height = window.innerHeight;

const rightImg = new Image();
rightImg.src = "right.png";


const canvasL = document.getElementById("left");
const ctxL = canvasL.getContext("2d");

canvasL.width = 100;
canvasL.height = window.innerHeight;

const leftImg = new Image();
leftImg.src = "left.png";

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
const imageWidth = 50;
const imageHeight = 100;
const movespeed = 20;

const img = new Image();
img.src = "road.jpg";

const moto = new Image();
moto.src = "car2.png";

const obstacleImgs = [
    "car1.png",
    "car3.png",
    "car4.png",
    "car5.png",
    "car6.png"
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

const obstacleWidth = 50;
const obstaclesHeight = 100;
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
    }
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {

    backgroundY += backgroundSpeed;
    if (backgroundY >= canvas.height) {
        backgroundY = 0; 
    }

    draw();
    moveObstacles();
    drawObstacles();
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
        }else {
            ctx.fillStyle = "red";
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }
    }
}


function moveObstacles(){
    for(let i = 0; i < obstacles.length; i++){
        obstacles[i].y += speedObstacle;
        if(obstacles[i].y > canvas.height){
            obstacles.splice(i , 1);
            console.log(score);
        }
    }
}
document.addEventListener("keydown", (e)=> {
    if(e.key === "ArrowLeft" && imageX > 50){
        imageX -= movespeed;
    }
    if(e.key === "ArrowRight" && imageX < 454 - imageWidth){
        imageX += movespeed;
    }
});
update();
document.addEventListener("click" ,(e) =>{
    let v = x.client
console.log("")
});