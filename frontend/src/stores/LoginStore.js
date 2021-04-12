import {makeAutoObservable, runInAction} from "mobx";
import {Api} from "../api/Api";


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

	}

	*doLogin(login, password, callback) {
		if (this.isLoggedIn) {
			callback.call();
			return;
		}
		this.state = "loading";
		yield Api.fetchNoToken('http://localhost:8080/api/login/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ empl_id: login, empl_pass: password})
		}).then((r) => {
			console.log(r);
			if (!r) {
				// this.isApiAvailable = false;
			} else if (r.ok)
				return r.json();
			else {
				this.isLoggedIn = false;
				this.errorLoggingIn = true;
				return Response.error();
			}
		}).then((r) => {
			if (!r) return;
			localStorage.setItem('token', r.accessToken);
			localStorage.setItem('refresh', r.refreshToken);
			this._loadMe();
			runInAction(() => {
				this.errorLoggingIn = false;
				this.hasLoggedOut = false;
				this.isLoggedIn = true;
			});
			if (callback)
				callback.call();
		});
	}

	*_loadMe() {
		// TODO load me
		this.me = {

		};
	}

	*doLogout() {
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
		localStorage.removeItem('login');
		localStorage.removeItem('password');
		localStorage.removeItem('remember');
		this.state = "idle";
		this.errorLoggingIn = false;
		this.isLoggedIn = false;
		this.hasLoggedOut = true;
	}
}
