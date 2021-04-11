import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Col, message, Pagination, Row} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect, useState} from "react";
import {useHistory} from "react-router";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import EmployeesList from "./EmployeesList";
import {EmployeesAPI} from "../../api/EmployeesAPI";
import CardCreateEditModal from "../cards/CardCreateEditModal";
import EmployeeCreateEditModal from "./EmployeeCreateEditModal";
import {CardsAPI} from "../../api/CardsAPI";

class EmployeesPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield EmployeesAPI.getEmployees(this.getQuery()).then((r) => this.data = r);
		this.state = "done";
	}
}

const EmployeesPage = () => {
	const store = useMemo(() => new EmployeesPageStore(), []);
	const header = useStores().headerStore;

	const [modalVisible, setModalVisible] = useState(false);
	const [modalParams, setModalParams] = useState({});

	useEffect(() => {
		header.setupHeading(false, 'Працівники');
		store.fetch()
	}, []);

	let onAdd = () => {
		setModalParams({
			edit: false,
			onOk: (data) => {
				EmployeesAPI.addEmployee(data).then((r) => {
					message.success('Працівника успішно додано!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onEdit = (empl_id) => {
		setModalParams({
			id: empl_id,
			edit: true,
			onOk: (data) => {
				EmployeesAPI.updateEmployee(empl_id, data).then((r) => {
					message.success('Працівника успішно змінено!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onDelete = (empl_id) => {
		EmployeesAPI.removeEmployee(empl_id).then((r) => {
			message.success('Працівника успішно видалено!');
			store.fetch();
			setModalVisible(false);
		});
	}

	return (
		<>
		<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={24}>
				<Col span={24}>
					<EmployeesList data={store.data} onEdit={onEdit} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
			<EmployeeCreateEditModal onOk={modalParams.onOk} onCancel={modalParams.onCancel} onDelete={onDelete}
			                     id={modalParams.id} edit={modalParams.edit} visible={modalVisible} />
		</>
	);
}

export default observer(EmployeesPage);
