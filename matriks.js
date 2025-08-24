const fs = require("fs");
const getContributions = require("./api");

function randomChar() {
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";
  return chars[Math.floor(Math.random() * chars.length)];
}

(async () => {
  const username = process.env.GH_USERNAME;
  const token = process.env.GH_TOKEN;

  const days = await getContributions(username, token);
  const width = 800;
  const height = 200;

  const maxCommits = Math.max(...days.map((d) => d.contributionCount));
  const cols = 80;
  const rows = 20;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" style="background:black">
    <style> text { font-family: monospace; font-size: 12px; } </style>`;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const idx = (c * rows + r) % days.length;
      const commits = days[idx].contributionCount;
      const brightness = commits / (maxCommits || 1);

      if (brightness > Math.random()) {
        const x = (width / cols) * c;
        const y = (height / rows) * (r + 1);
        svg += `<text x="${x}" y="${y}" fill="lime" opacity="${brightness.toFixed(
          2,
        )}">${randomChar()}</text>`;
      }
    }
  }

  svg += `</svg>`;
  fs.writeFileSync("matriks.svg", svg);
})();
