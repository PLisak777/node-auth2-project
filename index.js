const server = require('./api/server');

const host = process.env.HOST || localhost;
const port = process.env.PORT || 4000;

server.listen(port, host, () => {
	console.log(`Listening on ${host}:${port}`);
});
