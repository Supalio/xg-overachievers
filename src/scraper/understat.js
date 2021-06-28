const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function fetchPlayerStats(playerId, page) {
  const url = `https://understat.com/player/${playerId}`;

  await page.goto(url)
      .catch((err) => {
        console.error(`Error when fetching data for player ${playerId} : ${err}`);
      });
  const $data = cheerio.load(await page.content());

  const playerName = $data('.header-wrapper').text().trim();
  const team = $data('.breadcrumb li:nth-child(3)').text().trim();
  const xGData = $data('#player-groups .table-total td:nth-child(10)').text().trim();
  const xGDataSplit = xGData.split(/[+-]/);
  const xG = parseFloat(xGDataSplit[0]) || 0;
  const xGVariation = (xGData.includes('-') ? -xGDataSplit[1] : parseFloat(xGDataSplit[1])) || 0;
  const goals = parseInt($data('#player-groups .table-total td:nth-child(6)').text().trim()) || 0;

  return {
    id: playerId,
    name: playerName,
    team,
    goals,
    xG,
    xGVariation,
  };
}

async function main() {
  const start = new Date();
  const playerData = [];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < 10; i++) {
    const playerId = Math.floor(Math.random() * 10000);
    playerData.push(await fetchPlayerStats(playerId, page));
  }

  await browser.close();

  console.log(playerData);
  console.log(new Date() - start);
}

main();
