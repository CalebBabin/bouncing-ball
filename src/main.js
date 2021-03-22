const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const body_style = getComputedStyle(document.body);
const baseColor = body_style.getPropertyValue('--base');

let peak = 0; // the highest y position of the ball
let ground = 0; // the lowest y position of the ball
let middle = 0; // the horizontal middle of the canvas
let ballWidth = 0; // the width of the ball
let ballWidthMultiplier = 1; // the ball width multiplier (configurable by user?)
let ballImpactStretch = 1.5; // how much the ball stretches on impact (configurable by user?)
let ballImpactSquish = 0.5; // how much the ball stretches on impact (configurable by user?)

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    middle = canvas.width / 2;

    peak = canvas.height / 6;
    ground = canvas.height - peak;

    ballWidth = canvas.height / 6;
}
resize();
window.addEventListener('resize', resize);

const EasingObject = {
    Linear: t => t,
    Quadratic: t => t * t,
    Cubic: t => t * t * t,
    Quart: t => t * t * t * t,
    Quint: t => t * t * t * t * t,
}
let EasingIndex = 0;
const EasingArray = [];
for (const key in EasingObject) {
    if (Object.hasOwnProperty.call(EasingObject, key)) {
        const element = EasingObject[key];
        element.key = key;
        EasingArray.push(element);
    }
}
const easingCanvas = document.querySelector('.easingFunction canvas');
const easingCtx = easingCanvas.getContext('2d');
function nextEasing () {
    EasingIndex++;
    if (EasingIndex >= EasingArray.length) {
        EasingIndex = 0;
    }
    document.querySelector('.easingFunction span').textContent = EasingArray[EasingIndex].key;

    const width = easingCanvas.offsetWidth;
    const height = easingCanvas.offsetHeight;
    easingCanvas.width = width;
    easingCanvas.height = height;
    easingCtx.beginPath();
    for (let index = 0; index < width; index++) {
        const p = index / width;
        easingCtx.lineTo(p * width, EasingArray[EasingIndex](p) * height);
    }
    easingCtx.strokeStyle = baseColor;
    easingCtx.stroke();
}
nextEasing();
window.addEventListener('click', nextEasing);

let delay = 83.33; // delay between frames, 83.33 = 12fps
let life = 0;
let frames = 12;
let maxLife = delay * frames;
function draw() {
    setTimeout(draw, delay);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    life += delay;
    if (life > maxLife) life = 0;
    let p = life / (maxLife / 2);
    if (p > 1) p = 2 - p;
    let y = peak + EasingArray[EasingIndex](p) * (ground - peak);

    ctx.save();
    ctx.beginPath();
    ctx.translate(middle, y);
    if (y > ground * 0.99) {
        ctx.scale(ballImpactStretch, ballImpactSquish);
    }
    ctx.arc(0, 0, ballWidth * ballWidthMultiplier / 2, 0, Math.PI * 2);
    ctx.fillStyle = baseColor;
    ctx.fill();
    ctx.restore();

}
draw();
