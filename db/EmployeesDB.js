const createTable = "CREATE TABLE IF NOT EXISTS Employee( `id_employee` VARCHAR(10) NOT NULL, `empl_surname` VARCHAR(50) NOT NULL, `empl_name` VARCHAR(50) NOT NULL, `empl_patronymic` VARCHAR(50) NOT NULL, `role` VARCHAR(10) NOT NULL, `salary` DECIMAL(13,4) NOT NULL, `date_of_birth` DATE NOT NULL, `date_of_start` DATE NOT NULL, `phone_number` VARCHAR(13) NOT NULL, `city` VARCHAR(50) NOT NULL, `street` VARCHAR(50) NOT NULL, `zip_code` VARCHAR(9) NOT NULL, `password` VARCHAR(70) NOT NULL, PRIMARY KEY (`id_employee`) )ENGINE=INNODB;";

const queryGetSoldItemCount = "SELECT Employee.id_employee, Employee.empl_surname, Employee.empl_name, total_number FROM Employee INNER JOIN (SELECT id_employee, SUM(products_number) AS total_number FROM `Check` INNER JOIN Sale ON Sale.check_number = `Check`.check_number WHERE UPC IN (SELECT UPC FROM Store_Product WHERE id_product ="+
"#PID_VAR#"+
") GROUP BY id_employee) AS Sale_Count ON Employee.id_employee = Sale_Count.id_employee;";
const queryGetSoldEveryItem = "SELECT id_employee, empl_surname, empl_name FROM Employee WHERE NOT EXISTS( SELECT UPC FROM Store_Product WHERE NOT EXISTS( SELECT * FROM Sale INNER JOIN `Check` ON Sale.check_number = `Check`.check_number WHERE Sale.UPC = Store_Product.UPC AND `Check`.id_employee = Employee.id_employee ));";
const queryGetSoldMost = "SELECT Employee.id_employee, Employee.empl_surname, Employee.empl_name, total_sales FROM Employee INNER JOIN (SELECT DISTINCT id_employee, SUM(sum_total) AS total_sales FROM `Check` GROUP BY id_employee ORDER BY total_sales DESC LIMIT  1) AS Sale_Count ON Employee.id_employee = Sale_Count.id_employee;";

// Postnikov
const queryEmployeesWorkwithPetrenko = "SELECT empl_surname, empl_name, empl_patronymic FROM employee WHERE id_employee IN ( SELECT id_employee FROM `check` WHERE card_number IN ( SELECT card_number FROM customer_card WHERE cust_surname = \"Petrenko\" ) );";
const queryEmployeesWorkwithBiggestPercentByCity = "SELECT city, COUNT(*) AS count_employees FROM employee WHERE id_employee IN ( SELECT id_employee FROM `check` WHERE card_number IN ( SELECT card_number FROM customer_card WHERE percent IN ( SELECT MAX(percent) FROM customer_card ) ) ) GROUP BY city;";
const queryEmployeesOnlyWorkwithPetrenko = "SELECT empl_name, empl_surname, empl_patronymic FROM employee WHERE id_employee IN ( SELECT id_employee FROM employee WHERE NOT EXISTS( SELECT id_employee FROM `check` C WHERE C.id_employee = employee.id_employee AND card_number NOT IN ( SELECT card_number FROM customer_card WHERE cust_surname = \"Petrenko\" ) ) );";


//CRUD
const getEmployeesLimitSQL = "SELECT * FROM supermarket.Employee LIMIT #LIMIT# OFFSET #OFFSET#;";

const getEmployeesLimitSearchSQL = "SELECT * FROM supermarket.Employee WHERE empl_name LIKE '%#SEARCH#%' OR empl_surname LIKE '%#SEARCH#%' LIMIT #LIMIT# OFFSET #OFFSET#;";

const getAllCountSQL = "SELECT COUNT(*) AS TotalCount FROM supermarket.Employee;";

const deleteByIdSQL = "DELETE FROM employee WHERE id_employee=#PID_VAR#;";

const getByIdSQL = "SELECT * FROM employee WHERE id_employee=#PID_VAR#;";

const addEmployeeSQL = "INSERT INTO SuperMarket.Employee (id_employee, empl_surname, empl_name, empl_patronymic, role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code) " +
	"VALUES (";
	//"#id#,#sur#,#name#,#patr#,#role#,#salary#,#birth#,#start#,#phone#,#city#,#street#,#zip#);";

const alreadyExistsSQL = "SELECT * FROM supermarket.Employee WHERE id_employee = #ID#;";

const updateEmployeeSQL = "UPDATE supermarket.Employee SET #PARAMS# WHERE id_employee = '#ID#';";

const getRoleSQL = "SELECT role FROM employee WHERE id_employee=#PID_VAR#;"

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

	getEmployeesWorkedWithPetrenko() {
		return this.query(queryEmployeesWorkwithPetrenko);
	}

	getEmployeesWorkedWithPetrenkoOnly() {
		return this.query(queryEmployeesOnlyWorkwithPetrenko);
	}

	getEmployeesWorkedWithBiggestPercentByCity() {
		return this.query(queryEmployeesWorkwithBiggestPercentByCity);
	}


	//CRUD
	getAllEmployees() {
		return this.query('SELECT * FROM Employee;');
	}

	getEmployeesLimit(limit, offset){
		return this.query(getEmployeesLimitSQL.replace('#LIMIT#', limit).replace('#OFFSET#', offset));
	}

	getEmployeesLimitSearch(limit, offset, search_query){
		return this.query(getEmployeesLimitSearchSQL.replace('#LIMIT#', limit).replace('#OFFSET#', offset).replace('#SEARCH#', search_query).replace('#SEARCH#', search_query));
	}

	getAllCount() {
		return this.query(getAllCountSQL);
	}

	getById(employeeId) {
		return this.query(getByIdSQL.replace('#PID_VAR#', employeeId));
	}

	addEmployee(id_employee, empl_surname, empl_name, empl_patronymic, role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code){
		return this.query(addEmployeeSQL+"'"+id_employee+"','"+empl_surname+"','"+empl_name+"','"+empl_patronymic+"','"+role +"',"+salary+",'"+date_of_birth+"','"+date_of_start+"','"+phone_number+"','"+city+"','"+street+"','"+zip_code+"');");
	}

	alreadyExists(employeeId){
		return this.query(alreadyExistsSQL.replace('#ID#', employeeId));
	}

	updateEmployee(strParams, employeeId){
		return this.query(updateEmployeeSQL.replace('#PARAMS#', strParams).replace('#ID#', employeeId));
	}

	deleteById(employeeId) {
		return this.query(deleteByIdSQL.replace('#PID_VAR#', employeeId));
	}

	//auth
	getRole(employeeId) {
		return this.query(getRoleSQL.replace('#PID_VAR#', employeeId));
	}
}
