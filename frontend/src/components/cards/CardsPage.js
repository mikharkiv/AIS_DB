import SearchAddBar from "../SearchAddBar";
import CardsList from "./CardsList";
import {Col, Pagination, Row, message} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect, useState} from "react";
import {CardsAPI} from "../../api/CardsAPI";
import {useHistory} from "react-router";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import CardCreateEditModal from "./CardCreateEditModal";
import {observer} from "mobx-react";

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
	const header = useStores().headerStore;

	const [modalVisible, setModalVisible] = useState(false);
	const [modalParams, setModalParams] = useState({});

	useEffect(() => {
		header.setupHeading(false, 'Карти клієнтів');
		store.fetch()
	}, []);

	let onAdd = () => {
		setModalParams({
			edit: false,
			onOk: (data) => {
				CardsAPI.addCard(data).then((r) => {
					message.success('Картку успішно додано!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onEdit = (card_id) => {
		setModalParams({
			id: card_id,
			edit: true,
			onOk: (data) => {
				CardsAPI.updateCard(card_id, data).then((r) => {
					message.success('Картку успішно змінено!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onDelete = (card_id) => {
		CardsAPI.removeCard(card_id).then((r) => {
			message.success('Картку успішно видалено!');
			store.fetch();
			setModalVisible(false);
		});
	}

	return (
		<>
			<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<CardsList data={store.data} onEdit={onEdit} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
			<CardCreateEditModal onOk={modalParams.onOk} onCancel={modalParams.onCancel} onDelete={onDelete}
			                     id={modalParams.id} edit={modalParams.edit} visible={modalVisible} />
		</>
	);
}

export default observer(CardsPage);
