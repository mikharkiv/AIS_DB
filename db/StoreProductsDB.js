const createTable = "CREATE TABLE IF NOT EXISTS Store_Product ( `UPC` varchar(12) COLLATE `ascii_bin` NOT NULL, `UPC_prom` varchar(12) CHARACTER SET `ascii` COLLATE `ascii_bin` DEFAULT NULL UNIQUE, `id_product` int NOT NULL, `selling_price` decimal(13, 4) NOT NULL, `products_number` int NOT NULL, `promotional_product` tinyint(1) NOT NULL, PRIMARY KEY (`UPC`), CONSTRAINT `id_product` FOREIGN KEY (`id_product`) REFERENCES `Product` (`id_product`) ON UPDATE CASCADE, CONSTRAINT `UPC_prom` FOREIGN KEY (`UPC_prom`) REFERENCES `Store_Product`(`UPC`) ON DELETE SET NULL ON UPDATE CASCADE )ENGINE=INNODB;";

module.exports.StoreProductsDB = class {
	query;

	constructor(query) {
		this.query = query;
	}

	async init() {
		this.query(createTable);
		console.log('Store Products DB inited!');
	}
}
