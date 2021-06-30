const UnderstatScraper = require('./services/scraper/understat');

(async () => {
  const understatScraper = new UnderstatScraper();
  await understatScraper.init();
  await understatScraper.fetchPlayersParallel();
  await understatScraper.close();
})();
