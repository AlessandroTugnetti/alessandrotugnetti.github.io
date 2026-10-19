import test from "node:test";
import assert from "node:assert/strict";
import { patterns, weights, energy, sweep } from "../assets/js/hopfield.mjs";

test("Hebbian weights are symmetric with no self connections", () => {
  for (let i = 0; i < 100; i++) {
    assert.equal(weights[i][i], 0);
    for (let j = 0; j < 100; j++) assert.equal(weights[i][j], weights[j][i]);
  }
});
for (const [name, pattern] of Object.entries(patterns)) {
  test(`${name}: stored memory is stable and noisy recall decreases energy`, () => {
    assert.equal(sweep(pattern).changes, 0);
    let seed = 10919;
    const random = () => {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let trial = 0; trial < 40; trial++) {
      let state = pattern.slice();
      const indices = Array.from({ length: 100 }, (_, i) => i);
      for (let i = 99; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      indices.slice(0, 20).forEach((i) => (state[i] *= -1));
      let stable = false;
      for (let i = 0; i < 30; i++) {
        const before = energy(state),
          result = sweep(state);
        state = result.state;
        assert.ok(energy(state) <= before + 1e-8);
        if (!result.changes) {
          stable = true;
          break;
        }
      }
      assert.ok(stable);
      assert.deepEqual(state, pattern);
    }
  });
}
