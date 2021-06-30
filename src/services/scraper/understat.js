const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const Promise = require('bluebird');

const Player = require('../../models/player');
const PlayerFormatter = require('../playerFormatter');

// TODO Put this into a config file
const NB_PLAYERS_TO_FETCH = 10;
const NB_PARALLEL_REQUESTS = 5;

class UnderstatScraper {
  constructor() {
    this.progressBar = new ProgressBar('[:bar] - :percent - :etas', {
      total: NB_PLAYERS_TO_FETCH,
      width: 120,
      head: '>',
      incomplete: ' ',
      clear: true,
    });
  }

  async init() {
    console.time('Init done');
    this.browser = await puppeteer.launch();
    console.timeEnd('Init done');
  }

  async close() {
    await this.browser.close();
  }

  async fetchPlayerStats(playerId) {
    const url = `https://understat.com/player/${playerId}`;

    const page = await this.browser.newPage();
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

    this.progressBar.tick();

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

  async fetchPlayersParallel() {
    console.time('Fetched players ');

    const playerData = [];
    const ids = [];
    for (let i = 0; i < NB_PLAYERS_TO_FETCH; i += 1) {
      ids.push(Math.floor(Math.random() * 10000));
    }

    await Promise.map(ids, (playerId) => {
      const data = this.fetchPlayerStats(playerId);
      return data;
    }, { concurrency: NB_PARALLEL_REQUESTS })
      .then((values) => {
        values.forEach((data) => {
          const player = new Player(data.id, data.name, data.team, data.stats);
          playerData.push(player);
        });
      })
      .catch((err) => console.error(`Error while getting players : ${err}`));

    PlayerFormatter.printPlayers(playerData, console.log);

    console.timeEnd('Fetched players ');

    return playerData;
  }
}

module.exports = UnderstatScraper;
