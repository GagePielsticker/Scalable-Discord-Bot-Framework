
'use strict'

/**
 * Dependencies
 */
const express = require('express')
const router = express.Router()

module.exports = client => {
  /* Our main index endpoint */
  router.get('/', (req, res) => {
    res.send('Welcome to the stats endpoint.')
  })

  /* Our bot stat endpoint */
  router.post('/bot', async (req, res) => {
    const guilds = req.body.guilds
    const users = req.body.guilds
    const shards = req.body.shards

    await client.database.collection('analytics').insertOne({
      guilds,
      users,
      shards,
      createdAt: +new Date()
    })
      .then(() => {
        res.json({ status: 'success' })
      })
      .catch(e => {
        res.json({ status: 'error', reason: `${e}` })
      })
  })

  return router
}
