import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Col, Pagination, Row} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect} from "react";
import {useHistory} from "react-router";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import EmployeesList from "./EmployeesList";
import {EmployeesAPI} from "../../api/EmployeesAPI";

class EmployeesPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield EmployeesAPI.getEmployees(this.getQuery()).then((r) => this.data = r);
		this.state = "done";
	}
}

const EmployeesPage = () => {
	const store = useMemo(() => new EmployeesPageStore(), []);
	const history = useHistory();
	const header = useStores().headerStore;

	useEffect(() => {
		header.setupHeading(false, 'Працівники');
		store.fetch()
	}, []);

	let onAdd = () => {history.push('/');}; // TODO

	return (
		<>
		<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={24}>
				<Col span={24}>
					<EmployeesList data={store.data} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
		</>
	);
}

export default observer(EmployeesPage);
