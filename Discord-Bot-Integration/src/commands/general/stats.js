/* Import Dependencies */
const si = require('systeminformation')
const humanizeDuration = require('humanize-duration')

module.exports.config = {
  requiredPermissions: ['ADMINISTRATOR'],
  help: {
    description: 'Shows the statistics of the bot.',
    usage: 'stats'
  },
  requiresAPIConnection: false
}

module.exports.execute = async (client, message, args) => {
  const cpu = await si.cpu()
  const mem = await si.mem()
  const operating = await si.osInfo()

  const reply = client.extends.quickEmbed('Stats', client.settings.bot_description)
    .addField('Users', `\`${client.users.cache.size}\``, true)
    .addField('Guilds', `\`${client.guilds.cache.size}\``, true)
    .addField('Language', '`NodeJS`', true)
    .addField('RAM\'s', `\`${Math.floor(mem.used / 1000000000)}gb/${Math.floor(mem.total / 1000000000)}gb\``, true)
    .addField('CPU', `\`${cpu.cores} Cores\``, true)
    .addField('Platform', `\`${operating.platform}\``, true)
    .addField('Shards', `\`${parseInt(client.options.shards) + 1}\``, true)
    .addField('Ping', `\`${client.ws.ping} ms\``, true)
    .addField('Uptime', `\`${humanizeDuration(client.uptime)}\``, true)
    .addField('Invite Link', `[Click Here](${client.settings.inviteURL})`, true)
    .addField('Support Server', `[Click Here](${client.settings.supportServer})`, true)
    .setFooter(`${message.author.tag}`, message.author.avatarURL())

  message.channel.send(reply)
}
