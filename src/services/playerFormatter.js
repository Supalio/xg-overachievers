const chalk = require('chalk');

const TOTAL_LENGTH = 98;
const ID_LENGTH = 5;
const NAME_LENGTH = 28;
const TEAM_LENGTH = 28;
const GOALS_LENGTH = 5;
const XG_LENGTH = 6;
const VARIATION_LENGTH = 9;

const formatStringWithMaxLength = (str, maxLength) => {
  let formattedString = str;
  if (str.length > maxLength) {
    formattedString = str.slice(0, maxLength - 3).concat('...');
  }
  return formattedString.padEnd(maxLength, ' ').slice(0, maxLength);
};

class PlayerFormatter {
  static playerString(player) {
    const sep = `${chalk.yellow('|')}`;
    const id = formatStringWithMaxLength(player.id.toString(), ID_LENGTH);
    const name = formatStringWithMaxLength(player.name, NAME_LENGTH);
    const team = formatStringWithMaxLength(player.team, TEAM_LENGTH);
    const goals = formatStringWithMaxLength(player.stats.goals.toString(), GOALS_LENGTH);
    const xG = formatStringWithMaxLength(player.stats.xG.toString(), XG_LENGTH);
    const variation = (player.stats.xGVariation > 0)
      ? chalk.redBright(player.stats.xGVariation.toString().padEnd(VARIATION_LENGTH, ' '))
      : chalk.greenBright(player.stats.xGVariation.toString().padEnd(VARIATION_LENGTH, ' '));

    return `${sep} ${id} ${sep} ${name} ${sep} ${team} ${sep} ${goals} ${sep} ${xG} ${sep} ${variation} ${sep}`;
  }

  static headerRow() {
    const sep = chalk.yellow('|');
    const headerLine = `|${'-'.padEnd(TOTAL_LENGTH, '-')}|`;
    const id = 'ID'.padEnd(ID_LENGTH, ' ');
    const name = 'Name'.padEnd(NAME_LENGTH, ' ');
    const team = 'Team'.padEnd(TEAM_LENGTH, ' ');
    const goals = 'Goals'.padEnd(GOALS_LENGTH, ' ');
    const xG = 'xG'.padEnd(XG_LENGTH, ' ');
    const variation = 'Variation'.padEnd(VARIATION_LENGTH, ' ');

    return `${chalk.yellow(headerLine)}
${sep} ${chalk.blue.bold(id)} ${sep} ${chalk.blue.bold(name)} ${sep} ${chalk.blue.bold(team)} ${sep} ${chalk.blue.bold(goals)} ${sep} ${chalk.blue.bold(xG)} ${sep} ${chalk.blue.bold(variation)} ${sep}
${chalk.yellow(headerLine)}`;
  }

  static footerRow() {
    return chalk.yellow(`|${'-'.padEnd(TOTAL_LENGTH, '-')}|`);
  }

  static printPlayers(players, logFn) {
    logFn(this.headerRow());
    players.forEach((player) => logFn(this.playerString(player)));
    logFn(this.footerRow());
  }
}

module.exports = PlayerFormatter;
