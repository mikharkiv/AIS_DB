import {observer} from "mobx-react";
import {Table} from "antd";

const EmployeesList = (props) => {
	return (
		<Table dataSource={props.data} pagination={false} size="small"
			onRow={(record, rowIndex) => {
				return {
					onClick: event => props.onEdit(record.id_employee)
				};
			}}>
			<Table.Column dataIndex="id_employee" title="#" sorter=
				{(a,b) => a.id_employee - b.id_employee}/>
			<Table.Column dataIndex="empl_surname" title="Прізвище" sorter=
				{(a,b) => a.empl_surname.toLowerCase().localeCompare(b.empl_surname.toLowerCase())}/>
			<Table.Column dataIndex="empl_name" title="Ім'я" sorter=
				{(a,b) => a.empl_name.toLowerCase().localeCompare(b.empl_name.toLowerCase())}/>
			<Table.Column dataIndex="empl_patronymic" title="По батькові" sorter=
				{(a,b) => a.empl_patronymic.toLowerCase().localeCompare(b.empl_patronymic.toLowerCase())}/>
			<Table.Column dataIndex="role" title="Посада" sorter=
				{(a,b) => a.role.toLowerCase().localeCompare(b.role.toLowerCase())}/>
			<Table.Column dataIndex="salary" title="ЗП" sorter=
				{(a,b) => a.salary - b.salary}/>
			<Table.Column dataIndex="date_of_birth" title="Дата нар." sorter=
				{(a,b) => a.date_of_birth.toLowerCase().localeCompare(b.date_of_birth.toLowerCase())}/>
			<Table.Column dataIndex="date_of_start" title="Дата поч." sorter=
				{(a,b) => a.date_of_start.toLowerCase().localeCompare(b.date_of_start.toLowerCase())}/>
			<Table.Column dataIndex="phone_number" title="Телефон" sorter=
				{(a,b) => a.phone_number.toLowerCase().localeCompare(b.phone_number.toLowerCase())}/>
			<Table.Column dataIndex="city" title="Місто" sorter=
				{(a,b) => a.city.toLowerCase().localeCompare(b.city.toLowerCase())}/>
			<Table.Column dataIndex="street" title="Вулиця" sorter=
				{(a,b) => a.street.toLowerCase().localeCompare(b.street.toLowerCase())}/>
			<Table.Column dataIndex="zip_code" title="Індекс" sorter=
				{(a,b) => a.zip_code.toLowerCase().localeCompare(b.zip_code.toLowerCase())}/>
		</Table>
	);
}

export default observer(EmployeesList);
