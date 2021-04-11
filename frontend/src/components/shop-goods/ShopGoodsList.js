import {observer} from "mobx-react";
import {Table} from "antd";

const ShopGoodsList = (props) => {
	return (
		<Table dataSource={props.data} pagination={false}>
			<Table.Column dataIndex="upc" title="#" sorter=
				{(a,b) => a.upc > b.upc}/>
			<Table.Column dataIndex="upc_prom_id" title="# акційний" sorter=
				{(a,b) => a.upc_prom_id > b.upc_prom_id}/>
			<Table.Column dataIndex="id_product_id" title="# товару" sorter=
				{(a,b) => a.id_product_id > b.id_product_id}/>
			<Table.Column dataIndex="selling_price" title="Ціна" sorter=
				{(a,b) => a.selling_price > b.selling_price}/>
			<Table.Column dataIndex="products_number" title="К-ть товару" sorter=
				{(a,b) => a.products_number > b.products_number}/>
			<Table.Column dataIndex="promotional_product_str" title="Акційний?" sorter=
				{(a,b) => a.promotional_product_str.toLowerCase().localeCompare(b.promotional_product_str.toLowerCase())}/>
		</Table>
	);
}

export default observer(ShopGoodsList);
