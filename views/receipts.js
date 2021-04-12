const db = require("../db/DB");
const receiptsUrl = '/api/receipts';
const auth_token = require("./auth_midd");
const date_parse = require("./utility");
const moment = require('moment');

const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET  = "cvkhjbklit654o9p9poh1qkwlsxam"

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
			.then(async function (r) {
				const total_pages = Math.ceil(count_items / perPage);
				if (count_items > perPage) {
					count_items = count_items - perPage * (page - 1);
				}
				//const results = date_parse.changeDateCheckArray(r);
				//additional info
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				let results = [];
				for (let i=0; i<json.length; i++) {
					let items_str = await db.receiptsDB.getProducts(json[i].check_number);
					let items = [];
					for (let j = 0; j < items_str.length; j++) {
						let pr = (await db.storeProductsDB.getById(items_str[j]['store-product']))[0];
						let pr_pr = (await db.productsDB.getById(pr.id_product))[0];
						let pr_cat = (await db.categoriesDB.getById(pr_pr.category_number))[0];
						pr_pr['category_number'] = pr_cat;
						pr['id_product'] = pr_pr;
						items.push({product: pr, count: items_str[j].count});
					}
					// let receipt_data = date_parse.changeDateCheck(r);
					let obj = json[i];
					obj['products'] = items;
					obj['id_employee'] = (await db.employeesDB.getById(obj['id_employee']))[0];
					obj.hasOwnProperty('card_number') && (
						obj['card_number'] = (await db.clientsDB.getById(obj['card_number']))[0]
					);
					obj['print_date'] = moment(obj['print_date']).format('DD.MM.YYYY').toString();
					results.push(obj);
				}
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
					db.receiptsDB.getProducts(req.params.check_number)
						.then(async function (rr) {
							console.log(JSON.stringify(rr));
							let items_str = rr;
							let items = [];
							for (let j = 0; j < items_str.length; j++) {
								let pr = (await db.storeProductsDB.getById(items_str[j]['store-product']))[0];
								let pr_pr = (await db.productsDB.getById(pr.id_product))[0];
								let pr_cat = (await db.categoriesDB.getById(pr_pr.category_number))[0];
								pr_pr['category_number'] = pr_cat;
								pr['id_product'] = pr_pr;
								items.push({product: pr, count: items_str[j].count});
							}
							let obj = r[0];
							obj['products'] = items;
							obj['id_employee'] = (await db.employeesDB.getById(obj['id_employee']))[0];
							obj.hasOwnProperty('card_number') && (
								obj['card_number'] = (await db.clientsDB.getById(obj['card_number']))[0]
							);
							obj['print_date'] = moment(obj['print_date']).format('DD.MM.YYYY').toString();
							res.json(obj);
						});
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
					const authHeader = req.headers['authorization']
					const token = authHeader && authHeader.split(' ')[1]

					jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
						if (err) {
							console.log(err);
							return res.status(401).send({message: "Unauthorized"});
						}
						req.user = user;

					db.receiptsDB.addReceipt(req.body.check_number, req.user.id, req.body.card_number, req.body.print_date, req.body.sum_total)
						.then((r) => {
							if (!r.affectedRows) {
								res.status(400).send({message: "Bad Request"});
							} else {
								console.log(r);
								//additional info
								db.receiptsDB.getById(req.body.check_number)
									.then((rr) => {
										db.receiptsDB.getProducts(req.body.check_number)
											.then((rrr) => {
												console.log(JSON.stringify(rrr));
												let items_str = rrr;
												let receipt_data = date_parse.changeDateCheck(rr);
												res.json({
													receipt_data,
													"products": items_str
												});
											});
									});
							}
						});
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
							db.receiptsDB.getProducts(req.params.check_number)
								.then((rrr) => {
									console.log(JSON.stringify(rrr));
									let items_str = rrr;
									let receipt_data = date_parse.changeDateCheck(rr);
									res.json({
										receipt_data,
										"products": items_str
									});
								});
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

