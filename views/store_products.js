const db = require("../db/DB");
const storeProductsUrl = '/store-products';
const auth_token = require("./auth_midd");

module.exports.initStoreProductsViews = function(app) {

	//CRUD
	app.get(storeProductsUrl + '/', auth_token.authManager, function (req, res) {
		const perPage = 10;
		let count_items = 0;
		let page = parseInt(req.body.currPage);
		if (!page) {
			page = 1;
		}
		db.storeProductsDB.getAllCount()
			.then((r) => {
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				count_items = json[0].TotalCount;
			});
		db.storeProductsDB.getStoreProductsLimit(perPage, perPage * (page - 1))
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


	app.get(storeProductsUrl + '/:UPC', auth_token.authManager, function (req, res) {
		db.storeProductsDB.getById(req.params.UPC)
			.then((r) => {
				if (r.length) {
					console.log(r);
					res.send(JSON.stringify(r));
				} else {
					res.status(400).send({message: "Bad Request"});
				}
			});
	});


	app.post(storeProductsUrl + '/', auth_token.authManager, function (req, res) {
		//check if we try to dublicate PK upc
		if(req.body.UPC != req.body.UPC_prom){
			res.status(400).send({message: "Bad Request"});
		}
		db.storeProductsDB.getAllCountByID(req.body.UPC)
			.then((r) => {
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				count_items = json[0].TotalCount;
				if (count_items != 0) {
					res.status(400).send({message: "Bad Request"});
				} else {
					db.storeProductsDB.addStoreProduct(req.body.UPC, req.body.UPC_prom, req.body.id_product, req.body.selling_price, req.body.products_number, req.body.promotional_product)
						.then((r) => {
							if (!r.affectedRows) {
								res.status(400).send({message: "Bad Request"});
							} else {
								console.log(r);
								db.storeProductsDB.getById(req.body.UPC)
									.then((rr) => {
										console.log(rr);
										res.send(JSON.stringify(rr));
									});
							}
						});
				}
			});
	});


	app.put(storeProductsUrl + '/:UPC', auth_token.authManager, function (req, res) {
		let json = JSON.parse(JSON.stringify(req.body));
	//UPC, UPC_prom, id_product, selling_price, products_number, promotional_product
		let attribute_arr = ["UPC", "UPC_prom", "id_product", "selling_price", "products_number", "promotional_product"];

		let query_part = [];
		for (let key of attribute_arr) {
			if (json[key] !== undefined) {
				query_part.push(key + "=\"" + json[key] + "\"");
			}
		}
		let query = query_part.join(", ");
		console.log(query);
		db.storeProductsDB.updateStoreProduct(query, req.params.UPC)
			.then((r) => {
				if (!r.affectedRows) {
					res.status(400).send({message: "Bad Request"});
				} else {
					console.log(r);
					db.storeProductsDB.getById(req.params.UPC)
						.then((rr) => {
							console.log(rr);
							res.send(JSON.stringify(rr));
						});
				}});
	});


	app.delete(storeProductsUrl + '/:UPC', auth_token.authManager, function (req, res) {
		db.storeProductsDB.deleteById(req.params.UPC)
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
