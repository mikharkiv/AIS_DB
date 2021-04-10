const db = require("../db/DB");
const employeesUrl = "/employees";

module.exports.initEmployeesViews = function (app) {
	app.get(employeesUrl + '/item-sold-count/:itemId', function (req, res) {
		db.employeesDB.getSoldItemCount(req.params.itemId).then((r) => res.send(JSON.stringify(r)));
		;
	});
	app.get(employeesUrl + '/every-product-sold/', function (req, res) {
		db.employeesDB.getSoldEveryItem().then((r) => res.send(JSON.stringify(r)));
		;
	});
	app.get(employeesUrl + '/biggest-sell-sum/', function (req, res) {
		db.employeesDB.getSoldMost().then((r) => res.send(JSON.stringify(r)));
		;
	});
	// Postnikov
	app.get(employeesUrl + '/worked-petrenko/', function (req, res) {
		db.employeesDB.getEmployeesWorkedWithPetrenko().then((r) => res.send(JSON.stringify(r)));
		;
	});
	app.get(employeesUrl + '/worked-petrenko-only/', function (req, res) {
		db.employeesDB.getEmployeesWorkedWithPetrenkoOnly().then((r) => res.send(JSON.stringify(r)));
		;
	});
	app.get(employeesUrl + '/biggest-percent-by-city/', function (req, res) {
		db.employeesDB.getEmployeesWorkedWithBiggestPercentByCity().then((r) => res.send(JSON.stringify(r)));
		;
	});


	//CRUD
	app.get(employeesUrl + '/', function (req, res) {
		const perPage = 10;
		let count_items = 0;
		let page = parseInt(req.body.currPage);
		if (!page) {
			page = 1;
		}
		db.employeesDB.getAllCount()
			.then((r) => {
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				count_items = json[0].TotalCount;
			});
		if (!req.body.searchQuery) {
			db.employeesDB.getEmployeesLimit(perPage, perPage * (page - 1))
				.then((r) => {
					const total_pages = Math.ceil(count_items / perPage);
					const results = r;
					res.json({
						"total_pages": total_pages,
						"count_items": count_items,
						"results": results
					});
				});
		} else {
			db.employeesDB.getEmployeesLimitSearch(perPage, perPage * (page - 1), req.body.searchQuery)
				.then((r) => {
					const total_pages = Math.ceil(count_items / perPage);
					const results = r;
					res.json({
						"total_pages": total_pages,
						"count_items": count_items,
						"results": results
					});
				});
		}
	});


	app.get(employeesUrl + '/:employeeId', function (req, res) {
		db.employeesDB.getById(req.params.employeeId)
			.then((r) => {
				if (r.length) {
					console.log(r);
					//serialise
					res.send(JSON.stringify(r));
				} else {
					res.status(400).send({message: "Bad Request"});
				}});
	});


	app.post(employeesUrl + '/', function (req, res) {
		//check if we try to dublicate PK id_employee
		db.employeesDB.alreadyExists(req.body.id_employee)
			.then((r) => {
				if (r) {
					res.status(400).send({message: "Bad Request"});
				} else {

					db.employeesDB.addEmployee(req.body.id_employee, req.body.empl_surname, req.body.empl_name, req.body.empl_patronymic, req.body.role, req.body.salary, req.body.date_of_birth, req.body.date_of_start, req.body.phone_number, req.body.city, req.body.street, req.body.zip_code)
						.then((r) => {
							if (!r.affectedRows) {
								res.status(400).send({message: "Bad Request"});
							} else {
								console.log(r);
								db.employeesDB.getById(req.body.id_employee)
									.then((rr) => {
										console.log(rr);
										//serialise
										res.send(JSON.stringify(rr));
									});
							}});
				}});
	});


	app.put(employeesUrl + '/:employeeId', function (req, res) {
		let json = JSON.parse(JSON.stringify(req.body));

		let attribute_arr = ["id_employee", "empl_surname", "empl_name", "empl_patronymic", "role", "salary", "date_of_birth", "date_of_start", "phone_number", "city", "street", "zip_code"];

		let query_part = [];
		for (let key of attribute_arr){
			if(json[key]!==undefined) {
				query_part.push(key + "=\"" + json[key] + "\"");
			}
		}
		let query = query_part.join(", ");
		console.log(query);

		db.employeesDB.updateEmployee(query, req.params.employeeId)
			.then((r) => {
				if (!r.affectedRows) {
					res.status(400).send({message: "Bad Request"});
				} else {
					console.log(r);
					db.employeesDB.getById(req.params.employeeId)
						.then((rr)=> {
							console.log(rr);
							//serialise
							res.send(JSON.stringify(rr));
						});
				}
			});

	});


	app.delete(employeesUrl + '/:employeeId', function (req, res) {
		db.employeesDB.deleteById(req.params.employeeId)
			.then((r) => {
				if (!r.affectedRows) {
					res.status(400).send({message: "Bad Request"});
				} else {
					res.status(200).send({message: "OK"});
				}
			})
			.catch(error => {
				res.status(400).send({message: "Bad Request"});
			});
	});


}
