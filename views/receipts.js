const db = require("../db/DB");
const receiptsUrl = '/receipts';
const auth_token = require("./auth_midd");

module.exports.initReceiptsViews = function(app) {

	//CRUD
	app.get(receiptsUrl + '/', auth_token.authenticateToken, function (req, res) {
		const perPage = 10;
		let count_items = 0;
		let page = parseInt(req.body.currPage);
		if (!page) {
			page = 1;
		}
		db.receiptsDB.getAllCount()
			.then((r) => {
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				count_items = json[0].TotalCount;
			});
		db.receiptsDB.getReceiptLimit(perPage, perPage * (page - 1))
			.then((r) => {
				const total_pages = Math.ceil(count_items / perPage);
				if (count_items > perPage) {
					count_items = count_items - perPage * (page - 1);
				}
				const results = r;
				res.json({
					"total_pages": total_pages,
					"count_items": count_items,
					"results": results
				});
			});
	});


	app.get(receiptsUrl + '/:check_number', auth_token.authenticateToken, function (req, res) {
		db.receiptsDB.getById(req.params.check_number)
			.then((r) => {
				if (r.length) {
					console.log(r);
					res.send(JSON.stringify(r));
				} else {
					res.status(400).send({message: "Bad Request"});
				}
			});
	});


	app.post(receiptsUrl + '/', auth_token.authenticateToken, function (req, res) {
		db.receiptsDB.getAllCountByID(req.body.check_number)
			.then((r) => {
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				count_items = json[0].TotalCount;
				if (count_items != 0) {
					res.status(400).send({message: "Bad Request"});
				} else {
					db.receiptsDB.addReceipt(req.body.check_number, req.body.id_employee, req.body.card_number, req.body.print_date, req.body.sum_total)
						.then((r) => {
							if (!r.affectedRows) {
								res.status(400).send({message: "Bad Request"});
							} else {
								console.log(r);
								db.receiptsDB.getById(req.body.check_number)
									.then((rr) => {
										console.log(rr);
										res.send(JSON.stringify(rr));
									});
							}
						});
				}
			});
	});


	app.put(receiptsUrl + '/:check_number', auth_token.authenticateToken, function (req, res) {
		let json = JSON.parse(JSON.stringify(req.body));

		let attribute_arr = ["check_number", "id_employee", "card_number", "print_date", "sum_total"];

		let query_part = [];
		for (let key of attribute_arr) {
			if (json[key] !== undefined) {
				query_part.push(key + "=\"" + json[key] + "\"");
			}
		}
		let query = query_part.join(", ");
		console.log(query);
		db.receiptsDB.updateReceipt(query, req.params.check_number)
			.then((r) => {
				if (!r.affectedRows) {
					res.status(400).send({message: "Bad Request"});
				} else {
					console.log(r);
					db.receiptsDB.getById(req.params.check_number)
						.then((rr) => {
							console.log(rr);
							res.send(JSON.stringify(rr));
						});
				}});
	});


	app.delete(receiptsUrl + '/:check_number', auth_token.authManager, function (req, res) {
		db.receiptsDB.deleteById(req.params.check_number)
			.then((r) => {
				if (!r.affectedRows) {
					res.status(400).send({message: "Bad Request"});
				} else {
					res.status(200).send({message: "OK"});
				}
			})
			.catch(error => {
				res.status(400).send({message: "Bad Request"});
			});
	});
}

