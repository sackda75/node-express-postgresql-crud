const bcrypt = require('bcrypt')
const pool = require('../config/db')
const passport = require('passport')

module.exports.getUsers = (req, res) => {
	pool.query(`Select * from users1`, (err, result) => {
		if (!err) {
			console.log(result.rows)
			return res.status(200).send(result.rows)
		} else {
			console.log('Something went wrong'.red)
		}
	})
}

module.exports.getRegister = (req, res) => {
	res.render('register')
}

module.exports.getLogin = (req, res) => {
	res.render('login')
}

module.exports.getDashboard = (req, res) => {
	console.log('L25'.cyan, req.isAuthenticated())
	res.render('dashboard', { user: req.user.name })
}

module.exports.logout = (req, res) => {
	req.logOut()
	req.flash('success_msg', 'You have logged out')
	res.redirect('/users/login')
}

module.exports.postRegister = async (req, res) => {
	let { name, email, password, password2 } = req.body
	console.log('L37'.cyan, name, email, password, password2)
	let errors = []
	if (!name || !email || !password || !password2) {
		errors.push({ message: '⛔ Please enter all fields' })
	}
	if (password.length < 6) {
		errors.push({ message: '⛔ Password should be at least 6 characters' })
	}
	if (password != password2) {
		errors.push({ message: '⛔ Passwords do not match' })
	}
	if (errors.length > 0) {
		res.render('register', { errors })
	} else {
		const hashedPassword = await bcrypt.hash(password, 10)
		console.log('L52'.cyan, hashedPassword)
		pool.query(`SELECT * from users1 WHERE email = $1`, [ email ], (err, results) => {
			if (err) {
				throw err
			}
			console.log('L57'.cyan, results.rows)
			if (results.rows.length > 0) {
				errors.push({ message: '⛔ Email already registered' })
				res.render('register', { errors })
			} else {
				pool.query(
					`INSERT INTO users1 (name, email, password)
					 VALUES ($1, $2, $3)
					 RETURNING id, password`,
					[ name, email, hashedPassword ],
					(err, results) => {
						if (err) {
							throw err
						}
						console.log('L71'.cyan, results.rows)
						req.flash('success_msg', 'You are now registered. Please log in')
						res.redirect('/users/login')
					}
				)
			}
		})
	}
}

module.exports.postLogin = passport.authenticate('local', {
	successRedirect: '/users/dashboard',
	failureRedirect: '/users/login',
	failureFlash: true
})

module.exports.deleteUser = (req, res) => {
  let insertQuery = `DELETE from users1 WHERE id=${req.params.id}`
  pool.query(insertQuery, (err, results) => {
    if (!err) {
      console.log(`User with the id ${req.params.id} deleted successfully`.green)
      return res.status(200).send(`User with the id ${req.params.id} deleted successfully`)
    } else {
      console.log('Someting went wrong'.red)
    }
  })
  pool.end
}
