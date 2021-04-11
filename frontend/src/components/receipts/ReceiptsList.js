import {observer} from "mobx-react";
import {Table} from "antd";

const ReceiptsList = (props) => {
	return (
		<Table dataSource={props.data} pagination={false}>
			<Table.Column dataIndex="check_number" title="#" sorter=
				{(a,b) => a.check_number > b.check_number}/>
			<Table.Column dataIndex="id_employee_name" title="Працівник" sorter=
				{(a,b) => a.id_employee_name.toLowerCase().localeCompare(b.id_employee_name.toLowerCase())}/>
			<Table.Column dataIndex="card_number_name" title="Покупець" sorter=
				{(a,b) => a.card_number_name.toLowerCase().localeCompare(b.card_number_name.toLowerCase())}/>
			<Table.Column dataIndex="print_date" title="Дата" sorter=
				{(a,b) => a.print_date.toLowerCase().localeCompare(b.print_date.toLowerCase())}/>
			<Table.Column dataIndex="sum_total" title="Сума" sorter=
				{(a,b) => a.sum_total > b.sum_total}/>
			<Table.Column dataIndex="vat" title="ПДВ" sorter=
				{(a,b) => a.vat > b.vat}/>
		</Table>
	);
}

export default observer(ReceiptsList);
