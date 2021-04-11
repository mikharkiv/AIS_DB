import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Col, Pagination, Row} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect} from "react";
import {useHistory} from "react-router";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import ReceiptsList from "./ReceiptsList";
import {ReceiptsAPI} from "../../api/ReceiptsAPI";

class ReceiptsPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield ReceiptsAPI.getReceipts(this.getQuery()).then((r) => this.data = this._prepareData(r));
		this.state = "done";
	}

	_prepareData(data) {
		return data.map((e) => {
			e.id_employee_name = e.id_employee.empl_name + ' ' + e.id_employee.empl_surname;
			e.card_number_name = e.card_number.cust_name + ' ' + e.card_number.cust_surname;
			return e;
		});
	}
}

const ReceiptsPage = () => {
	const store = useMemo(() => new ReceiptsPageStore(), []);
	const history = useHistory();
	const header = useStores().headerStore;

	useEffect(() => {
		header.setupHeading(false, 'Чеки');
		store.fetch()
	}, []);

	let onAdd = () => {history.push('/');}; // TODO

	return (
		<>
		<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<ReceiptsList data={store.data} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
		</>
	);
}

export default observer(ReceiptsPage);
