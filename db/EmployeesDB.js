const createTable = "CREATE TABLE IF NOT EXISTS Employee( `id_employee` VARCHAR(10) NOT NULL, `empl_surname` VARCHAR(50) NOT NULL, `empl_name` VARCHAR(50) NOT NULL, `empl_patronymic` VARCHAR(50) NOT NULL, `role` VARCHAR(10) NOT NULL, `salary` DECIMAL(13,4) NOT NULL, `date_of_birth` DATE NOT NULL, `date_of_start` DATE NOT NULL, `phone_number` VARCHAR(13) NOT NULL, `city` VARCHAR(50) NOT NULL, `street` VARCHAR(50) NOT NULL, `zip_code` VARCHAR(9) NOT NULL, PRIMARY KEY (`id_employee`) )ENGINE=INNODB;";

const queryGetSoldItemCount = "SELECT Employee.id_employee, Employee.empl_surname, Employee.empl_name, total_number FROM Employee INNER JOIN (SELECT id_employee, SUM(products_number) AS total_number FROM `Check` INNER JOIN Sale ON Sale.check_number = `Check`.check_number WHERE UPC IN (SELECT UPC FROM Store_Product WHERE id_product ="+
"#PID_VAR#"+
") GROUP BY id_employee) AS Sale_Count ON Employee.id_employee = Sale_Count.id_employee;";
const queryGetSoldEveryItem = "SELECT id_employee, empl_surname, empl_name FROM Employee WHERE NOT EXISTS( SELECT UPC FROM Store_Product WHERE NOT EXISTS( SELECT * FROM Sale INNER JOIN `Check` ON Sale.check_number = `Check`.check_number WHERE Sale.UPC = Store_Product.UPC AND `Check`.id_employee = Employee.id_employee ));";
const queryGetSoldMost = "SELECT Employee.id_employee, Employee.empl_surname, Employee.empl_name, total_sales FROM Employee INNER JOIN (SELECT DISTINCT id_employee, SUM(sum_total) AS total_sales FROM `Check` GROUP BY id_employee ORDER BY total_sales DESC LIMIT  1) AS Sale_Count ON Employee.id_employee = Sale_Count.id_employee;";

module.exports.EmployeesDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Employees DB inited!');
	}

	getSoldItemCount(productId) {
		return this.query(queryGetSoldItemCount.replace('#PID_VAR#', productId));
	}

	getSoldEveryItem() {
		return this.query(queryGetSoldEveryItem);
	}

	getSoldMost() {
		return this.query(queryGetSoldMost);
	}
}
