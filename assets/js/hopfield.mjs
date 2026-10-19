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
    energy: (state) => -(overlap(state) ** 2 - state.reduce((sum, value) => sum + value * value, 0)) / (2 * size),
    start(state) {
      if (state.length !== size || state.some((s) => s !== 1 && s !== -1 && s !== 0)) throw new TypeError("State must match the stored memory.");
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
export const PORTRAIT_SIDE = 50;
export function portraitPattern(pixels, side = PORTRAIT_SIDE, mouthPixels = pixels) {
  if (pixels.length !== side * side * 4) throw new TypeError("RGBA dimensions do not match.");
  // The source is intentional blue-and-white pixel art. This classifies its
  // palette, rather than thresholding shadows in a photograph.
  return Array.from({ length: side * side }, (_, i) => {
    const row = Math.floor(i / side) / side;
    // Preserve the original thin curl/eye marks; area averaging in the smile
    // band prevents the narrow mouth outline disappearing between samples.
    const mouth = row >= 0.58 && row <= 0.66;
    const sample = mouth ? mouthPixels : pixels;
    return sample[4 * i + 3] > 128 && sample[4 * i] < (mouth ? 200 : 180) ? 1 : -1;
  });
}
export function recallPortrait(pattern, side = PORTRAIT_SIDE) {
  const memory = createMemory(pattern),
    network = memory.start(maskedFace(pattern, true, side));
  for (let i = 0; i < pattern.length * 2; i++) network.update(i % pattern.length);
  return network.values;
}
export function reconstructionOrder(pattern, side = PORTRAIT_SIDE) {
  const order = [];
  for (let i = 0; i < side * side; i++) if (i % side < side / 2 && pattern[i] === 1) order.push(i);
  let seed = 271828;
  for (let i = order.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
export function reconstructionFrame(recalled, order, step, side = PORTRAIT_SIDE) {
  const frame = maskedFace(recalled, true, side);
  const count = Math.floor((Math.min(3000, Math.max(0, step)) * order.length) / 3000);
  for (let j = 0; j < count; j++) frame[order[j]] = recalled[order[j]];
  return frame;
}
if (typeof document !== "undefined" && document.getElementById("face-memory")) {
  const canvas = document.getElementById("face-memory"),
    ctx = canvas.getContext("2d");
  const button = document.getElementById("retrieve-pattern"),
    status = document.getElementById("recall-status");
  const counter = document.getElementById("step-counter"),
    caption = document.getElementById("face-caption");
  const buffer = document.createElement("canvas");
  buffer.width = buffer.height = PORTRAIT_SIDE;
  const source = buffer.getContext("2d", { willReadFrequently: true });
  const image = new Image();
  let pixels,
    recalled,
    order,
    running = false,
    completed = false,
    frame = 0;
  function draw(step) {
    const values = reconstructionFrame(recalled, order, step);
    const data = new Uint8ClampedArray(values.length * 4);
    values.forEach((value, i) => data.set(value === 1 ? [99, 169, 214, 255] : [255, 255, 255, 255], i * 4));
    source.putImageData(new ImageData(data, PORTRAIT_SIDE, PORTRAIT_SIDE), 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
    canvas.dataset.step = String(step);
  }
  function reset() {
    completed = false;
    counter.textContent = "0";
    draw(0);
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
    const recovered = recalled.every((value, i) => value === pixels[i]);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let start;
    function tick(time) {
      start ??= time;
      const step = reduced ? 3000 : Math.min(3000, Math.floor((time - start) / 2));
      draw(step);
      counter.textContent = String(step);
      if (step < 3000) frame = requestAnimationFrame(tick);
      else {
        canvas.dataset.recovered = String(recovered);
        status.textContent = recovered ? "The retrieved pattern is … Me!" : "The network reached a different stable state.";
        canvas.setAttribute("aria-label", "Reconstructed pixelated portrait of Alessandro");
        caption.textContent = "The full portrait, recalled from its visible half.";
        button.textContent = "Retrieve Again";
        button.disabled = false;
        running = false;
        completed = true;
      }
    }
    frame = requestAnimationFrame(tick);
  }
  image.onload = () => {
    source.imageSmoothingQuality = "low";
    source.drawImage(image, 0, 0, PORTRAIT_SIDE, PORTRAIT_SIDE);
    const fine = source.getImageData(0, 0, PORTRAIT_SIDE, PORTRAIT_SIDE).data;
    source.imageSmoothingQuality = "high";
    source.drawImage(image, 0, 0, PORTRAIT_SIDE, PORTRAIT_SIDE);
    pixels = portraitPattern(fine, PORTRAIT_SIDE, source.getImageData(0, 0, PORTRAIT_SIDE, PORTRAIT_SIDE).data);
    recalled = recallPortrait(pixels);
    order = reconstructionOrder(recalled);
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
