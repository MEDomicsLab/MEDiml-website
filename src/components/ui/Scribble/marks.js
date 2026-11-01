export const MARKS = {
  loop: {
    mode: "connect",
    d: "M2 40C52 22 128 8 190 22C246 35 262 92 222 112C186 130 150 104 168 74C186 42 262 34 318 36C352 37 378 39 398 40",
    from: [2, 40],
    to: [398, 40],
  },
  wave: {
    mode: "connect",
    d: "M2 40C48 14 96 10 140 34C182 58 224 66 268 42C306 20 352 18 398 40",
    from: [2, 40],
    to: [398, 40],
  },
  line: {
    mode: "connect",
    d: "M2 30C120 27 268 19 398 10",
    from: [2, 30],
    to: [398, 10],
  },
  arrow: {
    mode: "connect",
    d: "M2 34C110 14 260 10 392 24M370 9 395 24 372 39",
    from: [2, 34],
    to: [392, 24],
  },
  underline: {
    mode: "underline",
    d: "M4 15C60 8 140 6 222 9C254 10 280 11 296 13C232 15 148 18 88 25C138 23 196 22 250 24",
    box: [300, 30],
  },
  circle: {
    mode: "circle",
    d: "M196 10C112 6 18 22 8 58C-2 96 118 116 214 112C316 108 394 86 392 56C390 24 300 6 210 8C170 9 132 14 104 24",
    box: [400, 120],
  },
  check: {
    mode: "check",
    d: "M6 56C16 66 26 80 34 94C48 62 70 30 96 6",
    box: [100, 100],
  },
};

export const markFor = (name, index = 0) => {
  if (MARKS[name]) return name;
  const order = ["loop", "wave", "circle", "check", "line", "underline"];
  return order[index % order.length];
};
