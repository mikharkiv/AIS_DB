const db = require("../db/DB");

const clientsUrl = '/clients';

module.exports.initClientsViews = function(app) {
	app.get(clientsUrl + '/card-spent/', function (req, res) {
		db.clientsDB.getAllPurchasesSum().then((r) => res.send(JSON.stringify(r)));
	});
}
