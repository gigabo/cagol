#!/usr/bin/env node

const H = process.stdout.rows-3;
const W = process.stdout.columns-2;
const threshold = .1;
const boarder = "+" + new Array(W + 1).join("-") + "+";
const B = [];
const neighbors = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function make() {
  for (let i = 0; i < H; i++) {
    B[i] = [];
    for (let j = 0; j < W; j++) {
      B[i][j] = Math.random() < threshold ? 1 : 0;
    }
  }
}

const liveCell = "\x1b[7m \x1b[0m";
function draw() {
  console.log("\n\n" + boarder);
  for (let i = 0; i < H; i++) console.log("|"
    + B[i].map(v => v ? liveCell : " ").join("") +
  "|");
  console.log(boarder);
}


function live() {
  const N = [];
  for (let i = 0; i < H; i++) {
    N[i] = [];
    for (let j = 0; j < W; j++) {
      const n = neighbors.reduce((v, [I,J]) => v += (B[i+I] || [])[j+J] || 0, 0);
      N[i][j] = (B[i][j] ? n === 2 || n === 3 : (n === 3)) ? 1 : 0;
    }
  }
  for (let i = 0; i < H; i++) {
    B[i] = N[i];
  }
}

function step() {
  draw();
  live();
}

make();
setInterval(step, 50);
