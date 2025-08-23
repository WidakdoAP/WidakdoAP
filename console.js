const fs = require("fs");
const getContributions = require("./api");

(async () => {
  const username = process.env.GH_USERNAME;
  const token = process.env.GH_TOKEN;

  const days = await getContributions(username, token);
  const recent = days.slice(-7); // last week

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" style="background:black">
    <style> text { fill: lime; font-family: monospace; font-size: 16px; } </style>`;

  recent.forEach((d, i) => {
    svg += `<text x="10" y="${20 + i * 20}">$ git commit -m "Commits: ${d.contributionCount} (${d.date})"</text>`;
  });

  svg += `<text x="10" y="180" fill="lime">█</text></svg>`;
  fs.writeFileSync("console.svg", svg);
})();
