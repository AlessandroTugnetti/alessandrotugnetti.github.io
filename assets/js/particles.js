// Decorative, bounded canvas animation. No pointer listeners or external service.
(() => {
  const canvas = document.getElementById("ambient-particles");
  const toggle = document.getElementById("particles-toggle");
  if (!canvas || !toggle) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let enabled = !reduced.matches,
    frame = 0,
    points = [],
    width = 0,
    height = 0,
    previous = 0;
  try {
    const saved = localStorage.getItem("ale-particles");
    if (saved !== null) enabled = saved === "on";
  } catch {
    /* Optional persistence. */
  }
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    points = Array.from({ length: Math.min(55, Math.floor(width / 24)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
    }));
  }
  function draw(time) {
    if (!enabled || document.hidden) return;
    const delta = Math.min((time - previous) / 16.67 || 1, 3);
    previous = time;
    ctx.clearRect(0, 0, width, height);
    const dark = document.documentElement.dataset.theme === "dark";
    ctx.fillStyle = dark ? "#8bc3d56b" : "#167b9147";
    points.forEach((p, i) => {
      p.x = (p.x + p.vx * delta + width) % width;
      p.y = (p.y + p.vy * delta + height) % height;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
      ctx.fill();
      for (let j = i + 1; j < points.length; j++) {
        const q = points[j],
          d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 125) {
          ctx.strokeStyle = `rgba(${dark ? "139,195,213" : "22,123,145"},${(1 - d / 125) * 0.15})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });
    frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame);
    previous = 0;
    toggle.setAttribute("aria-pressed", String(enabled));
    document.getElementById("particles-state").textContent = enabled ? "On" : "Off";
    canvas.hidden = !enabled;
    if (enabled && !document.hidden) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, width, height);
  }
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    enabled = !enabled;
    try {
      localStorage.setItem("ale-particles", enabled ? "on" : "off");
    } catch {
      /* Optional persistence. */
    }
    sync();
  });
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      enabled = false;
      sync();
    }
  });
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", resize);
  resize();
  sync();
})();
