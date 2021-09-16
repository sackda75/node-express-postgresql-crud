const express = require('express')
const router = express.Router()
const { getUsers, getRegister, getLogin, getDashboard, logout, postRegister, postLogin, deleteUser } = require('../controllers/controller')

router.get('/users', getUsers)
router.get('/register', checkAuthenticated, getRegister)
router.get('/login', checkAuthenticated, getLogin)
router.get('/dashboard', checkNotAuthenticated, getDashboard)
router.get('/logout', logout)
router.post('/register', postRegister)
router.post('/login', postLogin)
router.delete('/:id', deleteUser)

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/users/dashboard')
	}
	next()
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/users/login')
}

module.exports = router
