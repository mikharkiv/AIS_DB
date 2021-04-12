import {observer} from "mobx-react";
import {Col, Form, Input, InputNumber, Row, Select, DatePicker, Table, Button} from "antd";
import {useState} from "react";
import CategoryAutocomplete from "./selects/CategorySelectBar";
import ReceiptAutocomplete from "./selects/ReceiptSelectBar";
import EmployeeAutocomplete from "./selects/EmployeeSelectBar";
import GoodAutocomplete from "./selects/GoodSelectBar";
import ShopGoodAutocomplete from "./selects/ShopGoodSelectBar";
import {QueriesAPI} from "../api/QueriesAPI";

const moment = require('moment');

const QueriesWindow = (props) => {
	const [query, setQuery] = useState(null);
	const [data, setData] = useState([]);

	let onQuerySelect = (key, opt) => {
		setQuery(props.queries.find((e) => e.id == opt.key));
	};

	let onSubmit = (data) => {
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
		console.log(out);
		QueriesAPI.query(query.id, out).then((r) => setData(r));
	}

	return (
		<Row align="justify">
			<Col span={20}>
				<Form onFinish={onSubmit}>
					<Form.Item >
						<Select onSelect={onQuerySelect}>
							{props.queries.map((el) =>
							(<Select.Option key={el.id} value={el.text}>{el.id + ' ' + el.text}</Select.Option>))}
						</Select>
					</Form.Item>
					{query && query.deps && query.deps.includes('category') && (
						<Form.Item name="category" label="Категорія"
						           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
							<CategoryAutocomplete />
						</Form.Item>
					)}
					{query && query.deps && query.deps.includes('empl_surname') && (
						<Form.Item name="empl_surname" label="Прізвище працівника"
						           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
							<Input placeholder="Прізвище працівника..." maxLength={30}/>
						</Form.Item>
					)}
					{query && query.deps && query.deps.includes('good') && (
						<Form.Item name="good" label="Товар"
						           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
							<GoodAutocomplete />
						</Form.Item>
					)}
					{query && query.deps && query.deps.includes('shop_good') && (
						<Form.Item name="shop_good" label="Товар у магазині"
						           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
							<ShopGoodAutocomplete />
						</Form.Item>
					)}
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
					{query && query.deps && query.deps.includes('percent') && (
						<Form.Item name="percent" label="% знижки"
						           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
							<InputNumber min={0} max={100} precision={0.01} />
						</Form.Item>
					)}
					{query && query.deps && query.deps.includes('receipt') && (
						<Form.Item name="receipt" label="Номер чеку"
						           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
							<ReceiptAutocomplete />
						</Form.Item>
					)}
					{query && query.deps && query.deps.includes('cust_surname') && (
						<Form.Item name="cust_surname" label="Прізвище клієнта"
						           rules={[{required: true, message: 'Це обов\'язкове поле'}]}>
							<Input placeholder="Прізвище клієнта..." maxLength={30}/>
						</Form.Item>
					)}
					<Form.Item>
						<Button type="primary" htmlType="submit">Зробити запит</Button>
					</Form.Item>
				</Form>
			</Col>
			<Col span={20}>
				<Table pagination={false} dataSource={data}>
					{data && data.length > 0 && data[0] &&
					Object.keys(data[0]).map((key) => (
						<Table.Column dataIndex={key} title={key} />
					))}
				</Table>
			</Col>
		</Row>
	);
}

export default observer(QueriesWindow);
