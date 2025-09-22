const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = window.innerHeight;

const img = new Image();
img.src = "road.jpg";
img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
 }   

const moto = new Image();
moto.src = "car2.png";
moto.onload = function () {
    ctx.drawImage(moto, canvas.width / 2 - 25, canvas.height - 100, 50, 100);
};