import {Api} from "./Api";
import {CategoriesAPI} from "./CategoriesAPI";
import {EmployeesAPI} from "./EmployeesAPI";
import {CardsAPI} from "./CardsAPI";
import {ShopGoodsAPI} from "./ShopGoodsAPI";

// TODO bind with backend
export class ReceiptsAPI {
	static apiUrl = Api.mainUrl + 'receipts/';

	static _receipts = [
		ReceiptsAPI.buildReceipt(0, EmployeesAPI._employees[0], CardsAPI._cards[0], '01.01.2000', 0, 0,
			[{product: ShopGoodsAPI._shopgoods[0], count: 1}]),
		ReceiptsAPI.buildReceipt(1, EmployeesAPI._employees[0], CardsAPI._cards[1], '01.01.2001', 1, 1,
			[{product: ShopGoodsAPI._shopgoods[1], count: 2}]),
		ReceiptsAPI.buildReceipt(2, EmployeesAPI._employees[0], CardsAPI._cards[0], '01.01.2002', 2, 2,
			[{product: ShopGoodsAPI._shopgoods[2], count: 3}]),
		ReceiptsAPI.buildReceipt(3, EmployeesAPI._employees[1], CardsAPI._cards[1], '01.01.2003', 3, 3,
			[{product: ShopGoodsAPI._shopgoods[3], count: 4}]),
		ReceiptsAPI.buildReceipt(4, EmployeesAPI._employees[1], CardsAPI._cards[2], '01.01.2004', 4, 4,
			[{product: ShopGoodsAPI._shopgoods[4], count: 5},{product: ShopGoodsAPI._shopgoods[3], count: 22}]),
	];

	static async getReceipts(urlParams) {
		return this._receipts;
	}

	static async getReceipt(id) {
		return this._receipts.find((e) => e.check_number == id);
	}

	static async addReceipt(receipt) {
		let greatestId = this._receipts.reduce((p,c) => Math.max(p, c.check_number), 0);
		receipt.check_number = greatestId + 1;
		this._receipts.push(receipt);
	}

	static async removeReceipt(id) {
		this._receipts = this._receipts.filter((e) => e.check_number !== id);
	}

	static async updateReceipt(id, receipt) {
		await ReceiptsAPI.removeReceipt(id);
		receipt.check_number = id;
		this._receipts.push(receipt);
	}

	static buildReceipt(id, empl, card, date, sum, vat, products = []) {
		return {
			check_number: id,
			id_employee: empl,
			card_number: card,
			print_date: date,
			sum_total: sum,
			vat: vat,
			products: products
		};
	}
}
