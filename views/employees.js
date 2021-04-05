const db = require("../db/DB");
const employeesUrl = "/employees";

module.exports.initEmployeesViews = function (app) {
	app.get(employeesUrl + '/item-sold-count/:itemId', function (req, res) {
		db.employeesDB.getSoldItemCount(res.params.itemId).then((r) => res.send(JSON.stringify(r)));;
	});
	app.get(employeesUrl + '/every-product-sold/', function (req, res) {
		db.employeesDB.getSoldEveryItem().then((r) => res.send(JSON.stringify(r)));;
	});
	app.get(employeesUrl + '/biggest-sell-sum/', function (req, res) {
		db.employeesDB.getSoldMost().then((r) => res.send(JSON.stringify(r)));;
	});
	// Postnikov
	app.get(employeesUrl + '/worked-petrenko/', function (req, res) {
		db.employeesDB.getEmployeesWorkedWithPetrenko().then((r) => res.send(JSON.stringify(r)));;
	});
	app.get(employeesUrl + '/worked-petrenko-only/', function (req, res) {
		db.employeesDB.getEmployeesWorkedWithPetrenkoOnly().then((r) => res.send(JSON.stringify(r)));;
	});
	app.get(employeesUrl + '/biggest-percent-by-city/', function (req, res) {
		db.employeesDB.getEmployeesWorkedWithBiggestPercentByCity().then((r) => res.send(JSON.stringify(r)));;
	});
}
