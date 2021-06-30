const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const ProgressBar = require('progress');

const Player = require('../../models/Player');
const PlayerFormatter = require('../player_formatter');

// TODO Put this into a config file
const NB_PLAYERS_TO_FETCH = 10;

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
  const goals = parseInt($data('#player-groups .table-total td:nth-child(6)').text().trim(), 10) || 0;

  return {
    id: playerId,
    name: playerName,
    team,
    stats: {
      goals,
      xG,
      xGVariation,
    },
  };
}

async function main() {
  console.time('Fetching players ');
  const playerData = [];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const bar = new ProgressBar('[:bar] - :percent - :etas', {
    total: NB_PLAYERS_TO_FETCH,
    width: 120,
    head: '>',
    incomplete: ' ',
    clear: true,
  });

  for (let i = 0; i < NB_PLAYERS_TO_FETCH; i += 1) {
    const playerId = Math.floor(Math.random() * 10000);
    const data = await fetchPlayerStats(playerId, page);
    const player = new Player(data.id, data.name, data.team, data.stats);
    playerData.push(player);
    bar.tick();
  }

  await browser.close();

  console.log(PlayerFormatter.headerRow());
  playerData.forEach((player) => console.log(PlayerFormatter.playerString(player)));
  console.log(PlayerFormatter.footerRow());

  console.timeEnd('Fetching players ');
}

main();
