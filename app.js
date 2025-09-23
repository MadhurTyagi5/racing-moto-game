const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = window.innerHeight;

let bgY = 0;
let bgSpeed = 5;
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
    if(speedObstacle < 11){
        speedObstacle += 1;    
    }
    console.log(speedObstacle); 
    // if(difficulty > 200){
        //     difficulty -= 300;
        //     console.log(difficulty);
        // }
    }, 15000);
    if(speedObstacle < 4){
    setInterval(createObstacle, 700);
    }
    if(speedObstacle >= 4 && speedObstacle < 6){
        setInterval(createObstacle, 500); 
    }
    if(speedObstacle >= 6 && speedObstacle < 8){
        setInterval(createObstacle, 300); 
    }
    if(speedObstacle >= 8 && speedObstacle <= 11){
        setInterval(createObstacle, 150);
    }
    setInterval(() => {
        score += 1;
    }, 1);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    if (img.complete) {
        ctx.drawImage(img, 0, bgY, canvas.width, canvas.height);
        ctx.drawImage(img, 0, bgY - canvas.height, canvas.width, canvas.height);
    }
    
    if (moto.complete) {
        ctx.drawImage(moto, imageX, imageY, imageWidth, imageHeight);
    }
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {

    bgY += bgSpeed;
    if (bgY >= canvas.height) {
        bgY = 0; 
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
            score += 1000;
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