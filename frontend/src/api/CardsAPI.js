import {Api} from "./Api";

export class CardsAPI {
	static apiUrl = Api.mainUrl + 'cards/';

	static async getCards(urlParams) {
		return await Api.fetch(Api.getLink(this.apiUrl, urlParams))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async getCard(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`)
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async addCard(card) {
		return await Api.fetch(`${this.apiUrl}`,
			Object.assign({}, Api.postJson, {body: JSON.stringify(card)}))
			.then((r) => r.json())
			.catch(() => "error");
	}

	static async removeCard(id) {
		return await Api.fetch(`${this.apiUrl}${id}/`, Api.delete)
			.then((r) => (r.status === 204 ? {} : "error"))
			.catch(() => "error");
	}

	static async updateCard(id, card) {
		return await Api.fetch(`${this.apiUrl}${id}/`,
			Object.assign({}, Api.putJson, {body: JSON.stringify(card)}))
			.then((r) => r.json())
			.catch(() => "error");
	}
}
