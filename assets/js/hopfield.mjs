// Small bipolar Hopfield network: Hebbian weights, zero diagonal,
// asynchronous updates, no bias. All calculations run in the browser.
export const SIDE = 10;
export const patterns = {
  ring: Array.from({ length: 100 }, (_, i) => {
    const r = Math.hypot((i % SIDE) - 4.5, Math.floor(i / SIDE) - 4.5);
    return r > 2.2 && r < 4.3 ? 1 : -1;
  }),
  cross: Array.from({ length: 100 }, (_, i) =>
    Math.abs((i % SIDE) - Math.floor(i / SIDE)) <= 1 || Math.abs((i % SIDE) + Math.floor(i / SIDE) - 9) <= 1 ? 1 : -1
  ),
};
export const weights = Array.from({ length: 100 }, (_, i) =>
  Array.from({ length: 100 }, (_, j) => (i === j ? 0 : Object.values(patterns).reduce((s, p) => s + p[i] * p[j], 0) / 100))
);
export function energy(state) {
  return -state.reduce((total, s, i) => total + s * weights[i].reduce((sum, w, j) => sum + w * state[j], 0), 0) / 2;
}
export function sweep(state) {
  const next = state.slice();
  let changes = 0;
  for (let i = 0; i < next.length; i++) {
    const field = weights[i].reduce((sum, w, j) => sum + w * next[j], 0);
    const value = Math.abs(field) < 1e-10 ? next[i] : field > 0 ? 1 : -1;
    if (value !== next[i]) changes++;
    next[i] = value;
  }
  return { state: next, changes };
}
if (typeof document !== "undefined" && document.getElementById("noisy-pattern")) {
  const get = (id) => document.getElementById(id);
  const input = get("noisy-pattern"),
    output = get("recalled-pattern");
  let state,
    running = false;
  function draw(canvas, values) {
    const ctx = canvas.getContext("2d"),
      cell = canvas.width / SIDE;
    ctx.fillStyle = "#edf2f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    values.forEach((v, i) => {
      ctx.fillStyle = v > 0 ? "#167b91" : "#fff";
      ctx.fillRect((i % SIDE) * cell + 1, Math.floor(i / SIDE) * cell + 1, cell - 2, cell - 2);
    });
  }
  function metrics(count) {
    get("recall-sweeps").textContent = count;
    get("recall-energy").textContent = energy(state).toFixed(2);
  }
  function reset() {
    if (running) return;
    const target = patterns[get("memory-pattern").value];
    state = target.slice();
    const indices = Array.from({ length: 100 }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    indices.slice(0, Number(get("memory-noise").value)).forEach((i) => (state[i] *= -1));
    draw(input, state);
    draw(output, state);
    metrics(0);
    input.setAttribute("aria-label", `Input: ${get("memory-pattern").value} with ${get("memory-noise").value}% of pixels flipped`);
    output.setAttribute("aria-label", "Output: waiting for retrieval");
    get("recall-status").textContent = "Ready to recall. Choose a pattern and try it.";
  }
  get("memory-noise").addEventListener("input", () => {
    get("noise-value").textContent = `${get("memory-noise").value}%`;
    reset();
  });
  get("memory-pattern").addEventListener("change", reset);
  get("corrupt-pattern").addEventListener("click", reset);
  get("retrieve-pattern").addEventListener("click", async () => {
    if (running) return;
    running = true;
    const controls = ["retrieve-pattern", "corrupt-pattern", "memory-noise", "memory-pattern"].map(get);
    controls.forEach((el) => (el.disabled = true));
    get("recall-status").textContent = "Retrieving stored memory…";
    let stable = false,
      count = 0;
    while (!stable && count < 30) {
      const result = sweep(state);
      state = result.state;
      stable = result.changes === 0;
      count++;
      draw(output, state);
      metrics(count);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) await new Promise((resolve) => setTimeout(resolve, 120));
    }
    const target = patterns[get("memory-pattern").value];
    const exact = state.every((s, i) => s === target[i]);
    get("recall-status").textContent = exact
      ? "Memory recovered: exact match to the stored pattern."
      : stable
        ? "Stable state reached, but not the intended memory. Try less noise."
        : "Sweep limit reached. Try less noise.";
    output.setAttribute("aria-label", `Output: ${get("recall-status").textContent}`);
    running = false;
    controls.forEach((el) => (el.disabled = false));
  });
  reset();
}
