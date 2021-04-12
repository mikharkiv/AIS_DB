const createTable = "CREATE TABLE IF NOT EXISTS `Check`( `check_number` VARCHAR(10) NOT NULL, `id_employee` VARCHAR(10) NOT NULL, `card_number` VARCHAR(13) NULL, `print_date` DATE NOT NULL, `sum_total` DECIMAL(13,4) NOT NULL, `vat` DECIMAL(13,4) NOT NULL, PRIMARY KEY (`check_number`), FOREIGN KEY (`id_employee`) REFERENCES Employee(`id_employee`) ON UPDATE CASCADE ON DELETE NO ACTION, FOREIGN KEY (`card_number`) REFERENCES Customer_Card(`card_number`) ON UPDATE CASCADE ON DELETE NO ACTION )ENGINE=INNODB;";

//CRUD
const getAllCountSQL = "SELECT COUNT(*) AS TotalCount FROM `Check`;";

const getAllCountByIdSQL = "SELECT COUNT(*) AS TotalCount FROM `Check` WHERE check_number=#PID_VAR#;";

const getReceiptLimitSQL = "SELECT * FROM `Check` LIMIT #LIMIT# OFFSET #OFFSET#;";

const getByIdSQL = "SELECT * FROM `Check` WHERE check_number=#PID_VAR#;";

const addReceiptSQL = "INSERT INTO `Check` (check_number, id_employee, card_number, print_date, sum_total) " +
	"VALUES (";

const updateClientSQL = "UPDATE `Check` SET #PARAMS# WHERE check_number = '#ID#';";

const deleteByIdSQL = "DELETE FROM `Check` WHERE check_number=#PID_VAR#;";

const getProductsSQL = "SELECT Sale.UPC AS `store-product`, Sale.products_number AS count FROM Sale INNER JOIN Store_Product SP on Sale.UPC = SP.UPC WHERE Sale.check_number = #PID_VAR#;"

module.exports.ReceiptsDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Receipts DB inited!');
	}

	//CRUD
	getAllCount(){
		return this.query(getAllCountSQL);
	}

	getReceiptLimit(limit, offset){
		return this.query(getReceiptLimitSQL.replace('#LIMIT#', limit).replace('#OFFSET#', offset));
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

	addReceipt(check_number, id_employee, card_number, print_date, sum_total){
		return this.query(addReceiptSQL+"'"+check_number+"','"+id_employee+"','"+card_number+"','"+print_date+"','"+sum_total+"');");
	}

	updateReceipt(query, upc){
		return this.query(updateClientSQL.replace('#PARAMS#', query).replace('#ID#', upc));
	}

	getProducts(upc){
		return this.query(getProductsSQL.replace('#PID_VAR#', upc));
	}
}
