import {action, flow, makeObservable, observable} from "mobx";

export class BasicListStore {
	@observable
	state = "idle";
	@observable
	data = [];
	@observable
	page = 1;
	@observable
	totalPages = 1;
	@observable
	searchQuery = "";

	constructor() {makeObservable(this);}
	@flow
	*fetch(){}

	@action
	goToPage = (page) => {
		if (page > this.totalPages) return;
		this.page = page;
		this.fetch();
	}

	@action
	doSearch = (value) => {
		if (this.searchQuery === value) return;
		this.page = 1;
		this.searchQuery = value;
		this.fetch();
	}

	getQuery() {
		return {page: this.page, search: this.searchQuery};
	}
}
