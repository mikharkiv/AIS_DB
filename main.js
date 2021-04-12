const {initDB, query} = require("./db/DB");

const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.json())
require('dotenv').config()

const {initViews} = require("./views/views");

main();

async function main() {
	await initDB();
	setupExpress();

	app.listen(port,  () => {
		console.log(`Listening http://localhost:${port}`);
	});
}

function setupExpress() {
	initViews(app);
}
