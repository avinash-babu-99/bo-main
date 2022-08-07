const express = require('express')
const morgan = require('morgan')
const getRouter = require('./routes/getRoutes')



const app = express()

app.use(express.json())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})



app.use('/data', getRouter)


module.exports = app

