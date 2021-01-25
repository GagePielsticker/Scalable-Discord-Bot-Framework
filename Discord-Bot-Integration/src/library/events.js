module.exports = client => {
  /* Handles when bot connects to the api successfully */
  client.on('ready', () => {
    console.log('Successfully connected to the discord api.')
    client.extends.reloadCommands()
  })

  /* Handles the message event */
  client.on('message', message => {
    const args = message.content.split(' ')
    if (message.author.bot) return // Make sure they aren't a bot

    if (!message.content.startsWith(client.settings.prefix) && !message.mentions.has(client.user)) return // Make sure they used prefix or pinged us

    /* Handle if command is prefixed */
    if (message.content.startsWith(client.settings.prefix)) {
      const cmd = args[0].toLowerCase().replace(client.settings.prefix, '')
      client.extends.executeCommand(cmd, message, args.splice(1))
    }

    /* Handle if command is pinged */
    if (message.mentions.has(client.user)) {
      const cmd = args[1].toLowerCase()
      client.extends.executeCommand(cmd, message, args.splice(2))
    }
  })
}
