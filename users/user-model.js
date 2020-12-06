const db = require('knex')(require('../data/db-config'))

function getUsers(department) {
    return db('users')
        .select('id', 'username', 'department')
        .where({ department })
}

module.exports = {
    getUsers
}