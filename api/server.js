const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const userRouter = require('../users/userRouter');
const authRouter = require('../auth/authRouter');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
	res.json({ apt: 'Running' });
});

module.exports = server;
