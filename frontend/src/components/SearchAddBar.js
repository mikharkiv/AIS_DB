import {Button, Col, Input, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";

const {Search} = Input;
/**
 *
 * @param props.isLoading
 * @param props.onSearch
 * @param props.onAdd
 * @return {JSX.Element}
 * @constructor
 */
const SearchAddBar = (props) => {
	return (
		<Row key="row1" justify="center">
			<Col span={20}
			     style={{marginBottom: "20px", display: "flex"}}
			>
				<Search placeholder="Введіть запит для пошуку..."
				        onSearch={props.onSearch}
				        loading={props.isLoading}
				        style={{"flexGrow": 1, "marginRight": "15px"}}
				/>
				<Button type="primary" style={{backgroundColor: "green", borderColor: "green"}} icon={<PlusOutlined/>} onClick={props.onAdd}>Додати</Button>
			</Col>
		</Row>
	);
}

export default observer(SearchAddBar);
