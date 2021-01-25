'use strict'

const MongoClient = require('mongodb').MongoClient
module.exports = client => {
  /**
   * Connects mongoose to our mongodb database defined in the api settings
   * @returns {Promise}
   */
  client.connectDatabase = () => {
    return new Promise((resolve, reject) => {
      const { host, port, database, username, password, reconnect_attempts, reconnect_interval } = client.apiSettings.mongodb
      MongoClient.connect(`mongodb://${username ? `${username}:${password}@` : ''}${host}:${port}`, {
        useNewUrlParser: true,
        // retry to connect for 60 times
        reconnectTries: reconnect_attempts,
        // wait 1 second before retrying
        reconnectInterval: reconnect_interval
      }, async (err, data) => {
        if (err) reject(new Error(err))
        client.database = data.db(database)
        resolve()
      })
    })
  }
}
