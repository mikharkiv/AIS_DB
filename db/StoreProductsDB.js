const createTable = "CREATE TABLE IF NOT EXISTS Store_Product ( `UPC` varchar(12) COLLATE `ascii_bin` NOT NULL, `UPC_prom` varchar(12) CHARACTER SET `ascii` COLLATE `ascii_bin` DEFAULT NULL UNIQUE, `id_product` int NOT NULL, `selling_price` decimal(13, 4) NOT NULL, `products_number` int NOT NULL, `promotional_product` tinyint(1) NOT NULL, PRIMARY KEY (`UPC`), CONSTRAINT `id_product` FOREIGN KEY (`id_product`) REFERENCES `Product` (`id_product`) ON UPDATE CASCADE, CONSTRAINT `UPC_prom` FOREIGN KEY (`UPC_prom`) REFERENCES `Store_Product`(`UPC`) ON DELETE SET NULL ON UPDATE CASCADE )ENGINE=INNODB;";

//CRUD
const getAllCountSQL = "SELECT COUNT(*) AS TotalCount FROM Store_Product;";

const getAllCountByIdSQL = "SELECT COUNT(*) AS TotalCount FROM Store_Product WHERE UPC=#PID_VAR#;";

const getStoreProductsLimitSQL = "SELECT * FROM Store_Product LIMIT #LIMIT# OFFSET #OFFSET#;";

const getByIdSQL = "SELECT * FROM Store_Product WHERE UPC=#PID_VAR#;";

const addStoreProduct = "INSERT INTO Store_Product (UPC, UPC_prom, id_product, selling_price, products_number, promotional_product) " +
"VALUES (";

const updateClientSQL = "UPDATE Store_Product SET #PARAMS# WHERE UPC = '#ID#';";

const deleteByIdSQL = "DELETE FROM Store_Product WHERE UPC=#PID_VAR#;";


module.exports.StoreProductsDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Store Products DB inited!');
	}

	//CRUD
	getAllCount(){
		return this.query(getAllCountSQL);
	}

	getStoreProductsLimit(limit, offset){
		return this.query(getStoreProductsLimitSQL.replace('#LIMIT#', limit).replace('#OFFSET#', offset));
	}

	getById(upc){
		return this.query(getByIdSQL.replace('#PID_VAR#', upc));
	}

	deleteById(upc){
		return this.query(deleteByIdSQL.replace('#PID_VAR#', upc));
	}

	getAllCountByID(upc){
		return this.query(getAllCountByIdSQL.replace('#PID_VAR#', upc));
	}
	//UPC, UPC_prom, id_product, selling_price, products_number, promotional_product
	addStoreProduct(UPC, UPC_prom, id_product, selling_price, products_number, promotional_product){
		return this.query(addStoreProduct+"'"+UPC+"','"+UPC_prom+"','"+id_product+"','"+selling_price+"','"+products_number+"','"+promotional_product+"');");
	}

	updateStoreProduct(query, upc){
		return this.query(updateClientSQL.replace('#PARAMS#', query).replace('#ID#', upc));
	}
}
