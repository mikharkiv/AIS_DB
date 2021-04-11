import {observer} from "mobx-react";
import {Table} from "antd";

const GoodsList = (props) => {
	return (
		<Table dataSource={props.data} pagination={false}>
			<Table.Column dataIndex="id_product" title="#" sorter=
				{(a,b) => a.id_product > b.id_product}/>
			<Table.Column dataIndex="category_name" title="Категорія" sorter=
				{(a,b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase())}/>
			<Table.Column dataIndex="product_name" title="Ім'я" sorter=
				{(a,b) => a.product_name.toLowerCase().localeCompare(b.product_name.toLowerCase())}/>
			<Table.Column dataIndex="characteristics" title="Характеристики" sorter=
				{(a,b) => a.characteristics.toLowerCase().localeCompare(b.characteristics.toLowerCase())}/>
		</Table>
	);
}

export default observer(GoodsList);
