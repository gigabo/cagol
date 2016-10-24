#!/usr/bin/env node

const H = process.stdout.rows-3;
const W = process.stdout.columns-2;
const threshold = .1;
const boarder = "\n+" + new Array(W + 1).join("-") + "+\n";
const B = [];
const neighbors = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];
const times = {};

function make() {
  for (let i = 0; i < H; i++) {
    B[i] = [];
    for (let j = 0; j < W; j++) {
      B[i][j] = Math.random() < threshold ? 1 : 0;
    }
  }
}

const liveCell = "\x1b[7m \x1b[0m";
const draw = wrap(function draw() {
  process.stdout.write(boarder);
  for (let i = 0; i < H; i++) process.stdout.write("|"
    + B[i].map(v => v ? liveCell : " ").join("") +
  "|");
  process.stdout.write(boarder);
});


const live = wrap(function live() {
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
});

const time = wrap(function time() {
  process.stdout.write(JSON.stringify(times));
});

const step = wrap(function step() {
  draw();
  live();
  time();
});

function wrap(fn) {
  const {name} = fn;
  times [name] = 0;
  return function() {
    const t0 = new Date;
    fn();
    times[name] = new Date - t0;
  };
}

make();
setInterval(step, 50);
