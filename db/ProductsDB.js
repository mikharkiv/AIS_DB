const createTable = "CREATE TABLE IF NOT EXISTS Product( `id_product` INT NOT NULL AUTO_INCREMENT, `category_number` INT NOT NULL, `product_name` VARCHAR(50) NOT NULL, `developer` VARCHAR(50) NOT NULL, `characteristics` VARCHAR(50) NOT NULL, PRIMARY KEY (`id_product`), FOREIGN KEY (`category_number`) REFERENCES Category(`category_number`) ON UPDATE CASCADE ON DELETE NO ACTION )ENGINE=INNODB;";

const queryProductMostSold = "SELECT Product.id_product, Product.product_name FROM Store_Product INNER JOIN (SELECT UPC, SUM(products_number) AS total_number FROM Sale GROUP BY UPC ORDER BY total_number DESC LIMIT  1) AS Sale_Count ON Store_Product.UPC = Sale_Count.UPC INNER JOIN Product ON Product.id_product = Store_Product.id_product;";

// Postnikov
const queryProductCategorySellsSum = "SELECT category.category_number, category_name, sale.UPC, SUM(sale.products_number) * sale.selling_price AS total_sum FROM ((store_product INNER JOIN sale ON store_product.UPC = sale.UPC) INNER JOIN product ON store_product.id_product = product.id_product) INNER JOIN category on product.category_number = category.category_number GROUP BY category.category_number, category.category_name, sale.UPC;";


//CRUD
const getAllProductsSQL = "SELECT * FROM supermarket.product;";

const getProductsLimitSQL = "SELECT * FROM supermarket.product LIMIT #LIMIT# OFFSET #OFFSET#;";

const getAllCountSQL = "SELECT COUNT(*) AS TotalCount FROM supermarket.product;";

const getByIdSQL = "SELECT * FROM supermarket.product WHERE id_product =#PID_VAR#;";

const deleteByIdSQL = "DELETE FROM supermarket.product WHERE id_product =#PID_VAR#;";

const addProductSQL = "INSERT INTO supermarket.product (category_number, product_name, developer, characteristics) VALUES (";

const updateProductSQL = "UPDATE supermarket.product SET #PARAMS# WHERE id_product = '#ID#';";

module.exports.ProductsDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Products DB inited!');
	}

	getProductMostSold() {
		return this.query(queryProductMostSold);
	}

	getProductsCategoriesSellsSum() {
		return this.query(queryProductCategorySellsSum);
	}


	//CRUD
	getAllProducts() {
		return this.query(getAllProductsSQL);
	}

	getProductsLimit(limit, offset){
		return this.query(getProductsLimitSQL.replace('#LIMIT#', limit).replace('#OFFSET#', offset));
	}

	getAllCount() {
		return this.query(getAllCountSQL);
	}

	getById(productId) {
		return this.query(getByIdSQL.replace('#PID_VAR#', productId));
	}


	addProduct(category_number, product_name, developer, characteristics){
		return this.query(addProductSQL+"'"+category_number+"','"+product_name+"','"+developer+"','"+characteristics+"');");
	}

	updateProduct(strParams, productId){
		return this.query(updateProductSQL.replace('#PARAMS#', strParams).replace('#ID#', productId));
	}

	deleteById(productId) {
		return this.query(deleteByIdSQL.replace('#PID_VAR#', productId));
	}

}
