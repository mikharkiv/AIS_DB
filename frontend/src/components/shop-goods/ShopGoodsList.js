import {observer} from "mobx-react";
import {Table} from "antd";

const ShopGoodsList = (props) => {
	return (
		<Table dataSource={props.data} pagination={false}
			onRow={(record, rowIndex) => {
				return {
					onClick: event => props.onEdit(record.UPC)
				};
			}}>
			<Table.Column dataIndex="UPC" title="#" sorter=
				{(a,b) => a.UPC - b.UPC}/>
			<Table.Column dataIndex="UPC_prom" title="# акційний" sorter=
				{(a,b) => a.UPC_prom - b.UPC_prom}/>
			<Table.Column dataIndex="id_product_id" title="# товару" sorter=
				{(a,b) => a.id_product_id - b.id_product_id}/>
			<Table.Column dataIndex="selling_price" title="Ціна" sorter=
				{(a,b) => a.selling_price - b.selling_price}/>
			<Table.Column dataIndex="products_number" title="К-ть товару" sorter=
				{(a,b) => a.products_number - b.products_number}/>
			<Table.Column dataIndex="promotional_product_str" title="Акційний?" sorter=
				{(a,b) => a.promotional_product_str.toLowerCase().localeCompare(b.promotional_product_str.toLowerCase())}/>
		</Table>
	);
}

export default observer(ShopGoodsList);
