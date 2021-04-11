import {Api} from "./Api";

// TODO bind with backend
export class CategoriesAPI {
	static apiUrl = Api.mainUrl + 'categories/';

	static _categories = [
		CategoriesAPI.buildCategory(0,'A'),
		CategoriesAPI.buildCategory(1,'B'),
		CategoriesAPI.buildCategory(2,'C'),
		CategoriesAPI.buildCategory(3,'D'),
		CategoriesAPI.buildCategory(4,'E'),
	];

	static async getCategories(urlParams) {
		return this._categories;
	}

	static async getCategory(id) {
		return this._categories.find((e) => e.category_number == id);
	}

	static async addCategory(card) {
		let greatestId = this._categories.reduce((p, c) => Math.max(p, c.category_number), 0);
		card.category_number = greatestId + 1;
		this._categories.push(card);
	}

	static async removeCategory(id) {
		this._categories = this._categories.filter((e) => e.category_number !== id);
	}

	static async updateCategory(id, card) {
		await CategoriesAPI.removeCategory(id);
		card.category_number = id;
		this._categories.push(card);
	}

	static buildCategory(num, name) {
		return {
			category_number: num,
			category_name: name
		};
	}
}
