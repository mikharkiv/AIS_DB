const {initClientsViews} = require("./clients");
const {initEmployeesViews} = require("./employees");
const {initProductsViews} = require("./products");
const {initStoreProductsViews} = require("./store_products");
const {initCategoriesViews} = require("./categories");
const {initReceiptsViews} = require("./receipts");
const {initAuthViews} = require("./auth");
const {initQueries} = require("./queries");

module.exports.initViews = function (app) {
	initClientsViews(app);
	initEmployeesViews(app);
	initProductsViews(app);
	initStoreProductsViews(app);
	initCategoriesViews(app);
	initReceiptsViews(app);
	initAuthViews(app);
	initQueries(app);
	console.log('All views inited');
}
