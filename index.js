const express = require('express')
const database = require('./config/database')
require('dotenv').config()
const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')
const systemConfig = require('./config/system')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()

port = process.env.PORT
database.connect()

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use(express.static(`${__dirname}/public`))

// use express-flash

app.use(cookieParser('authToken'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash())

// end express-flash

// use method-override
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// app locals
app.locals.prefixAdmin = systemConfig.prefixAdmin

// route client
route(app)

// route admin
routeAdmin(app)

app.listen(port, () => {
  console.log('lắng nghe thành công')
})
