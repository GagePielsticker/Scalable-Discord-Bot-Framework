/* Import Dependencies */
const axios = require('axios')

module.exports = client => {
  /* Configure our client to work with the requester */
  const apiURL = `http://${client.settings.api.host}:${client.settings.api.port}`

  /* Create a bsae isntance config for axios */
  const instance = axios.create({
    baseURL: apiURL,
    timeout: client.settings.api.request_timeout,
    headers: {
      secretKey: client.settings.api.secret
    }
  })

  /* Healthcheck */
  client.requester.healthCheck = () => {
    return new Promise((resolve, reject) => {
      instance.get('/healthCheck')
        .then(res => {
          if (res.data && res.data.status === 'up') resolve(true)
          else reject(new Error('Unexpected Response from api.'))
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  // /* Automatically hits our stat endpoint with data, uses its own instance */
  client.requester.statPoster = setInterval(() => {
    if (process.argv.includes('-d')) return // Dont post stats if we are in dev mode

    instance.post('/stats/bot', {
      guilds: client.guilds.cache.size,
      users: client.users.cache.size,
      shards: parseInt(client.options.shards) + 1
    })
      .then(res => {
        if (res.data.status === 'success') console.log('Successfully posted stats to api.')
        else console.log('Unexpected Response from api.')
      })
      .catch(e => console.log(`Error sending post request to api: ${e}`))
  }, client.settings.api.stat_post_ms)

}
