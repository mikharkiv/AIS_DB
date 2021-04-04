const createTable = "CREATE TABLE IF NOT EXISTS Customer_Card( card_number VARCHAR(13) NOT NULL, `cust_surname` VARCHAR(50) NOT NULL, `cust_name` VARCHAR(50) NOT NULL, `cust_patronymic` VARCHAR(50) NOT NULL, `phone_number` VARCHAR(13) NOT NULL, `city` VARCHAR(50) NULL, `street` VARCHAR(50) NULL, `zip_code` VARCHAR(9) NULL, `percent` INT NOT NULL, PRIMARY KEY (`card_number`) )ENGINE=INNODB;";

const queryAllPurchasesSum = " SELECT Customer_Card.card_number, Customer_Card.cust_surname, Customer_Card.cust_name, total_expenses FROM Customer_Card INNER JOIN (SELECT card_number, SUM(sum_total) AS total_expenses FROM `Check` GROUP BY card_number ) AS Card_Sum ON Card_Sum.card_number = Customer_Card.card_number;";

module.exports.ClientsDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Clients DB inited!');
	}

	getAllPurchasesSum() {
		return this.query(queryAllPurchasesSum);
	}
}
