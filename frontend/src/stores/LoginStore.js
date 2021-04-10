import {makeAutoObservable} from "mobx";


export class LoginStore {
	state = "idle";
	isApiAvailable = true;
	isLoggedIn = false;
	hasLoggedOut = false;
	errorLoggingIn = undefined;

	me = {};

	constructor() {
		makeAutoObservable(this);
		this._loadFromStorage();
	}

	_loadFromStorage() {
		if (localStorage.length === 0) return;
		let token = localStorage.getItem("token");
		// TODO some login logic
	}

	*doLogin(login, password, callback) {
		this.state = "loading";
		// TODO some login logics
		this._loadMe();
		this.isLoggedIn = true;
		if (callback) callback.call();
	}

	*_loadMe() {
		// TODO load me
		this.me = {

		};
	}

	*doLogout() {
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
		this.state = "idle";
		this.errorLoggingIn = false;
		this.isLoggedIn = false;
		this.hasLoggedOut = true;
	}
}
