import './App.css';
import {Redirect, Route, Switch} from "react-router";
import LoginPage from "./components/LoginPage";
import {useStores} from "./hooks/use-stores";
import {observer} from "mobx-react";
import MainLayout from "./components/MainLayout";

const App = () => {
	let loginStore = useStores().loginStore;

	return (
		<Switch>
			<Route exact path="/login" component={LoginPage} />
			{
				loginStore.isApiAvailable ? (
					loginStore.isLoggedIn ? (
						<MainLayout />
					) : (<Redirect to="/login" />)
				) : (
					<>Неможливо з'єднатись із сервером. Спробуйте ще раз пізніше</>
				)
			}
		</Switch>
	);
}

export default observer(App);
