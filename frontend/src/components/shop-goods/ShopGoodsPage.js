import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Col, message, Pagination, Row} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect, useState} from "react";
import {useHistory} from "react-router";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import ShopGoodsList from "./ShopGoodsList";
import {ShopGoodsAPI} from "../../api/ShopGoodsAPI";
import GoodCreateEditModal from "../goods/GoodCreateEditModal";
import ShopGoodCreateEditModal from "./ShopGoodCreateEditModal";
import {GoodsAPI} from "../../api/GoodsAPI";
import {EmployeesAPI} from "../../api/EmployeesAPI";

class ShopGoodsPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield ShopGoodsAPI.getShopGoods(this.getQuery()).then((r) => {
			this.totalPages = r.total_pages;
			console.log(r.results);
			this.data = this._prepareData(r.results);
		});
		this.state = "done";
	}

	_prepareData(data) {
		console.log(data);
		return data.map((e) => {
			if (!e) return e;
			e.id_product_id = e.id_product.id_product;
			e.promotional_product_str = (e.promotional_product ? 'так' : 'ні');
			return e;
		});
	}
}

const ShopGoodsPage = () => {
	const store = useMemo(() => new ShopGoodsPageStore(), []);
	const header = useStores().headerStore;
	const loginStore = useStores().loginStore;

	const [modalVisible, setModalVisible] = useState(false);
	const [modalParams, setModalParams] = useState({});

	useEffect(() => {
		header.setupHeading(false, 'Товари у магазині');
		store.fetch()
	}, []);

	let onAdd = () => {
		setModalParams({
			edit: false,
			onOk: (data) => {
				console.log(data);
				ShopGoodsAPI.addShopGood(data).then((r) => {
					message.success('Товар у магазині успішно додано!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onEdit = (good_id) => {
		if (loginStore.me.role !== EmployeesAPI.ROLES.MANAGER) return;
		setModalParams({
			id: good_id,
			edit: true,
			onOk: (data) => {
				ShopGoodsAPI.updateShopGood(good_id, data).then((r) => {
					message.success('Товар у магазині успішно змінено!');
					store.fetch();
					setModalVisible(false);
				});
			},
			onCancel: () => setModalVisible(false)
		});
		setModalVisible(true);
	};

	let onDelete = (good_id) => {
		ShopGoodsAPI.removeShopGood(good_id).then((r) => {
			message.success('Товар у магазині успішно видалено!');
			store.fetch();
			setModalVisible(false);
		});
	}

	return (
		<>
		<SearchAddBar hasButton={loginStore.me.role === EmployeesAPI.ROLES.MANAGER} isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<ShopGoodsList data={store.data} onEdit={onEdit} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
			<ShopGoodCreateEditModal onOk={modalParams.onOk} onCancel={modalParams.onCancel} onDelete={onDelete}
			                     id={modalParams.id} edit={modalParams.edit} visible={modalVisible} />
		</>
	);
}

export default observer(ShopGoodsPage);
