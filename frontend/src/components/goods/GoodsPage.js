import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Col, message, Pagination, Row} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect, useState} from "react";
import {useHistory} from "react-router";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import GoodsList from "./GoodsList";
import {GoodsAPI} from "../../api/GoodsAPI";
import GoodCreateEditModal from "./GoodCreateEditModal";

class GoodsPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield GoodsAPI.getGoods(this.getQuery()).then((r) => this.data = this._prepareData(r));
		this.state = "done";
	}

	_prepareData(data) {
		return data.map((e) => {
			e.category_name = e.category_number.category_name;
			return e;
		});
	}
}

const GoodsPage = () => {
	const store = useMemo(() => new GoodsPageStore(), []);
	const history = useHistory();
	const header = useStores().headerStore;

	const [modalVisible, setModalVisible] = useState(false);
	const [modalParams, setModalParams] = useState({});

	useEffect(() => {
		header.setupHeading(false, 'Товари');
		store.fetch()
	}, []);

	let onAdd = () => {
		setModalParams({
			edit: false,
			onOk: (data) => {
				console.log(data);
				GoodsAPI.addGood(data).then((r) => {
					message.success('Товар успішно додано!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onEdit = (good_id) => {
		setModalParams({
			id: good_id,
			edit: true,
			onOk: (data) => {
				GoodsAPI.updateGood(good_id, data).then((r) => {
					message.success('Товар успішно змінено!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onDelete = (good_id) => {
		GoodsAPI.removeGood(good_id).then((r) => {
			message.success('Товар успішно видалено!');
			store.fetch();
			setModalVisible(false);
		});
	}

	return (
		<>
		<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<GoodsList data={store.data} onEdit={onEdit} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
			<GoodCreateEditModal onOk={modalParams.onOk} onCancel={modalParams.onCancel} onDelete={onDelete}
			                         id={modalParams.id} edit={modalParams.edit} visible={modalVisible} />
		</>
	);
}

export default observer(GoodsPage);
