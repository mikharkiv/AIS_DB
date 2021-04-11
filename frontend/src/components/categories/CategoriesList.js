import {observer} from "mobx-react";
import {Table} from "antd";

const CategoriesList = (props) => {
	return (
		<Table dataSource={props.data} pagination={false}
			onRow={(record, rowIndex) => {
				return {
					onClick: event => props.onEdit(record.category_number)
				};
			}}>
			<Table.Column dataIndex="category_number" title="#" sorter=
				{(a,b) => a.category_number - b.category_number}/>
			<Table.Column dataIndex="category_name" title="Назва" sorter=
				{(a,b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase())}/>
		</Table>
	);
}

export default observer(CategoriesList);
