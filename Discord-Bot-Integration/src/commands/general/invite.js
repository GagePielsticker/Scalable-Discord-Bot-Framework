module.exports.config = {
  requiredPermissions: [],
  help: {
    description: 'Shows invite for the bot.',
    usage: 'invite'
  },
  requiresAPIConnection: false
}

module.exports.execute = async (client, message, args) => {
  message.channel.send(client.settings.inviteURL)
}
