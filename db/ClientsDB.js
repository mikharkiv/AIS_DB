const createTable = "CREATE TABLE IF NOT EXISTS Customer_Card( card_number VARCHAR(13) NOT NULL, `cust_surname` VARCHAR(50) NOT NULL, `cust_name` VARCHAR(50) NOT NULL, `cust_patronymic` VARCHAR(50) NOT NULL, `phone_number` VARCHAR(13) NOT NULL, `city` VARCHAR(50) NULL, `street` VARCHAR(50) NULL, `zip_code` VARCHAR(9) NULL, `percent` INT NOT NULL, PRIMARY KEY (`card_number`) )ENGINE=INNODB;";

const queryAllPurchasesSum = " SELECT Customer_Card.card_number, Customer_Card.cust_surname, Customer_Card.cust_name, total_expenses FROM Customer_Card INNER JOIN (SELECT card_number, SUM(sum_total) AS total_expenses FROM `Check` GROUP BY card_number ) AS Card_Sum ON Card_Sum.card_number = Customer_Card.card_number;";

//crud
const getClientsLimitSQL = "SELECT * FROM Customer_Card LIMIT #LIMIT# OFFSET #OFFSET#;";


const getClientsLimitSearchSQL = "SELECT * FROM Customer_Card WHERE cust_surname LIKE '%#SEARCH#%' OR cust_name LIKE '%#SEARCH#%' OR cust_patronymic LIKE '%#SEARCH#%' LIMIT #LIMIT# OFFSET #OFFSET#;";

const getAllCountSQL = "SELECT COUNT(*) AS TotalCount FROM Customer_Card;";

const getAllCountByIDSQL = "SELECT COUNT(*) AS TotalCount FROM Customer_Card WHERE card_number=#PID_VAR#;";

const getAllCountSearchSQL = "SELECT COUNT(*) AS TotalCount FROM Customer_Card WHERE cust_surname LIKE '%#SEARCH#%' OR cust_name LIKE '%#SEARCH#%' OR cust_patronymic LIKE '%#SEARCH#%';";

const deleteByIdSQL = "DELETE FROM Customer_Card WHERE card_number=#PID_VAR#;";

const getByIdSQL = "SELECT * FROM Customer_Card WHERE card_number=#PID_VAR#;";

const addClientSQL = "INSERT INTO Customer_Card (card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent) " +
	"VALUES (";

const updateClientSQL = "UPDATE Customer_Card SET #PARAMS# WHERE card_number = '#ID#';";

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


	//CRUD
	getClientsLimit(limit, offset){
		return this.query(getClientsLimitSQL.replace('#LIMIT#', limit).replace('#OFFSET#', offset));
	}

	getClientsLimitSearch(limit, offset, search_query){
		return this.query(getClientsLimitSearchSQL.replace('#LIMIT#', limit).replace('#OFFSET#', offset).replace('#SEARCH#', search_query).replace('#SEARCH#', search_query));
	}

	getAllCount() {
		return this.query(getAllCountSQL);
	}

	getAllCountSearch(search_query) {
		return this.query(getAllCountSearchSQL.replace('#SEARCH#', search_query).replace('#SEARCH#', search_query));
	}

	getById(cardNumber) {
		return this.query(getByIdSQL.replace('#PID_VAR#', cardNumber));
	}

	getAllCountByID(cardNumber) {
		return this.query(getAllCountByIDSQL.replace('#PID_VAR#', cardNumber));
	}

	addClient(card_number, cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent){
		return this.query(addClientSQL+"'"+card_number+"','"+cust_surname+"','"+cust_name+"','"+cust_patronymic+"','"+phone_number +"','"+city+"','"+street+"','"+zip_code+"','"+percent+"');");
	}


	updateClient(strParams, cardNumber){
		return this.query(updateClientSQL.replace('#PARAMS#', strParams).replace('#ID#', cardNumber));
	}

	deleteById(cardNumber) {
		return this.query(deleteByIdSQL.replace('#PID_VAR#', cardNumber));
	}
}
