const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('./auth-model');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res, next) => {
	const user = req.body;
	try {
		const dbUser = await db.getUserByUsername(user.username);
		if (dbUser && bcrypt.compareSync(user.password, dbUser.password)) {
			res.status(200).json({
				username: dbUser.username,
				id: dbUser.id,
				token: await generateToken(dbUser),
			});
		} else {
			next({
				status: 403,
				message: 'You shall not pass!',
			});
		}
	} catch (err) {
		next({
			status: 500,
			message: 'Unexpected error on login',
		});
	}
});

router.post('/register', async (req, res, next) => {
	const user = req.body;
	try {
		user.password = bcrypt.hashSync(user.password, 12);
		const newUser = await db.addNewUser(user);
		newUser ? res.status(201).json({ 
            ...newUser, token: await generateToken(newUser) }) : next({ status: 400, message: 'Unable to create new user' })
	} catch (err) {
		next({ status: 400, message: 'Unable to create new user' })
	}
});

function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		department: user.department,
	};

	const secret = process.env.JWT_SECRET || 'Ain\t telling you';

	const options = {
		expiresIn: '1d',
	};

	return jwt.sign(payload, secret, options);
}

module.exports = router;
