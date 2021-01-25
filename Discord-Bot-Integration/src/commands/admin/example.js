
module.exports.config = {
  requiredPermissions: ['ADMINISTRATOR'], //Array of what perms the user should have to execute command
  help: {
    description: 'An example administrator command.',
    usage: 'example'
  },
  requiresAPIConnection: false //If the command should require a connection to our api
}

module.exports.execute = async (client, message, args) => {
    message.reply('Yep you have admin perms.')
}
