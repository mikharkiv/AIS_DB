import * as React from "react";
import {LoginStore} from "../stores/LoginStore";
import {PageHeaderStore} from "../stores/PageHeaderStore";

export const globalStores = {
	loginStore: new LoginStore(),
	headerStore: new PageHeaderStore(),
}

export const storesContext = React.createContext({
	loginStore: globalStores.loginStore,
	headerStore: globalStores.headerStore,
})
