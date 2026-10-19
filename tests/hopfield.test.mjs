import test from "node:test";
import assert from "node:assert/strict";
import { createMemory, maskedFace } from "../assets/js/hopfield.mjs";
const side = 50;
// A sparse asymmetric binary face-shaped memory, including eyes and hair.
const pattern = Array.from({ length: side * side }, (_, i) => {
  const x = (i % side) - 24.5,
    y = Math.floor(i / side) - 24.5;
  return (x * x) / 300 + (y * y) / 480 < 1 &&
    (y < -8 || Math.abs(x) > 12 || (Math.abs(y + 3) < 2 && Math.abs(x) > 5) || (Math.abs(y - 9) < 2 && Math.abs(x) < 8))
    ? 1
    : -1;
});
test("Factored Hebbian weights match explicit matrix and have zero diagonal", () => {
  const p = [1, -1, 1, -1],
    m = createMemory(p),
    s = [1, 1, -1, -1];
  let explicit = 0;
  for (let i = 0; i < p.length; i++)
    for (let j = 0; j < p.length; j++) {
      assert.equal(m.weight(i, j), m.weight(j, i));
      if (i === j) assert.equal(m.weight(i, j), 0);
      explicit += m.weight(i, j) * s[i] * s[j];
    }
  assert.equal(m.energy(s), -explicit / 2);
});
for (const left of [true, false])
  test(`50x50 face: masked ${left ? "left" : "right"} half reconstructs through non-increasing energy`, () => {
    const m = createMemory(pattern),
      initial = maskedFace(pattern, left, side),
      n = m.start(initial);
    assert.notDeepEqual(initial, pattern);
    for (let i = 0; i < pattern.length * 2; i++) {
      const before = m.energy(n.values);
      n.update(i % pattern.length);
      assert.ok(m.energy(n.values) <= before + 1e-8);
    }
    assert.deepEqual(n.values, pattern);
  });
test("Stored portrait is stable and invalid states are rejected", () => {
  const m = createMemory(pattern),
    n = m.start(pattern);
  for (let i = 0; i < pattern.length; i++) assert.equal(n.update(i), false);
  assert.throws(() => createMemory([0, 1]), TypeError);
  assert.throws(() => m.start([1, -1]), TypeError);
});
