	const db = require("../db/DB");

	const productsUrl = '/products';

	const auth_token = require("./auth_midd");

	module.exports.initProductsViews = function(app) {
		app.get(productsUrl + '/most-sold/', function (req, res) {
			db.productsDB.getProductMostSold().then((r) => res.send(JSON.stringify(r)));
		});
		// Postnikov
		app.get(productsUrl + '/categories-sellssum/', function (req, res) {
			db.productsDB.getProductsCategoriesSellsSum().then((r) => res.send(JSON.stringify(r)));
		});


		//CRUD
		app.get(productsUrl + '/', auth_token.authManager, function (req, res) {

			const perPage = 10;
			let count_items = 0;
			let page = parseInt(req.params.currPage);
			if (!page) {
				page = 1;
			}
			db.productsDB.getAllCount()
				.then((r) => {
					let string = JSON.stringify(r);
					let json = JSON.parse(string);
					count_items = json[0].TotalCount;
				});
			db.productsDB.getProductsLimit(perPage, perPage * (page - 1))
				.then((r) => {

					//const count_items = r.count;
					const total_pages = Math.ceil(count_items / perPage);
					const results = r;
					res.json({
						"total_pages": total_pages,	//tested
						"count_items": count_items,
						"results": results
					});
				});
		});


		app.get(productsUrl + '/:productId', auth_token.authManager, function (req, res) {
			db.productsDB.getById(req.params.productId)
				.then((r) => {
					if (r.length) {
						console.log(r);
						res.send(JSON.stringify(r));
					} else {
						res.status(400).send({message: "Bad Request"});
					}
				});
		});


		app.post(productsUrl + '/', auth_token.authManager, function (req, res) {
			if(!req.body.category_number || !req.body.product_name || !req.body.developer || !req.body.characteristics){
				res.status(400).send({message: "Bad Request"});
			}else {
				db.productsDB.addProduct(req.body.category_number, req.body.product_name, req.body.developer, req.body.characteristics)
					.then((r) => {
						if (!r.affectedRows) {
							res.status(400).send({message: "Bad Request"});
						} else {
							console.log(r);
							db.productsDB.getById(r.insertId)
								.then((rr) => {
									console.log(rr);
									res.send(JSON.stringify(rr));
								});
						}
					});
			}
		});


		app.put(productsUrl + '/:productId', auth_token.authManager, function (req, res) {
			let json = JSON.parse(JSON.stringify(req.body));
			let attribute_arr = ["category_number", "product_name", "developer", "characteristics"];

			let query_part = [];
			for (let key of attribute_arr) {
				if (json[key] !== undefined) {
					query_part.push(key + "=\"" + json[key] + "\"");
				}
			}
			let query = query_part.join(", ");
			console.log(query);

			db.productsDB.updateProduct(query, req.params.productId)
				.then((r) => {
					if (!r.affectedRows) {
						res.status(400).send({message: "Bad Request"});
					} else {
						console.log(r);
						db.productsDB.getById(req.params.productId)
							.then((rr) => {
								console.log(rr);
								res.send(JSON.stringify(rr));
							});
					}
				});

		});


		app.delete(productsUrl + '/:productId', auth_token.authManager, function (req, res) {

			db.productsDB.deleteById(req.params.productId)
				.then((r) => {
					if (!r.affectedRows) {
						res.status(400).send({message: "Bad Request"});
					} else {
						res.status(200).send({message: "OK"});
					}
				})
				.catch((error) => {
					res.status(400).send({message: "Bad Request"});
				});
		});
	}
