const {initDB, query} = require("./db/DB");

const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.json())

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
	// CORS
	app.use(cors());
	app.options('*', cors());
	initViews(app);
}
