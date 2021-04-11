import {Api} from "./Api";

// TODO bind with backend
export class EmployeesAPI {
	static apiUrl = Api.mainUrl + 'employees/';

	static ROLES = {
		MANAGER: 'manager',
		CASHIER: 'cashier'
	};

	static _employees = [
		EmployeesAPI.buildEmployee(0,'A','A','A','0','A','A',0,'M',0,'01.01.2000','01.01.2010'),
		EmployeesAPI.buildEmployee(1,'B','B','B','1','B','B',1,'K',1,'01.01.2001','01.01.2011'),
		EmployeesAPI.buildEmployee(2,'C','C','C','2','C','C',2,'M',2,'01.01.2002','01.01.2012'),
		EmployeesAPI.buildEmployee(3,'D','D','D','3','D','D',3,'M',3,'01.01.2003','01.01.2013'),
		EmployeesAPI.buildEmployee(4,'E','E','E','4','E','E',4,'K',4,'01.01.2004','01.01.2014'),
	];

	static async getEmployees(urlParams) {
		return this._employees;
	}

	static async getEmployee(id) {
		return this._employees.find((e) => e.id_employee === id);
	}

	static async addEmployee(employee) {
		let greatestId = this._employees.reduce((p,c) => Math.max(p, c.id_employee), 0);
		employee.id_employee = greatestId + 1;
		this._employees.push(employee);
	}

	static async removeEmployee(id) {
		this._employees = this._employees.filter((e) => e.id_employee !== id);
	}

	static async updateEmployee(id, employee) {
		await EmployeesAPI.removeEmployee(id);
		employee.id_employee = id;
		this._employees.push(employee);
	}

	static buildEmployee(num, surname, name, patronymic, phone, city, street, zip, role, salary, date_birth, date_start) {
		return {
			id_employee: num,
			empl_surname: surname,
			empl_name: name,
			empl_patronymic: patronymic,
			role: role,
			salary: salary,
			date_of_birth: date_birth,
			date_of_start: date_start,
			phone_number: phone,
			city: city,
			street: street,
			zip_code: zip
		};
	}
}
