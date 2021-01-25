/* Import Dependencies */
const Discord = require('discord.js')
const client = new Discord.Client({
  shards: 'auto'
})

if (process.argv.includes('-d')) client.settings = require('./settings/dev_settings.json')
else client.settings = require('./settings/prod_settings.json')

/* client extras */
client.Discord = require('discord.js') // For collections & embeds etc
client.requester = {}
client.extends = {}
client.commands = new Discord.Collection()

/* Import Libraries */
require('./library/requester.js')(client)
require('./library/client_extends.js')(client)
require('./library/events.js')(client)

/* Try to connect to discord api */
client.login(client.settings.token)
  .then(console.log('Connecting to discord.'))
  .catch(e => console.log(`Error connecting to discord: ${e}`))
