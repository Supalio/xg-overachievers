const chalk = require('chalk');

const TOTAL_LENGTH = 98;
const ID_LENGTH = 5;
const NAME_LENGTH = 28;
const TEAM_LENGTH = 28;
const GOALS_LENGTH = 5;
const XG_LENGTH = 6;
const VARIATION_LENGTH = 9;

class PlayerFormatter {
  static playerString(player) {
    const sep = `${chalk.yellow('|')}`;
    const id = player.id.toString().padEnd(ID_LENGTH, ' ');
    const name = player.name.padEnd(NAME_LENGTH, ' ').slice(0, NAME_LENGTH);
    const team = player.team.padEnd(TEAM_LENGTH, ' ').slice(0, TEAM_LENGTH);
    const goals = player.stats.goals.toString().padEnd(GOALS_LENGTH, ' ');
    const xG = player.stats.xG.toString().padEnd(XG_LENGTH, ' ');
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
}

module.exports = PlayerFormatter;
