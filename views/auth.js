const db = require("../db/DB");

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const ACCESS_TOKEN_SECRET  = "cvkhjbklit654o9p9poh1qkwlsxam"
const REFRESH_TOKEN_SECRET = "chjwkcgvwhkery2i38o2hdaksv18y"

module.exports.initAuthViews = function(app) {

	app.post('/api/login', function (req, res) {

		const id = req.body.empl_id;
		const password = req.body.empl_pass;

		db.employeesDB.getById(id)
			.then((r) => {
				if (r.length) {
					//logic
					let string = JSON.stringify(r);
					let json = JSON.parse(string);
					const pass_hash = json[0].password;
					bcrypt.compare(password, pass_hash)
						.then(function(result) {
						if(result){
							const user = {id: id, password: password};
							const accessToken = generateAccessToken(user);
							const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
							res.json({accessToken: accessToken, refreshToken: refreshToken});
						}else {
							res.status(403).send({message: "Forbidden"});
						}
					});
				} else {
					res.status(404).send({message: "Not Found"});
				}});
	});


	app.get('/api/me', function (req, res) {
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
			db.employeesDB.getIDPIBRole(user.id)
				.then((r) => {
					console.log(r);
					res.send(JSON.stringify(r));
				});
		})
	});
	function generateAccessToken(user) {
		return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
	}
}

