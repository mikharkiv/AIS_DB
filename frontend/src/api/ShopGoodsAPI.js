import {Api} from "./Api";

export class ShopGoodsAPI {
	static apiUrl = Api.mainUrl + 'store-products/';

	static async getShopGoods(urlParams) {
		return await Api.fetch(Api.getLink(this.apiUrl, urlParams))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async getShopGood(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`)
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async addShopGood(shopgood) {
		return await Api.fetch(`${this.apiUrl}`,
			Object.assign({}, Api.postJson, {body: JSON.stringify(shopgood)}))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async removeShopGood(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`, Api.delete)
			.then((r) => (r.status === 204 ? {} : "error"))
			.catch(() => "error");
	}

	static async updateShopGood(id, shopgood) {
		return await Api.fetch(`${this.apiUrl}${id}/`,
			Object.assign({}, Api.putJson, {body: JSON.stringify(shopgood)}))
			.then((r) => r.json())
			.catch(() => "error");
	}
}
