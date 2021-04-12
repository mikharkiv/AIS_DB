import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Col, Pagination, Row, message} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect, useState} from "react";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import CategoriesList from "./CategoriesList";
import {CategoriesAPI} from "../../api/CategoriesAPI";
import CategoryCreateEditModal from "./CategoryCreateEditModal";
import {EmployeesAPI} from "../../api/EmployeesAPI";

class CategoriesPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield CategoriesAPI.getCategories(this.getQuery()).then((r) => {
			this.totalPages = r.total_pages;
			this.data = r.results;
		});
		this.state = "done";
	}
}

const CategoriesPage = () => {
	const store = useMemo(() => new CategoriesPageStore(), []);
	const header = useStores().headerStore;
	const loginStore = useStores().loginStore;

	const [modalVisible, setModalVisible] = useState(false);
	const [modalParams, setModalParams] = useState({});

	useEffect(() => {
		header.setupHeading(false, 'Категорії');
		store.fetch()
	}, []);

	let onAdd = () => {
		setModalParams({
			edit: false,
			onOk: (data) => {
				CategoriesAPI.addCategory(data).then((r) => {
					message.success('Категорію успішно додано!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onEdit = (cat_id) => {
		if (loginStore.me.role !== EmployeesAPI.ROLES.MANAGER) return;
		setModalParams({
			id: cat_id,
			edit: true,
			onOk: (data) => {
				CategoriesAPI.updateCategory(cat_id, data).then((r) => {
					message.success('Категорію успішно змінено!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onDelete = (cat_id) => {
		CategoriesAPI.removeCategory(cat_id).then((r) => {
			message.success('Категорію успішно видалено!');
			store.fetch();
			setModalVisible(false);
		});
	}

	return (
		<>
			<SearchAddBar hasButton={loginStore.me.role === EmployeesAPI.ROLES.MANAGER} isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<CategoriesList data={store.data} onEdit={onEdit} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
			<CategoryCreateEditModal onOk={modalParams.onOk} onCancel={modalParams.onCancel} onDelete={onDelete}
			                     id={modalParams.id} edit={modalParams.edit} visible={modalVisible} />
		</>
	);
}

export default observer(CategoriesPage);
