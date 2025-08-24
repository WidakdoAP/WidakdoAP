const fs = require("fs");
const getContributions = require("./api");

(async () => {
  const username = process.env.GH_USERNAME;
  const token = process.env.GH_TOKEN;

  const days = await getContributions(username, token);
  const recent = days.slice(-7); // last week

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200">
    <rect width="100%" height="100%" fill="gray" />
    <style> text { fill: white; font-family: monospace; font-size: 16px; } </style>`;

  recent.forEach((d, i) => {
    svg += `<text x="10" y="${20 + i * 20}">$ git commit -m "Commits: ${d.contributionCount} (${d.date})"</text>`;
  });

  svg += `<text x="10" y="180" fill="white">|
  <animate attributeName="opacity"
           values="1;1;0;0;1"
           keyTimes="0;0.4;0.5;0.9;1"
           dur="1s"
           calcMode="discrete"
           repeatCount="indefinite" />
  </text></svg>`;
  
  fs.writeFileSync("console.svg", svg);
})();
