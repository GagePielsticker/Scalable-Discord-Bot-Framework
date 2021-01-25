
'use strict'

/**
 * Dependencies
 */
const express = require('express')
const router = express.Router()

module.exports = client => {
  /* Our main index endpoiny */
  router.get('/', (req, res) => {

    res.send('Welcome to the api.')
  })

  /* Our healthcheck endpoint */
  router.get('/healthcheck', (req, res) => {
    res.json({ status: 'up' })
  })

  return router
}
