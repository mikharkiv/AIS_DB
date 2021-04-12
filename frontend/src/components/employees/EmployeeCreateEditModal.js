import {observer} from "mobx-react";
import {Button, DatePicker, Form, Input, InputNumber, Modal, Select} from "antd";
import locale from "antd/es/date-picker/locale/uk_UA";
import {useState, useEffect} from "react";
import LoadingIcon from "../LoadingIcon";
import {EmployeesAPI} from "../../api/EmployeesAPI";
const moment = require('moment');

const EmployeeCreateEditModal = (props) => {
	const [form] = Form.useForm();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		form.resetFields();
		if (!props.edit) setLoading(false);
		else EmployeesAPI.getEmployee(props.id).then((r) => {
			if (!r) return;
			r.date_of_birth = moment(r.date_of_birth, "DD.MM.YYYY");
			r.date_of_start = moment(r.date_of_start, "DD.MM.YYYY");
			form.setFieldsValue(r);
		});
	}, [props]);

	let onDelete = () => {
		if (!props.edit) return;
		form.resetFields();
		props.onDelete && props.onDelete(props.id);
	}

	return (
		<Modal visible={props.visible} title={(props.edit ? 'Редагувати' : 'Створити') + ' працівника'}
		       okText={props.edit ? 'Змінити' : 'Створити'}
		       cancelText="Скасувати"
		       onCancel={props.onCancel}
		       onOk={() => form.validateFields().then((data) => {
		       	data.date_of_start = data.date_of_start.format('DD.MM.YYYY').toString();
		       	data.date_of_birth = data.date_of_birth.format('DD.MM.YYYY').toString();
		       	props.onOk(data)
		       })}>
			{
				isLoading ? (<LoadingIcon />) : (
					<Form form={form}
					      layout="vertical">
						<Form.Item name="empl_surname" label="Прізвище"
						           rules={[{ required: true, message: 'Введіть прізвище' }]}>
							<Input maxLength={15} />
						</Form.Item>
						<Form.Item name="empl_name" label="Ім'я"
						           rules={[{ required: true, message: 'Введіть ім\'я' }]}>
							<Input maxLength={15} />
						</Form.Item>
						<Form.Item name="empl_patronymic" label="По батькові"
						           rules={[{ required: true, message: 'Введіть по батькові' }]}>
							<Input maxLength={15} />
						</Form.Item>
						<Form.Item name="role" label="Посада"
						           rules={[{ required: true, message: 'Введіть посаду' }]}>
							<Select placeholder="Виберіть посаду...">
								<Select.Option value={EmployeesAPI.ROLES.CASHIER}>Менеджер</Select.Option>
								<Select.Option value={EmployeesAPI.ROLES.MANAGER}>Касир</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item name="salary" label="Зарплата"
						           rules={[{ required: true, message: 'Введіть зарплату' }]}>
							<InputNumber min={0} max={10000000} precision={0.1}/>
						</Form.Item>
						<Form.Item name="date_of_birth" label="Дата народження"
						           rules={[{ required: true, message: 'Введіть дату народження' }]}>
							<DatePicker locale={locale}
							            format={(t) => t.format('DD.MM.YYYY').toString()}
							            disabledDate={(cur) => cur.isSameOrAfter(moment().startOf('day'))} />
						</Form.Item>
						<Form.Item name="date_of_start" label="Дата початку роботи"
						           rules={[{ required: true, message: 'Введіть дату народження' }]}>
							<DatePicker locale={locale}
							            format={(t) => t.format('DD.MM.YYYY').toString()}
							            disabledDate={(cur) => cur.isSameOrAfter(moment().startOf('day'))} />
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
					</Form>
				)}
			{props.edit && (<Button danger onClick={onDelete}>Видалити</Button>)}
		</Modal>
	);
}

export default observer(EmployeeCreateEditModal);
