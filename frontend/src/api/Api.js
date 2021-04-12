import {runInAction} from "mobx";
import {globalStores} from "../hooks/contexts";

export class Api {
	static mainUrl = 'http://localhost:8080/api/';
	static post = {'method': 'POST'};
	static put = {'method': 'PUT'};
	static delete = {'method': 'DELETE'};
	static json = {'Content-Type': 'application/json'};
	static formData = {'Content-Type': 'multipart/form-data'};
	static postJson = Object.assign({}, Api.post, {'headers': Api.json});
	static putJson = Object.assign({}, Api.put, {'headers': Api.json});
	static deleteJson = Object.assign({}, Api.delete, {'headers': Api.json});
	static putFormData = Object.assign({}, Api.put, {'headers': Api.formData});

	static getLink(url, params) {
		console.log(params);
		let link = new URL(url);
		if (params) {
			if (params.hasOwnProperty('page') && params.page > 1) link.searchParams.append('page', params.page);
			if (params.hasOwnProperty('search') && params.search) link.searchParams.append('search', params.search);

			for (let key of Object.keys(params)) {
				if (key !== 'page' && key !== 'search')
					link.searchParams.append(key, params[key]);
			}
		}
		console.log(link.toString());
		return link.toString();
	}

	static async fetch(url, params) {
		if (!params) params = {};
		if (!params.headers) params.headers = {};
		return await Api.fetchNoToken(url, Object.assign({}, params,
			{headers: Object.assign(params.headers,
					{'Authorization': `Bearer ${localStorage.getItem('token')}`})}));
	}

	static async fetchNoToken(url, params) {
		try {
			return fetch(url, params).then((r) => {
				if (!r) {
					runInAction(() => {globalStores.loginStore.isApiAvailable = false});
					return Response.error();
				}
				if (r.ok)
					return r;
				else {
					if (r.status === 401 || r.status === 403)
						runInAction(() => {globalStores.loginStore.isLoggedIn = false});
					else if (r.status >= 500)
						runInAction(() => {globalStores.loginStore.isApiAvailable = false});
					else return r;
					return Response.error();
				}
			}).catch((e) => console.log(e));
		} catch (e) {
			runInAction(() => {globalStores.loginStore.isApiAvailable = false});
		}
	}

	static makeFormData(obj) {
		let data = new FormData();
		for (let key of Object.keys(obj))
			data.append(key, obj[key]);
		return data;
	}
}
