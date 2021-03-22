const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

let peak = 0; // the highest y position of the ball
let ground = 0; // the lowest y position of the ball
let middle = 0; // the horizontal middle of the canvas
let ballWidth = 0; // the width of the ball
let ballWidthMultiplier = 1; // the ball width multiplier (configurable by user?)

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    middle = canvas.width / 2;

    peak = canvas.height / 3;
    ground = canvas.height - peak;

    ballWidth = canvas.height / 6;
}
resize();
window.addEventListener('resize', resize);

function ease() {
    let p = life / (maxLife / 2);
    if (p > 1) p = 2 - p;
    return (p * p)
}

let delay = 83.33; // delay between frames, 83.33 = 12fps
let life = 0;
let frames = 12;
let maxLife = delay * frames;
function draw() {
    setTimeout(draw, delay);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    life += delay;
    if (life > maxLife) life = 0;
    let y = peak + ease() * (ground - peak);

    ctx.beginPath();
    ctx.arc(middle, y, ballWidth * ballWidthMultiplier / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#eeeeee';
    ctx.fill();

}
draw();
