import {observer} from "mobx-react";
import {Button, Form, Input, InputNumber, Modal} from "antd";
import {useState, useEffect} from "react";
import LoadingIcon from "../LoadingIcon";
import {CardsAPI} from "../../api/CardsAPI";
import {useStores} from "../../hooks/use-stores";
import {EmployeesAPI} from "../../api/EmployeesAPI";


const CardCreateEditModal = (props) => {
	const [form] = Form.useForm();
	const [isLoading, setLoading] = useState(true);

	const loginStore = useStores().loginStore;

	useEffect(() => {
		form.resetFields();
		if (!props.edit) setLoading(false);
		else CardsAPI.getCard(props.id).then((r) => form.setFieldsValue(r[0]));
	}, [props]);

	let onDelete = () => {
		if (!props.edit) return;
		form.resetFields();
		props.onDelete && props.onDelete(props.id);
	}

	return (
		<Modal visible={props.visible} title={(props.edit ? 'Редагувати' : 'Створити') + ' картку'}
		       okText={props.edit ? 'Змінити' : 'Створити'}
		       cancelText="Скасувати"
		       onCancel={props.onCancel}
		       onOk={() => form.validateFields().then((data) => props.onOk(data))}>
			{
				isLoading ? (<LoadingIcon />) : (
					<Form form={form}
					      layout="vertical">
						{!props.edit && (
							<Form.Item name="card_number" label="Номер картки"
							           rules={[{ required: true, message: 'Введіть номер картки' }]}>
								<Input maxLength={15} />
							</Form.Item>
						)}
						<Form.Item name="cust_surname" label="Прізвище"
						           rules={[{ required: true, message: 'Введіть прізвище' }]}>
							<Input maxLength={15} />
						</Form.Item>
						<Form.Item name="cust_name" label="Ім'я"
						           rules={[{ required: true, message: 'Введіть ім\'я' }]}>
							<Input maxLength={15} />
						</Form.Item>
						<Form.Item name="cust_patronymic" label="По батькові"
						           rules={[{ required: true, message: 'Введіть по батькові' }]}>
							<Input maxLength={15} />
						</Form.Item>
						<Form.Item name="phone_number" label="Телефон"
						           rules={[{ required: true, message: 'Введіть телефон', pattern: new RegExp('[0-9]+') }]}>
							<Input prefix="+" maxLength={12} />
						</Form.Item>
						<Form.Item name="city" label="Місто"
						           rules={[{ required: true, message: 'Введіть місто' }]}>
							<Input maxLength={15} />
						</Form.Item>
						<Form.Item name="street" label="Вулиця"
						           rules={[{ required: true, message: 'Введіть вулицю' }]}>
							<Input maxLength={25} />
						</Form.Item>
						<Form.Item name="zip_code" label="Індекс"
						           rules={[{ required: true, message: 'Введіть індекс', pattern: new RegExp('[0-9]+') }]}>
							<Input maxLength={5} />
						</Form.Item>
						<Form.Item name="percent" label="% знижки"
						           rules={[{ required: true, message: 'Введіть % знижки' }]}>
							<InputNumber suffix="%" min={0} max={100} precision={0.01}/>
						</Form.Item>
					</Form>
				)}
			{props.edit && loginStore.me.role === EmployeesAPI.ROLES.MANAGER && (<Button danger onClick={onDelete}>Видалити</Button>)}
		</Modal>
	);
}

export default observer(CardCreateEditModal);
