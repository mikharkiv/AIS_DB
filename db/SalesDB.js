const createTable = "CREATE TABLE IF NOT EXISTS Sale( `UPC` varchar(12) COLLATE `ascii_bin` NOT NULL, `check_number` VARCHAR(10) NOT NULL, `products_number` INT NOT NULL, `selling_price` DECIMAL(13, 4) NOT NULL, PRIMARY KEY(`UPC`, `check_number`), FOREIGN KEY (`UPC`) REFERENCES Store_Product(`UPC`) ON UPDATE CASCADE ON DELETE NO ACTION, FOREIGN KEY (`check_number`) REFERENCES `Check`(`check_number`) ON UPDATE CASCADE ON DELETE CASCADE )ENGINE=INNODB;";

module.exports.SalesDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Sale DB inited!');
	}
}
