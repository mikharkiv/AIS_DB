import {Api} from "./Api";

// TODO bind with backend
export class EmployeesAPI {
	static apiUrl = Api.mainUrl + 'employees/';

	static ROLES = {
		MANAGER: 'manager',
		CASHIER: 'cashier'
	};

	static async getEmployees(urlParams) {
		return await Api.fetch(Api.getLink(this.apiUrl, urlParams))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async getEmployee(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`)
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async addEmployee(employee) {
		return await Api.fetch(`${this.apiUrl}`,
			Object.assign({}, Api.postJson, {body: JSON.stringify(employee)}))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async removeEmployee(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`, Api.delete)
			.then((r) => (r.status === 204 ? {} : "error"))
			.catch(() => "error");
	}

	static async updateEmployee(id, employee) {
		return await Api.fetch(`${this.apiUrl}${id}/`,
			Object.assign({}, Api.putJson, {body: JSON.stringify(employee)}))
			.then((r) => r.json())
			.catch(() => "error");
	}
}
