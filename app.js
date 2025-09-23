const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = window.innerHeight;


let imageX = canvas.width / 2 - 25;
let imageY = canvas.height - 100;
const imageWidth = 50;
const imageHeight = 100;
const movespeed = 10;

const img = new Image();
img.src = "road.jpg";

const moto = new Image();
moto.src = "car2.png";

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    requestAnimationFrame(update);
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












