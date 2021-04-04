const {initClientsViews} = require("./clients");
const {initEmployeesViews} = require("./employees");
const {initProductsViews} = require("./products");
const {initCategoriesViews} = require("./categories");

module.exports.initViews = function (app) {
	initClientsViews(app);
	initEmployeesViews(app);
	initProductsViews(app);
	initCategoriesViews(app);
	console.log('All views inited');
}
