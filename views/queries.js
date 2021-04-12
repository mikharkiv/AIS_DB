const db = require("../db/DB");
const queries = require('../db/DBRequests').queries;

const queriesUrl = '/queries';
const moment = require('moment');

module.exports.initQueries = function(app) {

	app.post(queriesUrl + '/:num', function (req, res) {
		// filter number
		if (req.params.num < 1 || req.params.num > 33) res.sendStatus(400);

		// read params
		let query = queries[req.params.num - 1];
		let par = req.body.par;
		let par1 = req.body.par1;
		let par2 = req.body.par2;
		let par3 = req.body.par3;

		// filter date
		if (req.params.num === 13|| req.params.num === 15 || req.params.num === 17 || req.params.num === 21) {
			par2 = moment(par2, 'DD.MM.YYYY').format('YYYY-MM-DD').toString();
			par3 = moment(par3, 'DD.MM.YYYY').format('YYYY-MM-DD').toString();
		}
		if (req.params.num === 14|| req.params.num === 16) {
			par1 = moment(par1, 'DD.MM.YYYY').format('YYYY-MM-DD').toString();
			par2 = moment(par2, 'DD.MM.YYYY').format('YYYY-MM-DD').toString();
		}
		par && (query = query.replace('%PAR%', par));
		par1 && (query = query.replace('%PAR1%', par1));
		par2 && (query = query.replace('%PAR2%', par2));
		par3 && (query = query.replace('%PAR3%', par3));

		db.query(query).then((r) => {
			res.send(JSON.stringify(r))
		});
	});
}
