const {ClientsDB} = require('./ClientsDB');
const {CategoriesDB} = require('./CategoriesDB');
const {ProductsDB} = require('./ProductsDB');
const {EmployeesDB} = require('./EmployeesDB');
const {ReceiptsDB} = require('./ReceiptsDB');
const {SalesDB} = require('./SalesDB');
const {StoreProductsDB} = require('./StoreProductsDB');

const mysql = require("mysql");
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "SuperMarket",
    password: "root"
    // password: "rootroot"
});

module.exports.initDB = async function() {
	await connection.connect(async function (err) {
	    if (err) throw err;
	    console.log("Connection to MySQL established!");
	});

	let clientsDB = new ClientsDB(module.exports.query);
	await clientsDB.init();
	module.exports.clientsDB = clientsDB;
	module.exports.employeesDB = new EmployeesDB(module.exports.query);
	await module.exports.employeesDB.init();
	module.exports.receiptsDB = new ReceiptsDB(module.exports.query);
	await module.exports.receiptsDB.init();
	module.exports.categoriesDB = new CategoriesDB(module.exports.query);
	await module.exports.categoriesDB.init();
	module.exports.productsDB = new ProductsDB(module.exports.query);
	await module.exports.productsDB.init();
	module.exports.storeProductsDB = new StoreProductsDB(module.exports.query);
	await module.exports.storeProductsDB.init();
	module.exports.salesDB = new SalesDB(module.exports.query);
	await module.exports.salesDB.init();

	console.log('DBs inited');
};

module.exports.query = function(query) {
	return new Promise((resolve, reject) => {
		connection.query(query, function (error, result, fields) {
			if (error) throw error;
			else return resolve(result);
		});
	});
}

