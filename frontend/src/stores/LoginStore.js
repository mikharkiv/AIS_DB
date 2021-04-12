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
		if (localStorage.length === 0) return;
		let token = localStorage.getItem('token');
		if (!token) return;
		Api.fetchNoToken('http://localhost:8000/api/me/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({token})
		}).then((r) => {
			if (!r) {
				this.isApiAvailable = false;
			} else if (r.ok) {
				this.errorLoggingIn = false;
				this.isLoggedIn = true;
			}
			else {
				this.isLoggedIn = false;
				this.errorLoggingIn = true;
				return Response.error();
			}
			this.state = "inited";
		});
	}

	*doLogin(login, password, callback) {
		if (this.isLoggedIn) {
			callback.call();
			return;
		}
		this.state = "loading";
		yield Api.fetchNoToken('http://localhost:8000/api/token/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ empl_id: login, empl_pass: password})
		}).then((r) => {
			if (!r) {
				this.isApiAvailable = false;
			} else if (r.ok)
				return r.json();
			else {
				this.isLoggedIn = false;
				this.errorLoggingIn = true;
				return Response.error();
			}
		}).then((r) => {
			localStorage.setItem('token', r.accessToken);
			localStorage.setItem('refresh', r.refreshToken);
			this.errorLoggingIn = false;
			this.isLoggedIn = true;
			if (callback)
				callback.call();
		});
		this._loadMe();
		runInAction(() => {
			this.errorLoggingIn = false;
			this.hasLoggedOut = false;
			this.isLoggedIn = true;
		});
		if (callback)
			callback.call();
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
