import './App.css';
import {Redirect, Route, Switch} from "react-router";
import LoginPage from "./components/LoginPage";
import {useStores} from "./hooks/use-stores";
import {observer} from "mobx-react";

function App() {
	const loginStore = useStores().loginStore;

	return (
		<Switch>
			<Route exact path="/login" component={LoginPage} />
			{
				loginStore.isApiAvailable ? (
					loginStore.isLoggedIn ? (
						<>
						Ви увійшли
						</>
					) : (
						<Redirect to="/login" />
					)
				) : (
					<>
					Неможливо з'єднатись із сервером. Спробуйте ще раз пізніше
					</>
				)
			}
		</Switch>
	);
}

export default observer(App);
