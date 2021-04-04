const createTable = "CREATE TABLE IF NOT EXISTS Category( `category_number` INT NOT NULL AUTO_INCREMENT, `category_name` VARCHAR(50) NOT NULL, PRIMARY KEY (`category_number`) )ENGINE=INNODB;";

module.exports.CategoriesDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Categories DB inited!');
	}

	getAllCategories() {
		return this.query('SELECT * FROM supermarket.category;');
	}
}
