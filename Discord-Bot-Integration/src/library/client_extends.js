/* Import Dependencies */
const fs = require('fs')

module.exports = client => {
  /**
   * Reload all commands to memory
   */
  client.extends.reloadCommands = () => {
    /* Clear our cache */
    client.commands = new client.Discord.Collection()

    /* Get all the command folders */
    fs.readdir(`${__dirname}\\..\\commands\\`, (err, folders) => {
      if (err) return console.log('Error reloading commands.')
      folders.forEach(folder => {
        /* Get all command files */
        fs.readdir(`${__dirname}\\..\\commands\\${folder}`, (err, files) => {
          if (err) return console.log('Error reloading commands.')
          files.forEach(commandFile => {
            /* QoL Reassignment */
            const commandName = commandFile.toLowerCase().replace('.js', '')
            const category = folder.toLowerCase()

            /* Put it in the collection */
            client.commands.set(commandName, {
              category,
              execute: require(`../commands/${folder}/${commandFile}`).execute,
              config: require(`../commands/${folder}/${commandFile}`).config
            })
            console.log(`Loaded Command: ${commandName} - Category: ${category}`)
          })
        })
      })
    })
  }

  /**
   * Returns a formatted embed object
   * @param {String} title
   * @param {String} str
   */
  client.extends.quickEmbed = (title, str) => {
    return new client.Discord.MessageEmbed()
      .setColor(client.settings.embed_color)
      .setTitle(title)
      .setDescription(str)
      .setTimestamp()
  }

  /**
   * Executes command for user
   * @param {String} cmd
   * @param {Object} message
   */
  client.extends.executeCommand = async (cmd, message, args) => {
    
    if (!client.commands.has(cmd)) {
      const reply = client.extends.quickEmbed('Error', `The Command \`${cmd}\` does not exist.`)
        .setFooter(`${message.author.tag}`, message.author.avatarURL())
      message.channel.send(reply)
      return
    }

    const command = client.commands.get(cmd)

    /* Permission checking */
    let lock = true
    if (command.config.requiredPermissions.length !== 0) {
      command.config.requiredPermissions.forEach(perm => {
        if (!message.member.hasPermission(perm)) {
          const reply = client.extends.quickEmbed('Error', `You do not have the necessary permission. Required permission: \`${perm}\``)
            .setFooter(`${message.author.tag}`, message.author.avatarURL())
          message.channel.send(reply)
          lock = false
        }
      })
    }
    if(!lock) return

    /* Api alive checking */
    if (command.config.requiresAPIConnection) {
      const a = await client.requester.healthCheck()
        .then(true)
        .catch(e => false)
      if (!a) {
        const reply = client.extends.quickEmbed('Error', 'Could not connect to our backend API. Please try again later.')
          .setFooter(`${message.author.tag}`, message.author.avatarURL())
        message.channel.send(reply)
        return
      }
    }

    /* Dev category checking */
    if (command.category === 'dev') {
      if (!client.settings.developers.includes(message.author.id)) {
        const reply = client.extends.quickEmbed('Error', 'This command is locked to developers only.')
          .setFooter(`${message.author.tag}`, message.author.avatarURL())
        message.channel.send(reply)
        return
      }
    }

    console.log(`Command: ${message.author.tag} - ${cmd}`)
    command.execute(client, message, args)
  }
}
