import { glMatrix, mat4 } from '../lib/glmatrix/dist/esm/index.js';
import { Sim } from './Sim.js';
import { VerletObject } from './VerletObject.js';

let ctx = null;
let canvas = null;
let simulation = null;
let previousTimeStamp = 0.0;

let fpsDiv = null;

let totalSimulationTime = 0.0;
let totalSimulationCount = 0;

function toFixed(a,n) {
  const mul = 10**n;
  return Math.round(a*mul)/mul;
}

function render(timeStamp) {
  const elapsed = timeStamp - previousTimeStamp;
  previousTimeStamp = timeStamp;
  //console.log(`Elapsed: ${elapsed}`);

  simulation.update(elapsed);

  const simulationTimeEnd = performance.now();
  totalSimulationCount++;
  let simulationTimeElapsed = simulationTimeEnd-timeStamp;
  totalSimulationTime += simulationTimeElapsed;
  fpsDiv.innerText = `Sim time: ${toFixed(simulationTimeElapsed,3)} ms ${toFixed(totalSimulationTime/totalSimulationCount,3)}`;

  // Clear rect
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw Particles
  for(const obj of simulation.objects) {
    ctx.beginPath();
    ctx.arc(obj.positionCurrent[0], obj.positionCurrent[1], obj.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Draw constraint
  ctx.beginPath();
  ctx.arc(simulation.position[0], simulation.position[1], simulation.radius, 0, 2 * Math.PI);
  ctx.stroke();

  requestAnimationFrame(render);
}

function mousedown(e) {
  simulation.objects.push(new VerletObject([e.offsetX,e.offsetY],Math.random()*10+2))
}

function createCanvas(width, height, parentName) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  canvas.addEventListener("mousedown",mousedown);

  const parentElement = document.querySelector(parentName);
  parentElement.appendChild(canvas);

  return canvas;
}

function createFpsDiv(parentName) {
  const div = document.createElement("div");

  const parentElement = document.querySelector(parentName);
  parentElement.appendChild(div);
  return div;
}

function main() {
  console.log("WebPage loaded");

  fpsDiv = createFpsDiv("body");

  canvas = createCanvas(400,400,"body");

  ctx = canvas.getContext("2d");

  simulation = new Sim();
  simulation.objects.push(new VerletObject([200.0,200.0]));
  for(let i=0;i<50;i++) {
    simulation.objects.push(new VerletObject([200.0+Math.random()*150-75,200.0+Math.random()*150-75],2+Math.random()*5));
  }

  previousTimeStamp = performance.now();

  requestAnimationFrame(render);

}

document.addEventListener('DOMContentLoaded', main);