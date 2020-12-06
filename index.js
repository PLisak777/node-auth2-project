require('dotenv').config();

const server = require('./api/server')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 4000

server.listen(host, port, () => {
    console.log(`Listening on ${host}:${port}`)
})