
'use strict'

/**
 * Dependencies
 */
const express = require('express')
const router = express.Router()
var filterXSS = require('xss-clean/lib/xss').clean

module.exports = client => {
  /* Our main index endpoiny */
  router.get('/', (req, res) => {
    // filterXSS('string')  manual xss filtering

    res.send('Welcome to the api.')
  })

  /* Our healthcheck endpoint */
  router.get('/healthcheck', (req, res) => {
    res.json({ status: 'up' })
  })

  return router
}
