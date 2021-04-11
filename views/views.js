const {initClientsViews} = require("./clients");
const {initEmployeesViews} = require("./employees");
const {initProductsViews} = require("./products");
const {initStoreProductsViews} = require("./store_products");
const {initCategoriesViews} = require("./categories");
const {initAuthViews} = require("./auth");

module.exports.initViews = function (app) {
	initClientsViews(app);
	initEmployeesViews(app);
	initProductsViews(app);
	initStoreProductsViews(app);
	initCategoriesViews(app);
	initAuthViews(app);
	console.log('All views inited');
}
