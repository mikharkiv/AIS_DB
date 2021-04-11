import {observer} from "mobx-react";
import {Button, Form, Input, InputNumber, Modal, Table, message, Divider, Typography} from "antd";
import {useState, useEffect} from "react";
import LoadingIcon from "../LoadingIcon";
import {ReceiptsAPI} from "../../api/ReceiptsAPI";
import CardAutocomplete from "../selects/CardSelectBar";
import ShopGoodAutocomplete from "../selects/ShopGoodSelectBar";
import {ShopGoodsAPI} from "../../api/ShopGoodsAPI";
const moment = require('moment');

const {Title} = Typography;

const ReceiptCreateEditModal = (props) => {
	const [form] = Form.useForm();
	const [productForm] = Form.useForm();
	const [isLoading, setLoading] = useState(true);
	const [sumTotal, setSumTotal] = useState(0);
	const [vat, setVat] = useState(0);
	const [items, setItems] = useState([]);
	const [productMode, setProductMode] = useState({
		edit: false,
	});

	useEffect(() => {
		setLoading(true);
		form.resetFields();
		if (!props.edit) setLoading(false);
		else ReceiptsAPI.getReceipt(props.id).then((res) => {
			if (!res) return;
			let r = Object.assign({}, res);
			console.log(r);
			r.print_date = moment(r.print_date, "DD.MM.YYYY");
			r.card_number = {key: r.card_number.card_number, value: r.card_number.cust_surname + ' ' + r.card_number.cust_name};
			setItems(r.products);
			form.setFieldsValue(r);
		});
		setLoading(false);
	}, [props]);

	// calculating total sum
	useEffect(() => {
		let total = items.reduce((pr, e) => pr + e.product.selling_price * e.count, 0);
		setSumTotal(total);
		setVat(total * 0.2 / 1.2);
	}, [items]);

	let onDelete = () => {
		if (!props.edit) return;
		form.resetFields();
		props.onDelete && props.onDelete(props.id);
	}

	let onProductTableClick = (r) => {
		setProductMode({edit: true});
		productForm.setFieldsValue({
			product: {key: r.product.upc, value: r.product.upc + ' ' + r.product.id_product.product_name},
			count: r.count
		})
	}

	let onProductTableDoubleClick = (r) => {
		setItems(items.filter((i) => i.product !== r.product));
		productForm.resetFields();
		setProductMode({edit: false});
		message.success('Товар видалено зі вмісту чеку!');
	}

	let onFormSubmit = (data) => {
		if (productMode.edit) {
			ShopGoodsAPI.getShopGood(data.product).then((p) => {
				let i = items.slice();
				i = i.filter((i) => i.product !== p);
				i.push({product: p, count: data.count});
				setItems(i);
				productForm.resetFields();
				setProductMode({edit: false});
				message.success('Товар змінено у вмісту чеку!');
			});
		} else {
			// add
			ShopGoodsAPI.getShopGood(data.product).then((p) => {
				if (items.filter((i) => i.product === p).length) {
					message.error('Цей продукт вже є у чеку!');
					productForm.resetFields();
					return;
				}
				let i = items.slice();
				i.push({product: p, count: data.count})
				setItems(i);
				message.success('Товар додано до вмісту чеку!');
			});
		}
	}

	return (
		<Modal visible={props.visible} title={(props.edit ? 'Редагувати' : 'Створити') + ' чек'}
		       okText={props.edit ? 'Змінити' : 'Створити'}
		       cancelText="Скасувати"
		       onCancel={props.onCancel}
		       onOk={() => form.validateFields().then((data) => props.onOk(data))}>
			{
				isLoading ? (<LoadingIcon />) : (
					<>
						<Form form={form}
						      layout="vertical">
							<Form.Item name="card_number" label="Картка користувача">
								<CardAutocomplete />
							</Form.Item>
							<Form.Item label="Всього">
								<Input disabled={true} value={sumTotal} />
							</Form.Item>
							<Form.Item label="ПДВ">
								<Input disabled={true} value={vat} />
							</Form.Item>
						</Form>
						<Divider>Продукти чеку</Divider>
						<Table dataSource={items} onRow={(record, rowIndex) => {
							return {
								onClick: event => onProductTableClick(record),
								onDoubleClick: event => onProductTableDoubleClick(record),
							};
						}} pagination={false}>
							<Table.Column dataIndex="product" title="Продукт" render={e => (
								<>{e.upc + ' ' + e.id_product.product_name}</>
							)}/>
							<Table.Column dataIndex="count" title="К-ть"/>
						</Table>
						<Divider>{productMode.edit ? 'Редагування одиниці товару' : 'Додавання одиниці товару'}</Divider>
						<Form layout="vertical" form={productForm} onFinish={onFormSubmit}>
							<Form.Item name="product" label="Товар"
							           rules={[{ required: true, message: 'Виберіть продукт' }]}>
								<ShopGoodAutocomplete />
							</Form.Item>
							<Form.Item name="count" label="Кількість"
							           rules={[{ required: true, message: 'Введіть кількість' }]}>
								<InputNumber min={1} max={1000000} precision={1} />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="sdsd" onClick={() =>
									productForm.validateFields().then((d) => onFormSubmit(d))
								}>{productMode.edit ? 'Змінити' : 'Додати'}</Button>
							</Form.Item>
						</Form>
					</>
				)}
			{props.edit && (<Button danger onClick={onDelete}>Видалити</Button>)}
		</Modal>
	);
}

export default observer(ReceiptCreateEditModal);
