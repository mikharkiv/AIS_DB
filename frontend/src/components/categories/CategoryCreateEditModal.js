import {observer} from "mobx-react";
import {Button, Form, Input, InputNumber, Modal} from "antd";
import {useState, useEffect} from "react";
import LoadingIcon from "../LoadingIcon";
import {CategoriesAPI} from "../../api/CategoriesAPI";

const CategoryCreateEditModal = (props) => {
	const [form] = Form.useForm();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		form.resetFields();
		if (!props.edit) setLoading(false);
		else CategoriesAPI.getCategory(props.id).then((r) => form.setFieldsValue(r[0]));
	}, [props]);

	let onDelete = () => {
		if (!props.edit) return;
		form.resetFields();
		props.onDelete && props.onDelete(props.id);
	}

	return (
		<Modal visible={props.visible} title={(props.edit ? 'Редагувати' : 'Створити') + ' категорію'}
		       okText={props.edit ? 'Змінити' : 'Створити'}
		       cancelText="Скасувати"
		       onCancel={props.onCancel}
		       onOk={() => form.validateFields().then((data) => props.onOk(data))}>
			{
				isLoading ? (<LoadingIcon />) : (
					<Form form={form}
					      layout="vertical">
						<Form.Item name="category_name" label="Назва"
						           rules={[{ required: true, message: 'Введіть назву' }]}>
							<Input maxLength={15} />
						</Form.Item>
					</Form>
				)}
			{props.edit && (<Button danger onClick={onDelete}>Видалити</Button>)}
		</Modal>
	);
}

export default observer(CategoryCreateEditModal);
