const db = require("../db/DB");

const categoriesUrl = '/categories';

module.exports.initCategoriesViews = function(app) {

	app.get(categoriesUrl + '/all/', function (req, res) {
		db.categoriesDB.getAllCategories().then((r) => {
			console.log(r);
			res.send(JSON.stringify(r))
		});
	});


	//CRUD

	app.get(categoriesUrl + '/', function (req, res, next) {

		const perPage = 2;
		let count_items = 0;
		let page = parseInt(req.params.currPage);
		if (!page) {
			page = 1;
		}
		db.categoriesDB.getAllCount()
			.then((r) => {
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				count_items = json[0].TotalCount;
			});
			db.categoriesDB.getCategoriesLimit(perPage, perPage * page)
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


	app.get(categoriesUrl + '/:categoryId', function (req, res) {
		db.categoriesDB.getById(req.params.categoryId)
			.then((r) => {
				if (r.length) {
					console.log(r);
					//serialise
					res.send(JSON.stringify(r));
				} else {
					res.status(400).send({message: "Bad Request"});
				}
			});
	});

	app.post(categoriesUrl + '/', function (req, res) {
		db.categoriesDB.addCategory(req.body.categoryName)
			.then((r) => {
				//check if categoryName not empty and insert was successful
				if (!r.affectedRows || !req.body.categoryName) {
					res.status(400).send({message: "Bad Request"});
				} else {
					console.log(r);
					//serialise
					res.send(JSON.stringify(r));
				}
			});
	});

	app.put(categoriesUrl + '/', function (req, res) {
		db.categoriesDB.updateCategory(req.body.categoryName, req.body.categoryId)
			.then((r) => {
				if (!r.affectedRows) {
					res.status(400).send({message: "Bad Request"});
				} else {
					console.log(r);
					//serialise
					res.send(JSON.stringify(r));
				}
			});
	});

	app.delete(categoriesUrl + '/:categoryId', function (req, res) {
		db.categoriesDB.deleteById(req.params.categoryId)
			.then((r) => {
				if (!r.affectedRows) {
					res.status(400).send({message: "Bad Request"});
				} else {
					res.status(200).send({message: "OK"});
				}
			});
	});
}
