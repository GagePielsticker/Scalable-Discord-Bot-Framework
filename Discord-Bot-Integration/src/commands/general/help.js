module.exports.config = {
  requiredPermissions: [],
  help: {
    description: 'Shows bot help.',
    usage: 'help\nhelp {Command}'
  },
  requiresAPIConnection: false
}

module.exports.execute = async (client, message, args) => {
  /* Check if they are trying to pull up args on a specific command */
  if (args.length === 1) {
    if (client.commands.has(args[0].toLowerCase())) {
      const executedCMD = client.commands.get(args[0].toLowerCase())
      const reply = client.extends.quickEmbed(args[0].toLowerCase(), `**Description**\`\`\`\n${executedCMD.config.help.description}\`\`\`**Usage**\`\`\`\n${executedCMD.config.help.usage}\`\`\``)
        .setFooter(`${message.author.tag}`, message.author.avatarURL())
      message.channel.send(reply)
      return
    }
  }

  // Fetch our discord collection and turn it into an array
  const cmds = Array.from(client.commands)
  const sorted = {}

  /* Sorts our maps keys and loads all categories */
  cmds.forEach(cmd => {
    if (!sorted[cmd[1].category]) sorted[cmd[1].category] = [cmd[0]]
    else sorted[cmd[1].category].push(cmd[0])
  })

  /* Hide dev commands from output */
  delete sorted.dev

  /* Form our embed */
  const reply = client.extends.quickEmbed('Help', `Use \`${client.settings.prefix}help {command}\` to learn more about the command.`)
    .setFooter(`${message.author.tag}`, message.author.avatarURL())

  Object.keys(sorted).forEach(entry => {
    reply.addField(entry, `\`\`\`\n${sorted[entry].join('\n')}\`\`\``)
  })

  message.channel.send(reply)
}
