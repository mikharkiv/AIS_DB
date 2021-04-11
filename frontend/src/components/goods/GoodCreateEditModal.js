import {observer} from "mobx-react";
import {Button, Form, Input, InputNumber, Modal} from "antd";
import {useState, useEffect} from "react";
import LoadingIcon from "../LoadingIcon";
import {GoodsAPI} from "../../api/GoodsAPI";
import CategoryAutocomplete from "../selects/CategorySelectBar";

const GoodCreateEditModal = (props) => {
	const [form] = Form.useForm();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		form.resetFields();
		if (!props.edit) setLoading(false);
		else GoodsAPI.getGood(props.id).then((res) => {
			if (!res) return;
			let r = Object.assign({}, res);
			r.category_number = {key: r.category_number.category_number, value: r.category_number.category_name};
			form.setFieldsValue(r);
			console.log(GoodsAPI._goods);
		});
		setLoading(false);
	}, [props]);

	let onDelete = () => {
		if (!props.edit) return;
		form.resetFields();
		props.onDelete && props.onDelete(props.id);
	}

	return (
		<Modal visible={props.visible} title={(props.edit ? 'Редагувати' : 'Створити') + ' товар'}
		       okText={props.edit ? 'Змінити' : 'Створити'}
		       cancelText="Скасувати"
		       onCancel={props.onCancel}
		       onOk={() => form.validateFields().then((data) => props.onOk(data))}>
			{
				isLoading ? (<LoadingIcon />) : (
					<Form form={form}
					      layout="vertical">
						<Form.Item name="category_number" label="Категорія"
						           rules={[{ required: true, message: 'Виберіть категорію' }]}>
							<CategoryAutocomplete />
						</Form.Item>
						<Form.Item name="product_name" label="Ім'я"
						           rules={[{ required: true, message: 'Введіть ім\'я' }]}>
							<Input maxLength={15} />
						</Form.Item>
						<Form.Item name="characteristics" label="Характеристики"
						           rules={[{ required: true, message: 'Введіть характеристики' }]}>
							<Input.TextArea rows={5} maxLength={100} />
						</Form.Item>
					</Form>
				)}
			{props.edit && (<Button danger onClick={onDelete}>Видалити</Button>)}
		</Modal>
	);
}

export default observer(GoodCreateEditModal);
