import {Api} from "./Api";

export class GoodsAPI {
	static apiUrl = Api.mainUrl + 'goods/';

	static async getGoods(urlParams) {
		return await Api.fetch(Api.getLink(this.apiUrl, urlParams))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async getGood(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`)
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async addGood(good) {
		return await Api.fetch(`${this.apiUrl}`,
			Object.assign({}, Api.postJson, {body: JSON.stringify(good)}))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async removeGood(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`, Api.delete)
			.then((r) => (r.status === 204 ? {} : "error"))
			.catch(() => "error");
	}

	static async updateGood(id, good) {
		return await Api.fetch(`${this.apiUrl}${id}/`,
			Object.assign({}, Api.putJson, {body: JSON.stringify(good)}))
			.then((r) => r.json())
			.catch(() => "error");
	}
}
