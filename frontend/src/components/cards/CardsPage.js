import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import CardsList from "./CardsList";
import {Col, Pagination, Row} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect} from "react";
import {CardsAPI} from "../../api/CardsAPI";
import {useHistory} from "react-router";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";

class CardsPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield CardsAPI.getCards(this.getQuery()).then((r) => this.data = r);
		this.state = "done";
	}
}

const CardsPage = () => {
	const store = useMemo(() => new CardsPageStore(), []);
	const history = useHistory();
	const header = useStores().headerStore;

	useEffect(() => {
		header.setupHeading(false, 'Карти клієнтів');
		store.fetch()
	}, []);

	let onAdd = () => {history.push('/');}; // TODO

	return (
		<>
		<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<CardsList data={store.data} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
		</>
	);
}

export default observer(CardsPage);
