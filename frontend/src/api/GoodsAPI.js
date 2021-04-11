import {Api} from "./Api";
import {CategoriesAPI} from "./CategoriesAPI";

// TODO bind with backend
export class GoodsAPI {
	static apiUrl = Api.mainUrl + 'goods/';

	static _goods = [
		GoodsAPI.buildGood(0, CategoriesAPI._categories[0],'A','A'),
		GoodsAPI.buildGood(1, CategoriesAPI._categories[0],'B','B'),
		GoodsAPI.buildGood(2, CategoriesAPI._categories[1],'C','C'),
		GoodsAPI.buildGood(3, CategoriesAPI._categories[1],'D','D'),
		GoodsAPI.buildGood(4, CategoriesAPI._categories[1],'E','E'),
	];

	static async getGoods(urlParams) {
		return this._goods;
	}

	static async getGood(id) {
		return this._goods.find((e) => e.id_product === id);
	}

	static async addGood(good) {
		let greatestId = this._goods.reduce((p,c) => Math.max(p, c.id_product), 0);
		good.good_number = greatestId + 1;
		this._goods.push(good);
	}

	static async removeGood(id) {
		this._goods = this._goods.filter((e) => e.id_product !== id);
	}

	static async updateGood(id, good) {
		await GoodsAPI.removeGood(id);
		good.good_number = id;
		this._goods.push(good);
	}

	static buildGood(id, category, name, characteristics) {
		return {
			id_product: id,
			category_number: category,
			product_name: name,
			characteristics: characteristics
		};
	}
}
