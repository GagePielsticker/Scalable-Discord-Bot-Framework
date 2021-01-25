'use strict'

const express = require('express')
const app = express()
const helmet = require('helmet')
const safeCompare = require('safe-compare')
const xss = require('xss-clean')
const bodyParser = require('body-parser')
const morgan = require('morgan')

/* Configure our rest client */
const client = {
  apiSettings: require('./settings/api_settings.json'),
  appid: process.env.APPID,
  engine: {}
}

app.use(helmet())
app.use(morgan('common'))
app.set('trust proxy', 1)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(xss())

/* Require our engines/libs and pass our client */
require('./library/database.js')(client)
require('./library/engine.js')(client)

/* Routing */

// Public endpoints
app.use('/', require('./routes/index.js')(client))

// Auth Middleware
app.use('/', (req, res, next) => {
  if (safeCompare(req.header('secretKey'), client.apiSettings.api.secretKey)) next()
  else return res.status(403).json({ status: 'Unauthorized' })
})

// Private endpoints
app.use('/stats', require('./routes/stats.js')(client))

/* Listen on http */
app.listen(client.apiSettings.api.port, () => {
  console.log(`API ${client.appid} listening on port ${client.apiSettings.api.port}!`)

  // Connection loop to connect to mongodb
  console.log('Attempting to connect to database')
  client.connectDatabase()
    .then(() => {
      console.log('Connected database.')
    })
    .catch(() => {
      console.log('Failed to connect to database. Shutting down.')
      process.exit(1)
    })
})
