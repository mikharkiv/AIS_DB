const createTable = "CREATE TABLE IF NOT EXISTS Category( `category_number` INT NOT NULL AUTO_INCREMENT, `category_name` VARCHAR(50) NOT NULL, PRIMARY KEY (`category_number`) )ENGINE=INNODB;";

//CRUD
const getAllCategoriesSQL = "SELECT * FROM supermarket.category;";

const getCategoriesLimitSQL = "SELECT * FROM supermarket.category LIMIT #LIMIT# OFFSET #OFFSET#;";

const getAllCountSQL = "SELECT COUNT(*) AS TotalCount FROM supermarket.category;";

const getByIdSQL = "SELECT * FROM supermarket.category WHERE category_number =#PID_VAR#;";

const addCategorySQL = "INSERT INTO supermarket.category (category_name) VALUES ('#NAME#');";

const updateCategorySQL = "UPDATE supermarket.category SET category_name = '#NAME#' WHERE category_number = '#ID#';";

const deleteByIdSQL = "DELETE FROM supermarket.category WHERE category_number =#PID_VAR#;";

module.exports.CategoriesDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Categories DB inited!');
	}


	//CRUD

	getAllCategories() {
		return this.query(getAllCategoriesSQL);
	}

	getCategoriesLimit(limit, offset){
		return this.query(getCategoriesLimitSQL.replace('#LIMIT#', limit).replace('#OFFSET#', offset));
	}

	getAllCount() {
		return this.query(getAllCountSQL);
	}

	getById(categoryId) {
		return this.query(getByIdSQL.replace('#PID_VAR#', categoryId));
	}

	addCategory(categoryName){
		return this.query(addCategorySQL.replace('#NAME#', categoryName));
	}

	updateCategory(categoryName, categoryId){
		return this.query(updateCategorySQL.replace('#NAME#', categoryName).replace('#ID#', categoryId));
	}

	deleteById(categoryId) {
		return this.query(deleteByIdSQL.replace('#PID_VAR#', categoryId));
	}
}
