const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const restricted = require('../api/restricted-middleware');
const Users = require('./user-model');

router.get('/users', (req, res) => {
	Users.findBy({ department: req.user.department }, [
		'id',
		'username',
		'department',
	])
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'Unable to retrieve users',
				error: err,
			});
		});
});

router.post('/register', (req, res) => {
	const { username, password, department } = req.body;
	const hash = bcrypt.hashSync(password);

	Users.add({ username, password: hash, department }).then((user) => {
		console.log(user);
		const token = generateToken(user);
		res
			.status(201)
			.json({
				bearer: token,
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					message: 'Unable to create new user',
					error: err,
				});
			});
	});
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.then(([user]) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.loggedIn = true;
				const token = generateToken(user);
				res.json({ bearer: token });
			} else res.status(401).send('You shall not pass');
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'Unable to log in',
				error: err,
			});
		});
});

router.post('/logout', (req, res) => {
	req.session.loggedIn = false;
	res.send('Bye Felicia');
});

router.get('/', (req, res) => {
	res.json({ api: 'running' });
});

module.exports = router;

function generateToken(user) {
	const payload = {
		userId: user.id,
		username: user.username,
		department: user.department,
	};

	const options = {
		expiresIn: '1d',
	};

	return jwt.sign(payload, restricted.secret, options);
}
