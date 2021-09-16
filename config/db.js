const { Pool } = require('pg')
const pwd = require('./pwd')

const pool = new Pool(
	{
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		port: process.env.DB_PORT,
		password: pwd.password,
		database: process.env.DB_DATABASE
	},
	console.log('PostgreSQL connected ✅'.magenta)
)

module.exports = pool
