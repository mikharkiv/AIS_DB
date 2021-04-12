const db = require("../db/DB");
const clientsUrl = '/api/clients';

const auth_token = require("./auth_midd");
const data_parse = require("./utility");

module.exports.initClientsViews = function(app) {

	app.get(clientsUrl + '/card-spent/', function (req, res) {
		db.clientsDB.getAllPurchasesSum().then((r) => res.send(JSON.stringify(r)));
	});


	//CRUD
	app.get(clientsUrl + '/', auth_token.authManager, function (req, res) {
		const perPage = 10;
		let count_items = 0;
		let page = parseInt(req.body.currPage);
		if (!page) {
			page = 1;
		}
		if (!req.body.searchQuery) {
			db.clientsDB.getAllCount()
				.then((r) => {
					let string = JSON.stringify(r);
					let json = JSON.parse(string);
					count_items = json[0].TotalCount;
				});
		}else{
			db.clientsDB.getAllCountSearch(req.body.searchQuery)
				.then((r) => {
					let string = JSON.stringify(r);
					let json = JSON.parse(string);
					count_items = json[0].TotalCount;
				});
		}
		if (!req.body.searchQuery) {
			db.clientsDB.getClientsLimit(perPage, perPage * (page - 1))
				.then((r) => {
					const total_pages = Math.ceil(count_items / perPage);
					if(count_items>perPage){
						count_items = count_items - perPage * (page - 1);
					}
					const results = r;
					res.json({
						"total_pages": total_pages,
						"count_items": count_items,
						"results": results
					});
				});
		} else {
			db.clientsDB.getClientsLimitSearch(perPage, perPage * (page - 1), req.body.searchQuery)
				.then((r) => {
					const total_pages = Math.ceil(count_items / perPage);
					if(count_items>perPage){
						count_items = count_items - perPage * (page - 1);
					}
					const results = r;
					res.json({
						"total_pages": total_pages,
						"count_items": count_items,
						"results": results
					});
				});
		}
	});


	app.get(clientsUrl + '/:cardNumber', auth_token.authManager, function (req, res) {
		db.clientsDB.getById(req.params.cardNumber)
			.then((r) => {
				if (r.length) {
					console.log(r);
					res.send(JSON.stringify(r));
				} else {
					res.status(400).send({message: "Bad Request"});
				}});
	});


	app.post(clientsUrl + '/', auth_token.authManager, function (req, res) {
		//check if we try to dublicate PK card_number
		db.clientsDB.getAllCountByID(req.body.card_number)
			.then((r) => {
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				count_items = json[0].TotalCount;
				if (count_items!=0) {
					res.status(400).send({message: "Bad Request"});
				} else {
					db.clientsDB.addClient(req.body.card_number, req.body.cust_surname, req.body.cust_name, req.body.cust_patronymic, req.body.phone_number, req.body.city, req.body.street, req.body.zip_code, req.body.percent)
						.then((r) => {
							if (!r.affectedRows) {
								res.status(400).send({message: "Bad Request"});
							} else {
								console.log(r);
								db.clientsDB.getById(req.body.card_number)
									.then((rr) => {
										console.log(rr);
										res.send(JSON.stringify(rr));
									});
							}});
				}});
	});

//cashier and manager both able to change custumer card
	app.put(clientsUrl + '/:cardNumber', auth_token.authenticateToken, function (req, res) {
		let json = JSON.parse(JSON.stringify(req.body));

		let attribute_arr = ["card_number", "cust_surname", "cust_name", "cust_patronymic", "phone_number", "city", "street", "zip_code", "percent"];

		let query_part = [];
		for (let key of attribute_arr){
			if(json[key]!==undefined) {
				query_part.push(key + "=\"" + json[key] + "\"");
			}
		}
		let query = query_part.join(", ");
		console.log(query);

		db.clientsDB.updateClient(query, req.params.cardNumber)
			.then((r) => {
				if (!r.affectedRows) {
					res.status(400).send({message: "Bad Request"});
				} else {
					console.log(r);
					db.clientsDB.getById(req.params.cardNumber)
						.then((rr)=> {
							console.log(rr);
							res.send(JSON.stringify(rr));
						});
				}
			});

	});


	app.delete(clientsUrl + '/:cardNumber', auth_token.authManager, function (req, res) {
		db.clientsDB.deleteById(req.params.cardNumber)
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
