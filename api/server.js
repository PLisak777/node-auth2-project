const express = require('express');
const session = require('express-session')
const cors = require('cors');
const helmet = require('helmet');
const KnexSessionStore = require('connect-session-knex')(session)

const userRouter = require('../users/userRouter');
const authRouter = require('../auth/authRouter');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

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
		knex: require('../data/db-config'),
		tableName: 'sessions',
		sidFieldName: 'sid',
		createTable: true,
		clearInterval: 1000 * 60 * 60
	})
}

server.use(session(sessionConfig))
server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up' })
})

module.exports = server;
