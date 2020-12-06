const express = require('express');
const session = require('express-session')
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const restricted = require('./restricted-middleware')
const KnexSessionStore = require('connect-session-knex')(session)

const db = require('../data/db-config')
const userRouter = require('../users/userRouter');

const server = express();

const sessionConfig = {
	name: 'plsession',
	secret: process.env.JWT_SECRET || 'secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 3600 * 1000,
		secure: false,
		httpOnly: true
	},
	store: new KnexSessionStore({
		knex: db,
		tableName: 'sessions',
		sidFieldName: 'sid',
		createTable: true,
		clearInterval: 1000 * 60 * 60
	})
}

server.use(express.json());
server.use(helmet());
server.use(cors({ credentials: true, origin: 'http://localhost:4000' }))
server.use(session(sessionConfig))
server.use('/api/users', validateJWT);
server.use('/api', userRouter);

module.exports = server;

function validateJWT(req, res, next) {
	console.log(req.headers)
	try {
		const token = req.headers.authorization.split(' ')[1]
		req.user = jwt.verify(token, restricted.secret)
		next()
	} catch (err) {
		console.log(err)
		next({
			code: 401,
			message: 'Invalid token'
		})
	}
}