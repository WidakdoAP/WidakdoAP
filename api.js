const fs = require("fs");
const fetch = require("node-fetch");

async function getContributions(username, token) {
  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  return json.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays,
  );
}

module.exports = getContributions;
