import { Layout, Menu, PageHeader } from 'antd';
import {
	HomeOutlined,
	UserOutlined,
	ContactsOutlined,
	AppstoreOutlined,
	CarryOutOutlined,
	TeamOutlined,
	FileOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import {Route, Switch} from "react-router-dom";
import {useRouteMatch} from "react-router-dom";
import {observer} from "mobx-react";
import {useHistory} from "react-router";
import {useStores} from "../hooks/use-stores";
import CardsPage from "./cards/CardsPage";
import CategoriesPage from "./categories/CategoriesPage";

const { Content, Sider } = Layout;


const MainLayout = () => {
	const { path, url } = useRouteMatch();
	const history = useHistory();
	const loginStore = useStores().loginStore;
	const headerStore = useStores().headerStore;

	const paths = ['/', '/employees', '/goods', '/shop_goods', '/categories', '/receipts', '/cards'];
	let purePaths = paths.slice();
	purePaths.forEach((e) => e.replace('/', ''));

	return (
		<Layout>
			<Sider>
				<Menu mode="inline" theme="dark" style={{height: "100vh"}} onClick={
					({key}) => {
						if (key === "7") {
							loginStore.doLogout();
						} else history.push(paths[key]);
					}
				}>
					<Menu.Item key="0" icon={<HomeOutlined/>}>Головна</Menu.Item>
					<Menu.Item key="1" icon={<UserOutlined/>}>Працівники</Menu.Item>
					<Menu.Item key="2" icon={<AppstoreOutlined/>}>Товари</Menu.Item>
					<Menu.Item key="3" icon={<CarryOutOutlined/>}>Товари в магазині</Menu.Item>
					<Menu.Item key="4" icon={<ContactsOutlined/>}>Категорії</Menu.Item>
					<Menu.Item key="5" icon={<TeamOutlined/>}>Чек</Menu.Item>
					<Menu.Item key="6" icon={<FileOutlined/>}>Карти клієнтів</Menu.Item>
					<Menu.Item key="7" icon={<LogoutOutlined/>}>Вийти</Menu.Item>
				</Menu>
			</Sider>
			<Content>
				<div className="page">
					<PageHeader
						onBack = {history.length > 0 && headerStore.canBack ? (() => history.goBack()) : false}
						title = {headerStore.headerTitle}
						subTitle = {headerStore.headerSecondary}
					/>
					<Switch>
						{/* Home */}
						<Route path={`${path}${purePaths[0]}`} component={null}/>
						{/* Employees */}
						<Route path={`${path}${purePaths[1]}`} component={null}/>
						{/* Goods */}
						<Route path={`${path}${purePaths[2]}`} component={null}/>
						{/* Shop goods */}
						<Route path={`${path}${purePaths[3]}`} component={null}/>
						{/* Categories */}
						<Route path={`${purePaths[4]}`} component={CategoriesPage}/>
						{/* Receipts */}
						<Route path={`${path}${purePaths[5]}`} component={null}/>
						{/* Cards */}
						<Route path={`${purePaths[6]}`} component={CardsPage}/>
					</Switch>
				</div>
			</Content>
		</Layout>
	);
}

export default observer(MainLayout);
