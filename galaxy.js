const fs = require("fs");
const getContributions = require("./api");

function polarToCartesian(r, angle) {
  return [r * Math.cos(angle), r * Math.sin(angle)];
}

(async () => {
  const username = process.env.GH_USERNAME;
  const token = process.env.GH_TOKEN;

  const days = await getContributions(username, token);
  const width = 600;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;

  const maxCommits = Math.max(...days.map((d) => d.contributionCount));

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" style="background:black">`;

  days.forEach((day, i) => {
    const angle = i * 0.2; // spiral angle step
    const radius = i * 2;
    const [dx, dy] = polarToCartesian(radius, angle);
    const commits = day.contributionCount;
    const brightness = commits / (maxCommits || 1);

    if (commits > 0) {
      svg += `<circle cx="${centerX + dx}" cy="${centerY + dy}" r="${
        2 + commits * 0.5
      }" fill="white" opacity="${brightness.toFixed(2)}" />`;
    }
  });

  svg += `</svg>`;
  fs.writeFileSync("galaxy.svg", svg);
})();

// ![Console](https://raw.githubusercontent.com/WidakdoAP/WidakdoAP/output/console.svg)
// GH_USERNAME=${{ github.repository_owner }} GH_TOKEN=${{ secrets.GH_TOKEN }} node console.js $mv console.svg dist/
