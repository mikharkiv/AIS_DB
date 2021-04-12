import {Api} from "./Api";

export class ReceiptsAPI {
	static apiUrl = Api.mainUrl + 'receipts/';

	static async getReceipts(urlParams) {
		return await Api.fetch(Api.getLink(this.apiUrl, urlParams))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async getReceipt(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`)
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async addReceipt(receipt) {
		return await Api.fetch(`${this.apiUrl}`,
			Object.assign({}, Api.postJson, {body: JSON.stringify(receipt)}))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async removeReceipt(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`, Api.delete)
			.then((r) => (r.status === 204 ? {} : "error"))
			.catch(() => "error");
	}

	static async updateReceipt(id, receipt) {
		return await Api.fetch(`${this.apiUrl}${id}/`,
			Object.assign({}, Api.putJson, {body: JSON.stringify(receipt)}))
			.then((r) => r.json())
			.catch(() => "error");
	}
}
