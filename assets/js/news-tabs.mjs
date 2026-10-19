export function tabDestination(key, index, count) {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "ArrowRight") return (index + 1) % count;
  if (key === "ArrowLeft") return (index - 1 + count) % count;
  return null;
}

export function initNewsTabs(root = document) {
  root.querySelectorAll(".news-tabs").forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    function activate(tab, focus = false) {
      tabs.forEach((candidate) => {
        const selected = candidate === tab;
        candidate.setAttribute("aria-selected", String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        root.getElementById(candidate.getAttribute("aria-controls")).hidden = !selected;
      });
      if (focus) tab.focus();
      tab.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        const next = tabDestination(event.key, index, tabs.length);
        if (next === null) return;
        event.preventDefault();
        activate(tabs[next], true);
      });
    });
  });
}
if (typeof document !== "undefined") initNewsTabs();
