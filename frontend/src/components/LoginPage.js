import {observer} from "mobx-react";
import {Button, Checkbox, Col, Form, Input, Row, Typography} from "antd";
import {useStores} from "../hooks/use-stores";
import {useEffect} from "react";
import {Redirect} from "react-router";

const {Title, Text} = Typography;

const LoginPage = () => {
	const store = useStores().loginStore;
	let initialData = {};

	useEffect(() => {
		if (localStorage.getItem('login') && localStorage.getItem('password')) {
			initialData['login'] = localStorage.getItem('login');
			initialData['password'] = localStorage.getItem('password');
			if (localStorage.getItem('remember'))
				login(initialData);
		}
	}, []);

	let login = (data) => {
		if (!data) return;
		localStorage.setItem('login', data.login);
		localStorage.setItem('password', data.password);
		localStorage.setItem('remember', data.remember);
		store.doLogin(data.login, data.password);
	}

	return (
		<Row style={{height: "100vh"}} align="middle" justify="center">
			{
				store.isLoggedIn && (<Redirect to="/" />)
			}
			<Col span={8}>
				<Form onFinish={login} initialValues={initialData}>
					<Title style={{width: "100%", textAlign: "center", marginBottom: "40px"}}>
						Вхід до АІС
					</Title>
					<Form.Item
						name="login"
						rules={[{required: true, message: 'Введіть логін'}]}
					>
						<Input placeholder="Логін"/>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[{required: true, message: 'Введіть пароль'}]}
					>
						<Input.Password placeholder="Пароль"/>
					</Form.Item>
					<Form.Item
						name="remember">
						<Checkbox>Запам'ятати мене</Checkbox>
					</Form.Item>
					<Form.Item
					>
						<Button type="primary" htmlType="submit">Увійти</Button>
					</Form.Item>
					<Form.Item
					>
						{store.errorLoggingIn &&
						(<Text type="danger" style={{display: "block", textAlign: "center"}}>
							Неправильний логін або пароль</Text>)}
						{store.hasLoggedOut &&
						(<Text strong style={{display: "block", textAlign: "center"}}>
							Ви вийшли з облікового запису</Text>)}
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
}

export default observer(LoginPage);
