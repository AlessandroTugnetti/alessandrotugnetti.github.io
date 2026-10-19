// Rank-one Hebbian Hopfield memory. W_ij = p_i p_j / N for i != j.
// The factored weights avoid allocating a 2500 x 2500 matrix on mobile.
export const SIDE = 50;
export function createMemory(pattern) {
  if (pattern.length < 2 || pattern.some((s) => s !== 1 && s !== -1)) throw new TypeError("A memory needs at least two bipolar neurons.");
  const target = pattern.slice(),
    size = target.length;
  const overlap = (state) => state.reduce((sum, s, i) => sum + s * target[i], 0);
  return {
    weight: (i, j) => (i === j ? 0 : (target[i] * target[j]) / size),
    energy: (state) => -(overlap(state) ** 2 - size) / (2 * size),
    start(state) {
      if (state.length !== size || state.some((s) => s !== 1 && s !== -1)) throw new TypeError("State must match the stored memory.");
      const values = state.slice();
      let dot = overlap(values);
      return {
        values,
        update(i) {
          const field = (target[i] * dot - values[i]) / size;
          const value = Math.abs(field) < 1e-10 ? values[i] : field > 0 ? 1 : -1;
          const changed = value !== values[i];
          dot += (value - values[i]) * target[i];
          values[i] = value;
          return changed;
        },
      };
    },
  };
}
export function maskedFace(pattern, left = true, side = SIDE) {
  return pattern.map((value, i) => (i % side < side / 2 === left ? -1 : value));
}
export function portraitPattern(image) {
  const buffer = document.createElement("canvas");
  buffer.width = SIDE;
  buffer.height = SIDE;
  const ctx = buffer.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, SIDE, SIDE);
  const { data } = ctx.getImageData(0, 0, SIDE, SIDE);
  return Array.from({ length: SIDE * SIDE }, (_, i) => {
    const offset = i * 4,
      luminance = 0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2];
    return data[offset + 3] > 128 && luminance < 170 ? 1 : -1;
  });
}
if (typeof document !== "undefined" && document.getElementById("face-memory")) {
  const canvas = document.getElementById("face-memory"),
    ctx = canvas.getContext("2d");
  const button = document.getElementById("retrieve-pattern"),
    status = document.getElementById("recall-status");
  const counter = document.getElementById("step-counter"),
    caption = document.getElementById("face-caption");
  const image = new Image();
  let pattern,
    memory,
    initial,
    running = false,
    completed = false,
    frame = 0;
  function draw(values) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(75, 156, 211, 0.85)";
    const cell = canvas.width / SIDE;
    values.forEach((v, i) => {
      if (v === 1) ctx.fillRect((i % SIDE) * cell, Math.floor(i / SIDE) * cell, cell, cell);
    });
  }
  function reset() {
    initial = maskedFace(pattern);
    completed = false;
    counter.textContent = "0";
    draw(initial);
    canvas.dataset.recovered = "false";
    canvas.setAttribute("aria-label", "Alessandro’s pixelated face with the left half missing");
    caption.textContent = "Half a face. Can the network remember the rest?";
    status.textContent = "The retrieved pattern is …";
  }
  function retrieve() {
    if (running) return;
    if (completed) reset();
    running = true;
    button.disabled = true;
    status.textContent = "The retrieved pattern is …";
    const network = memory.start(initial),
      order = Array.from({ length: pattern.length }, (_, i) => i);
    // Fisher-Yates: visit every neuron before beginning the next sweep.
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    let steps = 0,
      index = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function tick() {
      const until = Math.min(3000, steps + (reduced ? 3000 : 20));
      while (steps < until) {
        for (let j = 0; j < 5; j++) network.update(order[index++ % order.length]);
        steps++;
      }
      draw(network.values);
      counter.textContent = String(steps);
      if (steps < 3000) frame = requestAnimationFrame(tick);
      else {
        const recovered = network.values.every((v, i) => v === pattern[i]);
        canvas.dataset.recovered = String(recovered);
        status.textContent = recovered ? "The retrieved pattern is … Me!" : "The network reached a different stable state.";
        canvas.setAttribute("aria-label", recovered ? "Reconstructed pixelated portrait of Alessandro" : "Network recall result");
        caption.textContent = recovered ? "The full portrait, recalled from its visible half." : "Try retrieval again.";
        button.textContent = "Retrieve Again";
        button.disabled = false;
        running = false;
        completed = true;
      }
    }
    frame = requestAnimationFrame(tick);
  }
  image.onload = () => {
    pattern = portraitPattern(image);
    memory = createMemory(pattern);
    reset();
    button.disabled = false;
  };
  image.onerror = () => {
    status.textContent = "The portrait could not load. Please refresh to try again.";
  };
  image.src = canvas.dataset.portrait;
  button.addEventListener("click", retrieve);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
}
