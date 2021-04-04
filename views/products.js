const db = require("../db/DB");

const productsUrl = '/products';

module.exports.initProductsViews = function(app) {
	app.get(productsUrl + '/most-sold/', function (req, res) {
		db.productsDB.getProductMostSold().then((r) => res.send(JSON.stringify(r)));
	});
}
