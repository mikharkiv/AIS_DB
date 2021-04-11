import {observer} from "mobx-react";
import SearchAddBar from "../SearchAddBar";
import {Col, Pagination, Row} from "antd";
import {BasicListStore} from "../../stores/BasicListStore";
import {useMemo, useEffect} from "react";
import {useHistory} from "react-router";
import {makeObservable} from "mobx";
import {useStores} from "../../hooks/use-stores";
import ShopGoodsList from "./ShopGoodsList";
import {ShopGoodsAPI} from "../../api/ShopGoodsAPI";

class ShopGoodsPageStore extends BasicListStore {

	constructor() {
		super();
		makeObservable(this);
	}

	*fetch() {
		this.state = "loading";
		yield ShopGoodsAPI.getShopGoods(this.getQuery()).then((r) => this.data = this._prepareData(r));
		this.state = "done";
	}

	_prepareData(data) {
		return data.map((e) => {
			e.upc_prom_id = e.upc_prom.upc;
			e.id_product_id = e.id_product.id_product;
			e.promotional_product_str = (e.promotional_product ? 'так' : 'ні');
			return e;
		});
	}
}

const ShopGoodsPage = () => {
	const store = useMemo(() => new ShopGoodsPageStore(), []);
	const history = useHistory();
	const header = useStores().headerStore;

	useEffect(() => {
		header.setupHeading(false, 'Товари у магазині');
		store.fetch()
	}, []);

	let onAdd = () => {history.push('/');}; // TODO

	return (
		<>
		<SearchAddBar isLoading={store.state === "loading"} onSearch={store.doSearch} onAdd={onAdd}/>
			<Row key="row2" justify="center" gutter={20}>
				<Col span={20}>
					<ShopGoodsList data={store.data} />
				</Col>
			</Row>
			<Row key="row3" justify="center" style={{marginTop: "40px"}}>
				<Pagination current={store.page} defaultPageSize={1} total={store.totalPages} onChange={store.goToPage}/>
			</Row>
		</>
	);
}

export default observer(ShopGoodsPage);
