import {observer} from "mobx-react";
import {Table} from "antd";
import {CardsAPI} from "../../api/CardsAPI";
import {useEffect} from "react";

const CardsList = (props) => {
	return (
		<Table dataSource={props.data} pagination={false}>
			<Table.Column dataIndex="card_number" title="#" sorter=
				{(a,b) => a.card_number > b.card_number}/>
			<Table.Column dataIndex="cust_surname" title="Прізвище" sorter=
				{(a,b) => a.cust_surname.toLowerCase().localeCompare(b.cust_surname.toLowerCase())}/>
			<Table.Column dataIndex="cust_name" title="Ім'я" sorter=
				{(a,b) => a.cust_name.toLowerCase().localeCompare(b.cust_name.toLowerCase())}/>
			<Table.Column dataIndex="cust_patronymic" title="По батькові" sorter=
				{(a,b) => a.cust_patronymic.toLowerCase().localeCompare(b.cust_patronymic.toLowerCase())}/>
			<Table.Column dataIndex="phone_number" title="Телефон" sorter=
				{(a,b) => a.phone_number.toLowerCase().localeCompare(b.phone_number.toLowerCase())}/>
			<Table.Column dataIndex="city" title="Місто" sorter=
				{(a,b) => a.city.toLowerCase().localeCompare(b.city.toLowerCase())}/>
			<Table.Column dataIndex="street" title="Вулиця" sorter=
				{(a,b) => a.street.toLowerCase().localeCompare(b.street.toLowerCase())}/>
			<Table.Column dataIndex="zip_code" title="Індекс" sorter=
				{(a,b) => a.zip_code.toLowerCase().localeCompare(b.zip_code.toLowerCase())}/>
			<Table.Column dataIndex="percent" title="% знижки" sorter=
				{(a,b) => a.percent > b.percent}/>
		</Table>
	);
}

export default observer(CardsList);
