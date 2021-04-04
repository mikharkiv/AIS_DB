const createTable = "CREATE TABLE IF NOT EXISTS `Check`( `check_number` VARCHAR(10) NOT NULL, `id_employee` VARCHAR(10) NOT NULL, `card_number` VARCHAR(13) NULL, `print_date` DATE NOT NULL, `sum_total` DECIMAL(13,4) NOT NULL, `vat` DECIMAL(13,4) NOT NULL, PRIMARY KEY (`check_number`), FOREIGN KEY (`id_employee`) REFERENCES Employee(`id_employee`) ON UPDATE CASCADE ON DELETE NO ACTION, FOREIGN KEY (`card_number`) REFERENCES Customer_Card(`card_number`) ON UPDATE CASCADE ON DELETE NO ACTION )ENGINE=INNODB;";

module.exports.ReceiptsDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Receipts DB inited!');
	}
}
