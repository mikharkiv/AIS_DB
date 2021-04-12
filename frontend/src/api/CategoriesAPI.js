import {Api} from "./Api";

export class CategoriesAPI {
	static apiUrl = Api.mainUrl + 'categories/';

	static async getCategories(urlParams) {
		return await Api.fetch(Api.getLink(this.apiUrl, urlParams))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async getCategory(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`)
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async addCategory(card) {
		return await Api.fetch(`${this.apiUrl}`,
			Object.assign({}, Api.postJson, {body: JSON.stringify(card)}))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async removeCategory(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`, Api.delete)
			.then((r) => (r.status === 204 ? {} : "error"))
			.catch(() => "error");
	}

	static async updateCategory(id, card) {
		return await Api.fetch(`${this.apiUrl}${id}/`,
			Object.assign({}, Api.putJson, {body: JSON.stringify(card)}))
			.then((r) => r.json())
			.catch(() => "error");
	}
}
