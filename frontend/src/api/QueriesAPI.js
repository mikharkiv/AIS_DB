import {Api} from "./Api";

export class QueriesAPI {
	static apiUrl = Api.mainUrl + 'queries/';

	static async query(id, data) {
		return await Api.fetch(`${this.apiUrl}${id}/`,
			Object.assign({}, Api.postJson, {body: JSON.stringify(data)}))
			.then((r) => r.json())
			.catch(() => "error");
	}
}
