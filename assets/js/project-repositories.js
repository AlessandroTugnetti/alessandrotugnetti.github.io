for (const tile of document.querySelectorAll("[data-github-repository]")) {
  const stats = [
    ["stargazers_count", "star"],
    ["forks_count", "fork"],
  ];
  fetch(`https://api.github.com/repos/${tile.dataset.githubRepository}`, {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((repository) => {
      if (!repository) return;
      for (const [key, label] of stats) {
        const count = repository[key];
        if (!Number.isInteger(count)) continue;
        tile.querySelector(`[data-github-stat="${key}"]`).textContent = `${count.toLocaleString("en")} ${count === 1 ? label : label + "s"}`;
      }
    })
    .catch(() => {});
}
