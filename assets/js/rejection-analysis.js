(() => {
  const figures = {
    timeline: [
      [
        {
          type: "scatter",
          mode: "lines",
          line: { color: "#00369f", width: 5 },
          name: "applications sent",
          x: [
            "2025-11",
            "2025-12",
            "2026-01",
            "2026-02",
            "2026-03",
            "2026-04",
            "2026-05",
            "2026-06",
            "2026-07",
            "2026-08",
            "2026-09",
            "2026-10",
            "2026-11",
          ],
          y: [4, 0, 16, 2, 5, 14, 6, 42, 81, 15, 78, 35, 23],
          marker: { color: "#00369f" },
          hovertemplate: "%{x}<br>%{y} applications sent<extra></extra>",
        },
        {
          type: "scatter",
          mode: "lines",
          line: { color: "#303030", width: 5 },
          name: "rejections",
          x: [
            "2025-11",
            "2025-12",
            "2026-01",
            "2026-02",
            "2026-03",
            "2026-04",
            "2026-05",
            "2026-06",
            "2026-07",
            "2026-08",
            "2026-09",
            "2026-10",
            "2026-11",
          ],
          y: [0, 0, 1, 2, 1, 3, 2, 7, 15, 11, 25, 42, 15],
          marker: { color: "#303030" },
          hovertemplate: "%{x}<br>%{y} rejections<extra></extra>",
        },
      ],
      { showlegend: true },
    ],
    stage: [
      [
        {
          type: "bar",
          orientation: "h",
          x: [106, 18, 11, 6],
          y: ["First reply with a date", "Next step", "Interview attended", "Interview and rejection"],
          marker: { color: ["#303030", "#00369f", "#00369f", "#00369f"] },
          text: [106, 18, 11, 6],
          textposition: "outside",
          cliponaxis: false,
          customdata: [33.021806853582554, 5.607476635514018, 3.426791277258567, 1.8691588785046729],
          hovertemplate: "%{y}<br>%{x} of 321 (%{customdata:.1f}%)<extra></extra>",
        },
      ],
      { xaxis: { range: [0, 110] }, yaxis: { autorange: "reversed" } },
    ],
    timing: [
      [
        {
          type: "box",
          name: "Send → reply",
          x: [
            0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8,
            8, 8, 9, 9, 9, 10, 11, 11, 12, 15, 18, 21, 21, 21, 22, 25, 25, 26, 27, 30, 31, 36, 37, 37, 39, 41, 42, 42, 45, 46, 49, 49, 49, 51, 52, 56,
            56, 57, 57, 60, 63, 66, 69, 71, 71, 79, 84, 84, 90, 95, 97, 99, 103, 106, 112, 114, 114, 122, 132, 136,
          ],
          orientation: "h",
          boxpoints: "all",
          jitter: 0.3,
          pointpos: 0,
          marker: { color: "#00369f", size: 5, opacity: 0.65 },
          line: { color: "#00369f", width: 1 },
          hovertemplate: "%{x} days<extra></extra>",
        },
        {
          type: "box",
          name: "Send → step 1",
          x: [0, 1, 4, 11, 11, 13, 16, 25, 31, 40, 71, 85],
          orientation: "h",
          boxpoints: "all",
          jitter: 0.3,
          pointpos: 0,
          marker: { color: "#00369f", size: 5, opacity: 0.65 },
          line: { color: "#00369f", width: 1 },
          hovertemplate: "%{x} days<extra></extra>",
        },
        {
          type: "scatter",
          mode: "markers",
          name: "Send → step 2",
          x: [10, 26, 80],
          y: ["Send → step 2", "Send → step 2", "Send → step 2"],
          marker: { color: "#00369f", size: 5, opacity: 0.65 },
          hovertemplate: "%{x} days<extra></extra>",
        },
        {
          type: "box",
          name: "Send → rejection",
          x: [
            0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8,
            8, 8, 9, 9, 9, 9, 9, 9, 10, 11, 11, 12, 13, 13, 14, 16, 17, 19, 22, 24, 25, 25, 26, 27, 30, 31, 37, 37, 37, 38, 39, 41, 41, 42, 42, 45,
            46, 49, 49, 49, 51, 52, 56, 56, 57, 57, 60, 65, 66, 68, 69, 71, 72, 77, 79, 79, 84, 84, 85, 90, 91, 92, 95, 97, 99, 103, 106, 112, 114,
            114, 114, 122, 132, 136, 139, 154, 158, 193,
          ],
          orientation: "h",
          boxpoints: "all",
          jitter: 0.3,
          pointpos: 0,
          marker: { color: "#00369f", size: 5, opacity: 0.65 },
          line: { color: "#00369f", width: 1 },
          hovertemplate: "%{x} days<extra></extra>",
        },
        {
          type: "scatter",
          mode: "markers",
          name: "Step 1 → rejection",
          x: [6, 10, 13, 39, 43, 69],
          y: ["Step 1 → rejection", "Step 1 → rejection", "Step 1 → rejection", "Step 1 → rejection", "Step 1 → rejection", "Step 1 → rejection"],
          marker: { color: "#00369f", size: 5, opacity: 0.65 },
          hovertemplate: "%{x} days<extra></extra>",
        },
        {
          type: "scatter",
          mode: "markers",
          name: "Step 2 → rejection",
          x: [4, 34],
          y: ["Step 2 → rejection", "Step 2 → rejection"],
          marker: { color: "#00369f", size: 5, opacity: 0.65 },
          hovertemplate: "%{x} days<extra></extra>",
        },
      ],
      {
        xaxis: { title: { text: "Days" } },
        yaxis: {
          autorange: "reversed",
          categoryorder: "array",
          categoryarray: ["Send → reply", "Send → step 1", "Send → step 2", "Send → rejection", "Step 1 → rejection", "Step 2 → rejection"],
        },
      },
    ],
    silence: [
      [
        {
          type: "bar",
          x: ["30+ days", "60+ days", "90+ days", "180+ days"],
          y: [41.577060931899645, 41.00418410041841, 39.42857142857143, 25.58139534883721],
          marker: { color: ["#7797ce", "#7797ce", "#00369f", "#7797ce"] },
          text: ["41.6%", "41.0%", "39.4%", "25.6%"],
          textposition: "outside",
          cliponaxis: false,
          customdata: [
            [116, 279],
            [98, 239],
            [69, 175],
            [11, 43],
          ],
          hovertemplate: "%{x}<br>%{customdata[0]} of %{customdata[1]} (%{y:.1f}%)<extra></extra>",
        },
      ],
      { yaxis: { ticksuffix: "%", range: [0, 52] } },
    ],
    "arrival-month": [
      [
        {
          type: "bar",
          name: "emails",
          x: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
          y: [1, 0, 0, 0, 10, 23, 42, 15],
          marker: { color: "#00369f" },
          hovertemplate: "%{x}<br>%{y} emails<extra></extra>",
        },
      ],
      {},
    ],
    weekday: [
      [
        {
          type: "bar",
          name: "emails",
          x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          y: [15, 20, 14, 23, 13, 2, 4],
          marker: { color: "#00369f" },
          hovertemplate: "%{x}<br>%{y} emails<extra></extra>",
        },
      ],
      {},
    ],
    hour: [
      [
        {
          type: "bar",
          name: "emails",
          x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
          y: [0, 0, 0, 0, 0, 0, 0, 0, 2, 12, 21, 11, 6, 6, 8, 6, 6, 3, 6, 2, 0, 1, 0, 1],
          marker: { color: "#00369f" },
          hovertemplate: "%{x:02d}:00<br>%{y} emails<extra></extra>",
          width: 0.8,
        },
      ],
      {
        xaxis: {
          type: "linear",
          range: [-1.8, 24.8],
          tickmode: "array",
          tickvals: [0, 6, 12, 18, 23],
          ticktext: ["00:00", "06:00", "12:00", "18:00", "23:00"],
        },
      },
    ],
    similarity: [
      [
        {
          type: "histogram",
          x: [
            0.006666666666666667, 0.01875, 0.04482758620689655, 0.046875, 0.05434782608695652, 0.057692307692307696, 0.058394160583941604,
            0.0593607305936073, 0.06428571428571428, 0.06951871657754011, 0.0718954248366013, 0.08280254777070063, 0.08547008547008547,
            0.08695652173913043, 0.08812260536398467, 0.08843537414965986, 0.0891089108910891, 0.09316770186335403, 0.09523809523809523,
            0.10084033613445378, 0.10550458715596331, 0.1134020618556701, 0.11818181818181818, 0.11818181818181818, 0.11931818181818182,
            0.11931818181818182, 0.12213740458015267, 0.12716763005780346, 0.12727272727272726, 0.13131313131313133, 0.15151515151515152,
            0.15151515151515152, 0.15789473684210525, 0.15841584158415842, 0.17757009345794392, 0.17757009345794392, 0.2, 0.20408163265306123,
            0.20408163265306123, 0.2073170731707317, 0.2073170731707317, 0.25925925925925924, 0.25925925925925924, 0.3125, 0.35175879396984927,
            0.35175879396984927, 0.7191011235955056, 0.7191011235955056, 0.7671232876712328, 0.7671232876712328, 0.8181818181818182,
            0.8245614035087719, 0.8245614035087719, 0.8247422680412371, 0.8347826086956521, 0.8849557522123894, 0.8849557522123894,
            0.8888888888888888, 0.9204545454545454, 0.9204545454545454, 0.9345794392523364, 0.9345794392523364, 0.9368421052631579,
            0.9368421052631579, 0.9454545454545454, 0.9454545454545454, 0.96875, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1,
          ],
          xbins: { start: 0, end: 1.01, size: 0.05 },
          marker: { color: "#00369f", line: { color: "white", width: 1 } },
          hovertemplate: "Similarity %{x}<br>%{y} emails<extra></extra>",
        },
      ],
      {
        xaxis: { title: "Closest match score", range: [0, 1.05] },
        shapes: [{ type: "line", x0: 0.75, x1: 0.75, y0: 0, y1: 1, yref: "paper", line: { color: "#303030", dash: "dot" } }],
      },
    ],
    roles: [
      [
        {
          type: "bar",
          orientation: "h",
          x: [118, 80, 6],
          y: ["Data /<br>technical", "Finance /<br>investment", "Compliance /<br>financial crime"],
          name: "applications",
          marker: { color: "#777" },
          hovertemplate: "%{y}<br>%{x} applications<extra></extra>",
        },
        {
          type: "bar",
          orientation: "h",
          x: [62, 44, 3],
          y: ["Data /<br>technical", "Finance /<br>investment", "Compliance /<br>financial crime"],
          name: "rejections",
          marker: { color: "#00369f" },
          hovertemplate: "%{y}<br>%{x} rejections<extra></extra>",
        },
      ],
      { showlegend: true, barmode: "group", yaxis: { autorange: "reversed" } },
    ],
  };
  const article = document.querySelector(".rejection-article");
  const root = document.documentElement;
  const mobile = window.matchMedia("(max-width: 720px)");

  function renderCharts() {
    const dark = root.dataset.theme === "dark";
    const isMobile = mobile.matches;
    const style = getComputedStyle(article);
    const themeColor = (name) => style.getPropertyValue(name).trim();
    const ink = themeColor("--ink");
    const paper = themeColor("--global-bg-color");
    const colors = {
      "#00369f": themeColor("--accent"),
      "#303030": dark ? "#d0d7de" : "#303030",
      "#7797ce": dark ? "#8baee6" : "#7797ce",
      "#777": dark ? "#a7b1bd" : "#777",
      white: paper,
    };
    const baseAxis = { automargin: true, zeroline: false, fixedrange: true, gridcolor: themeColor("--rule") };
    return Promise.all(
      Object.entries(figures).map(([id, definition]) => {
        const [data, extra] = JSON.parse(JSON.stringify(definition), (key, value) =>
          typeof value === "string" && Object.hasOwn(colors, value) ? colors[value] : value
        );
        const layout = {
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          height: isMobile ? 300 : 355,
          margin: { l: 40, r: 15, t: 20, b: 48 },
          font: { family: "Consolas, Liberation Mono, monospace", size: isMobile ? 10 : 12, color: ink },
          xaxis: { ...baseAxis, showgrid: false, ...extra.xaxis },
          yaxis: { ...baseAxis, showgrid: true, rangemode: "tozero", ...extra.yaxis },
          showlegend: !!extra.showlegend,
          legend: { orientation: "h", x: 0, y: 1.15 },
          shapes: extra.shapes || [],
          barmode: extra.barmode || "relative",
          hoverlabel: { bgcolor: ink, font: { color: paper } },
        };
        if (extra.showlegend) layout.margin.t = 44;
        if (id === "stage" && isMobile) {
          data[0].y = data[0].y.map((label) =>
            label.replace("First reply with", "First reply<br>with").replace("Interview and rejection", "Interview and<br>rejection")
          );
        }
        if (["weekday", "hour", "arrival-month"].includes(id)) {
          layout.height = 235;
          layout.margin = { l: 32, r: 8, t: 12, b: 32 };
        }
        if (["stage", "timing", "roles"].includes(id)) {
          layout.yaxis.ticklabelstandoff = 14;
          layout.margin.l = isMobile ? 124 : 155;
        }
        if (id === "roles") {
          layout.height = isMobile ? 360 : 410;
          layout.margin.l = isMobile ? 118 : 145;
          layout.bargap = 0.46;
          layout.bargroupgap = 0.17;
        }
        if (id === "timeline") {
          layout.xaxis.nticks = isMobile ? 6 : 9;
          layout.xaxis.tickformat = "%b %y";
          layout.xaxis.type = "date";
        }
        return Plotly.react("chart-" + id, data, layout, { responsive: true, displayModeBar: false });
      })
    );
  }

  if (window.Plotly) {
    let updates = Promise.resolve();
    function queueRender() {
      updates = updates.then(renderCharts).then(() => {
        root.dataset.charts = "ready";
      });
    }
    new MutationObserver(queueRender).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    mobile.addEventListener("change", queueRender);
    queueRender();
  }
})();
