import {makeAutoObservable} from "mobx";

export class PageHeaderStore {
	headerTitle = "";
	headerSecondary = "";
	canBack = false;

	constructor() {
		makeAutoObservable(this);
	}

	setupHeading = (canBack = false, title = "", secondary = "") => {
		this.canBack = canBack;
		this.headerTitle = title;
		this.headerSecondary = secondary;
	}
}
