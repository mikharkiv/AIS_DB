import {Api} from "./Api";

// TODO bind with backend
export class CardsAPI {
	static apiUrl = Api.mainUrl + 'cards/';

	static _cards = [
		CardsAPI.buildCard(0,'A','A','A','0','A','A','0',0),
		CardsAPI.buildCard(1,'B','B','B','1','B','B','1',1),
		CardsAPI.buildCard(2,'C','C','C','2','C','C','2',2),
		CardsAPI.buildCard(3,'D','D','D','3','D','D','3',3),
		CardsAPI.buildCard(4,'E','E','E','4','E','E','4',4),
	];

	static async getCards(urlParams) {
		return this._cards;
	}

	static async getCard(id) {
		return this._cards.find((e) => e.card_number === id);
	}

	static async addCard(card) {
		let greatestId = this._cards.reduce((p,c) => Math.max(p, c.card_number), 0);
		card.card_number = greatestId + 1;
		this._cards.push(card);
	}

	static async removeCard(id) {
		this._cards = this._cards.filter((e) => e.card_number !== id);
	}

	static async updateCard(id, card) {
		await CardsAPI.removeCard(id);
		card.card_number = id;
		this._cards.push(card);
	}

	static buildCard(num, surname, name, patronymic, phone, city, street, zip, percent) {
		return {
			card_number: num,
			cust_surname: surname,
			cust_name: name,
			cust_patronymic: patronymic,
			phone_number: phone,
			city: city,
			street: street,
			zip_code: zip,
			percent: percent
		};
	}
}
