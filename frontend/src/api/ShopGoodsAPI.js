import {Api} from "./Api";
import {GoodsAPI} from "./GoodsAPI";
import {CategoriesAPI} from "./CategoriesAPI";

// TODO bind with backend
export class ShopGoodsAPI {
	static apiUrl = Api.mainUrl + 'shopgoods/';

	static _shopgoods = [
		ShopGoodsAPI.buildShopGood(0, 0, GoodsAPI._goods[0], 0, 1, false),
		ShopGoodsAPI.buildShopGood(1, 0, GoodsAPI._goods[1], 1, 1, false),
		ShopGoodsAPI.buildShopGood(2, 0, GoodsAPI._goods[2], 2, 2, false),
		ShopGoodsAPI.buildShopGood(3, 0, GoodsAPI._goods[3], 3, 3, false),
		ShopGoodsAPI.buildShopGood(4, 0, GoodsAPI._goods[4], 4, 4, false),
		ShopGoodsAPI.buildShopGood(5, ShopGoodsAPI.buildShopGood(0, 0, GoodsAPI._goods[4], 0), GoodsAPI._goods[4], 3, 1, true),
	];

	static async getShopGoods(urlParams) {
		return this._shopgoods;
	}

	static async getShopGood(id) {
		return this._shopgoods.find((e) => e.upc == id);
	}

	static async addShopGood(shopgood) {
		console.log(shopgood);
		let greatestId = this._shopgoods.reduce((p,c) => Math.max(p, c.upc), 0);
		shopgood.upc = greatestId + 1;
		if (typeof shopgood.id_product !== 'object')
			shopgood.id_product = await GoodsAPI.getGood(shopgood.id_product);
		if (typeof shopgood.upc_prom !== 'object')
			shopgood.upc_prom = await ShopGoodsAPI.getShopGood(shopgood.upc_prom);
		console.log(shopgood);
		this._shopgoods.push(shopgood);
	}

	static async removeShopGood(id) {
		this._shopgoods = this._shopgoods.filter((e) => e.upc !== id);
	}

	static async updateShopGood(id, shopgood) {
		await ShopGoodsAPI.removeShopGood(id);
		shopgood.upc = id;
		if (typeof shopgood.id_product !== 'object')
			shopgood.id_product = await GoodsAPI.getGood(shopgood.id_product);
		if (typeof shopgood.upc_prom !== 'object')
			shopgood.upc_prom = await ShopGoodsAPI.getShopGood(shopgood.upc_prom);
		this._shopgoods.push(shopgood);
	}

	static buildShopGood(upc, upc_prom, id_product, price, products, is_prom) {
		return {
			upc: upc,
			upc_prom: upc_prom,
			id_product: id_product,
			selling_price: price,
			products_number: products,
			promotional_product: is_prom
		};
	}
}
