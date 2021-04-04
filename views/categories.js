const db = require("../db/DB");

const categoriesUrl = '/categories';

module.exports.initCategoriesViews = function(app) {
	app.get(categoriesUrl + '/all/', function (req, res) {
		db.categoriesDB.getAllCategories().then((r) => {
			console.log(r);
			res.send(JSON.stringify(r))
		});
	});
}
