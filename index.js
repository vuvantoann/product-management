const express = require('express')
const database = require('./config/database')
require('dotenv').config()
const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')
const systemConfig = require('./config/system')
var methodOverride = require('method-override')

const app = express()

port = process.env.PORT
database.connect()

app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static('public'))

// use method-override
app.use(methodOverride('_method'))

// app locals
app.locals.prefixAdmin = systemConfig.prefixAdmin

// route client
route(app)

// route admin
routeAdmin(app)

app.listen(port, () => {
  console.log('lắng nghe thành công')
})
