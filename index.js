#!/usr/bin/env node

const H = process.stdout.rows-3;
const W = process.stdout.columns-2;
const threshold = .1;
const interval = 100;
const boarder = "\n+" + new Array(W + 1).join("-") + "+\n";
const B = [];
const times = {};
const output = [];

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
  output.push(boarder);
  for (let i = 0; i < H; i++) output.push("|"
    + B[i].map(v => v ? liveCell : " ").join("") +
  "|");
  output.push(boarder);
});


const live = wrap(function live() {
  const N = [];
  for (let i = 0; i < H; i++) {
    N[i] = [];
    for (let j = 0; j < W; j++) {
      let n = 0;
      let I = i;
      let J = j - 1;

      // Middle row.
      if (B[I][J]) n++;
      J = j + 1;
      if (B[I][J]) n++;

      // Row above.
      I = i - 1;
      J = j - 1;
      if (B[I]) {
        if (B[I][J++]) n++;
        if (B[I][J++]) n++;
        if (B[I][J  ]) n++;
      }

      // Row below.
      I = i + 1;
      J = j - 1;
      if (B[I]) {
        if (B[I][J++]) n++;
        if (B[I][J++]) n++;
        if (B[I][J  ]) n++;
      }
      N[i][j] = (B[i][j] ? n === 2 || n === 3 : (n === 3)) ? 1 : 0;
    }
  }
  for (let i = 0; i < H; i++) {
    B[i] = N[i];
  }
});

const time = wrap(function time() {
  output.push(Object.keys(times).map(name => {
    const {c, m} = times[name];
    return name + ": " + lpad(c) + " (" + lpad(m) + ")";
  }).join(" | "));
});

const lpad = function(v) {
  v = "" + v;
  while (v.length < 3) v = " " + v;
  return v;
}

const emit = wrap(function emit() {
  process.stdout.write(output.join(""));
  output.splice(0, output.length, []);
});

const step = wrap(function step() {
  draw();
  live();
  time();
  emit();
  wait();
});

function wrap(fn) {
  const {name} = fn;
  const v = times[name] = {n: 0, t: 0, c: 0, m: 0};
  return function() {
    const t0 = new Date;
    fn();
    v.n ++;
    v.c  = new Date - t0;
    v.t += v.c;
    v.m  = (v.t / v.n) | 0;
  };
}

function wait() {
  setTimeout(step, interval - times.step.c);
}

make();
step();
