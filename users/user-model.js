const db = require('../data/db-config');

module.exports = {
	add,
	find,
	findBy,
	findById,
};

function find() {
	return db('users').select('id', 'username', 'department').orderBy('id');
}

function findBy(filter, select) {
	return db('users').select(select).where(filter);
}

async function add(user) {
	const [id] = await db('users').insert(user, 'id');

	return findById(id);
}

function findById(id) {
	return db('users').where({ id }).first();
}
