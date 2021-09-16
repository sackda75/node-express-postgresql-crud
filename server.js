require('dotenv').config({ path: './config/.env' })
const express = require('express')
const app = express()
const session = require('express-session')
const flash = require('express-flash')
const colors = require('colors')
const passport = require('passport')
const pool = require('./config/db')
const logger = require('./middleware/logger')
const allRoutes = require('./routes/route')
const PORT = process.env.PORT || 3001
const initializePassport = require('./middleware/passportConfig')

pool.connect()
initializePassport(passport)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
)
app.use(express.static('public'))
app.use(logger)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.get('/', (req, res) => {
	res.render('index')
})

app.use('/users', allRoutes)

app.use((req, res) => {
	console.log(`404 Error : Page not found`.red, colors.enabled)
	res.status(404).render('404', { title: '404 Error' })
})

app.listen(PORT, () => {
	console.log(`Running on port ${PORT} ✅`.cyan)
})
