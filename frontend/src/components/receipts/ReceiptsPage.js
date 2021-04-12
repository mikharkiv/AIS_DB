import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Button, Col, DatePicker, Divider, Form, message, Pagination, Row, Select} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect, useState} from "react";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import ReceiptsList from "./ReceiptsList";
import {ReceiptsAPI} from "../../api/ReceiptsAPI";
import ReceiptCreateEditModal from "./ReceiptCreateEditModal";
import EmployeeAutocomplete from "../selects/EmployeeSelectBar";
import {QueriesAPI} from "../../api/QueriesAPI";

class ReceiptsPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch(query = null, data = {}) {
		this.state = "loading";
		if (!query)
			yield ReceiptsAPI.getReceipts(this.getQuery()).then((r) =>{
				console.log(r.results);
				this.totalPages = r.total_pages;
				this.data = this._prepareData(r.results);
			});
		else if (query.id == 13 || query.id == 14)
			yield QueriesAPI.query(query.id, data).then((r) => {
				console.log(r.results);
				this.totalPages = r.total_pages;
				this.data = this._prepareData(r.results);
			});
		this.state = "done";
	}

	_prepareData(data) {
		return data.map((e) => {
			e.id_employee_name = e.id_employee.empl_name + ' ' + e.id_employee.empl_surname;
			console.log(e.card_number);
			e.card_number && (e.card_number_name = e.card_number.cust_name + ' ' + e.card_number.cust_surname);
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

	const queries = [
		{id: 13, text: "Скласти список чеків, видрукуваних певним касиром за певний період часу (з можливістю перегляду куплених товарів, їх к-сті та ціни);", deps: ['employee', 'time_period']},
		{id: 14, text: "Скласти список чеків, видрукуваних усіма касирами за певний період часу (з можливістю перегляду куплених товарів, їх к-сті та ціни );", deps: ['time_period']},
	];
	const [query, setQuery] = useState(null);

	let onFormSubmit = (data) => {
		if (data.hasOwnProperty('time_period')){
			data['time1'] = data['time_period'][0].format('DD.MM.YYYY').toString();
			data['time2'] = data['time_period'][1].format('DD.MM.YYYY').toString();
		}
		let values = Object.values(data);
		let out = {};
		if (values.length === 1) out = {par: values[0]};
		else for (let i = 0; i < values.length; i++) {
			out[`par${i && i}`] = values[i];
		}
		store.fetch(query, out);
	};

	let onQuerySelect = (key, opt) => {
		if (opt.key == 0) {
			setQuery(null);
			store.fetch();
			return;
		}
		setQuery(queries.find((e) => e.id == opt.key));
	};

	return (
		<>
		<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<ReceiptsList data={store.data} onEdit={onEdit} />
				</Col>
			</Row>
			<Divider>Запити</Divider>
			<Form onFinish={onFormSubmit}>
				<Form.Item>
					<Select onSelect={onQuerySelect}>
						<Select.Option key={0} value="Немає запиту">Немає запиту</Select.Option>
						{queries.map((el) =>
							(<Select.Option key={el.id} value={el.text}>{el.id + ' ' + el.text}</Select.Option>))}
					</Select>
				</Form.Item>
				{query && query.deps && query.deps.includes('time_period') && (
					<Form.Item name="time_period" label="Період часу"
					           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
						<DatePicker.RangePicker
							format={'DD.MM.YYYY'} />
					</Form.Item>
				)}
				{query && query.deps && query.deps.includes('employee') && (
					<Form.Item name="employee" label="Працівник"
					           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
						<EmployeeAutocomplete />
					</Form.Item>
				)}
				<Form.Item>
					<Button type="primary" htmlType="submit">Зробити запит</Button>
				</Form.Item>
			</Form>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
			<ReceiptCreateEditModal onOk={modalParams.onOk} onCancel={modalParams.onCancel} onDelete={onDelete}
			                         id={modalParams.id} edit={modalParams.edit} visible={modalVisible} />
		</>
	);
}

export default observer(ReceiptsPage);
