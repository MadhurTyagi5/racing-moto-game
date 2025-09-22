const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = window.innerHeight;

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

const obstacleWidth = 50;
const obstaclesHeight = 100;
const obstacles = [];

// Increase difficulty over time

setInterval(() => {
    if(speedObstacle < 15){
        speedObstacle += 1;    
    }
    console.log(speedObstacle); 
    // if(difficulty > 200){
        //     difficulty -= 300;
        //     console.log(difficulty);
        // }
    }, 15000);
    if(speedObstacle < 6){
    setInterval(createObstacle, 500);
    }
    if(speedObstacle >= 6 && speedObstacle < 8){
        setInterval(createObstacle, 300); 
    }
    if(speedObstacle >= 8 && speedObstacle <= 11){
        setInterval(createObstacle, 150);
    }
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    if (img.complete) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    if (moto.complete) {
        ctx.drawImage(moto, imageX, imageY, imageWidth, imageHeight);
    }
}

function update() {
    draw();
    moveObstacles();
    drawObstacles();
    requestAnimationFrame(update);
}

function createObstacle() {
    const x = Math.random() * (canvas.width - obstacleWidth - 100) + 50;
    const y = -obstaclesHeight;
    obstacles.push({ 
        x,
        y,
        width: obstacleWidth,
        height: obstaclesHeight
    });
}       
function drawObstacles() {
    ctx.fillStyle = "red";
    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
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