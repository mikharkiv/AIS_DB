import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Col, message, Pagination, Row} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect, useState} from "react";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import ReceiptsList from "./ReceiptsList";
import {ReceiptsAPI} from "../../api/ReceiptsAPI";
import ReceiptCreateEditModal from "./ReceiptCreateEditModal";

class ReceiptsPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield ReceiptsAPI.getReceipts(this.getQuery()).then((r) => this.data = this._prepareData(r));
		this.state = "done";
	}

	_prepareData(data) {
		return data.map((e) => {
			e.id_employee_name = e.id_employee.empl_name + ' ' + e.id_employee.empl_surname;
			e.card_number_name = e.card_number.cust_name + ' ' + e.card_number.cust_surname;
			return e;
		});
	}
}

const ReceiptsPage = () => {
	const store = useMemo(() => new ReceiptsPageStore(), []);
	const header = useStores().headerStore;

	const [modalVisible, setModalVisible] = useState(false);
	const [modalParams, setModalParams] = useState({});

	useEffect(() => {
		header.setupHeading(false, 'Чеки');
		store.fetch()
	}, []);


	let onAdd = () => {
		setModalParams({
			edit: false,
			onOk: (data) => {
				console.log(data);
				ReceiptsAPI.addReceipt(data).then((r) => {
					message.success('Чек успішно додано!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onEdit = (rec_id) => {
		setModalParams({
			id: rec_id,
			edit: true,
			onOk: (data) => {
				ReceiptsAPI.updateReceipt(rec_id, data).then((r) => {
					message.success('Чек успішно змінено!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onDelete = (rec_id) => {
		ReceiptsAPI.removeReceipt(rec_id).then((r) => {
			message.success('Чек успішно видалено!');
			store.fetch();
			setModalVisible(false);
		});
	}

	return (
		<>
		<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<ReceiptsList data={store.data} onEdit={onEdit} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
			<ReceiptCreateEditModal onOk={modalParams.onOk} onCancel={modalParams.onCancel} onDelete={onDelete}
			                         id={modalParams.id} edit={modalParams.edit} visible={modalVisible} />
		</>
	);
}

export default observer(ReceiptsPage);
