import {observer} from "mobx-react";
import {Button, Checkbox, Form, Input, InputNumber, Modal} from "antd";
import {useState, useEffect} from "react";
import LoadingIcon from "../LoadingIcon";
import {ShopGoodsAPI} from "../../api/ShopGoodsAPI";
import ShopGoodAutocomplete from "../selects/ShopGoodSelectBar";
import GoodAutocomplete from "../selects/GoodSelectBar";

const ShopGoodCreateEditModal = (props) => {
	const [form] = Form.useForm();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		form.resetFields();
		console.log(props.id);
		if (!props.edit) setLoading(false);
		else ShopGoodsAPI.getShopGood(props.id).then((res) => {
			if (!res) return;
			let r = Object.assign({}, res);
			if (res.upc_prom)
				r.upc_prom = {key: r.upc_prom.upc, value: r.upc_prom.upc + ' ' + r.id_product.product_name};
			r.id_product = {key: r.id_product.id_product, value: r.id_product.product_name};
			console.log(r);
			form.setFieldsValue(r);
		});
		setLoading(false);
	}, [props]);

	let onDelete = () => {
		if (!props.edit) return;
		form.resetFields();
		props.onDelete && props.onDelete(props.id);
	}

	return (
		<Modal visible={props.visible} title={(props.edit ? 'Редагувати' : 'Створити') + ' товар у магазині'}
		       okText={props.edit ? 'Змінити' : 'Створити'}
		       cancelText="Скасувати"
		       onCancel={props.onCancel}
		       onOk={() => form.validateFields().then((data) => props.onOk(data))}>
			{
				isLoading ? (<LoadingIcon />) : (
					<Form form={form}
					      layout="vertical">
						<Form.Item name="upc_prom" label="Акційний товар"
						           rules={[{ required: true, message: 'Виберіть акційний товар' }]}>
							<ShopGoodAutocomplete />
						</Form.Item>
						<Form.Item name="id_product" label="Продукт"
						           rules={[{ required: true, message: 'Виберіть продукт' }]}>
							<GoodAutocomplete />
						</Form.Item>
						<Form.Item name="selling_price" label="Ціна продажу"
						           rules={[{ required: true, message: 'Введіть ціну продажу' }]}>
							<InputNumber min={0.01} max={1000000} precision={0.01} />
						</Form.Item>
						<Form.Item name="products_number" label="К-ть одиниць"
						           rules={[{ required: true, message: 'Введіть кількість одиниць' }]}>
							<InputNumber min={0} max={10000000} precision={1} />
						</Form.Item>
						<Form.Item name="promotional_product" label="Акційний товар">
							<Checkbox>Цей товар акційний</Checkbox>
						</Form.Item>
					</Form>
				)}
			{props.edit && (<Button danger onClick={onDelete}>Видалити</Button>)}
		</Modal>
	);
}

export default observer(ShopGoodCreateEditModal);
