const db = require("../db/DB");
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET  = "cvkhjbklit654o9p9poh1qkwlsxam"

//if role is not important
function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	console.log(token); //
	if (token == null){
		return res.status(401).send({message: "Unauthorized"});
	}

	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			console.log(err);
			return res.status(401).send({message: "Unauthorized"});
		}
		req.user = user;
		console.log(user);
		console.log(user.id);
		next();
	})
}

function authManager(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	console.log(token); //
	if (token == null){
		return res.status(401).send({message: "Unauthorized"});
	}

	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			console.log(err);
			return res.status(401).send({message: "Unauthorized"});
		}
		req.user = user;
		console.log(user);
		db.employeesDB.getRole(user.id)
			.then((r) => {
				console.log(r);
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				let role = json[0].role;
				if (role == "manager") {
					next();
				}else{
					return res.status(401).send({message: "Unauthorized"});
				}
			});
	})
}


function authCashier(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	console.log(token); //
	if (token == null) {
		return res.status(401).send({message: "Unauthorized"});
	}

	jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			console.log(err);
			return res.status(401).send({message: "Unauthorized"});
		}
		req.user = user;
		console.log(user);
		db.employeesDB.getRole(user.id)
			.then((r) => {
				console.log(r);
				let string = JSON.stringify(r);
				let json = JSON.parse(string);
				let role = json[0].role;
				if (role == "cashier") {
					next();
				}else{
					return res.status(401).send({message: "Unauthorized"});
				}
			});
	})
}

module.exports.authenticateToken = authenticateToken;
module.exports.authCashier = authCashier;
module.exports.authManager = authManager;
