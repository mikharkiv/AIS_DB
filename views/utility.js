const moment = require("moment");


function changeDateEmployee(response){
	let string = JSON.stringify(response);
	let json = JSON.parse(string);

	let date_of_birth = json[0].date_of_birth;
	let date_of_start = json[0].date_of_start;
	//DD.MM.YYYY
	let date_of_birth_format = moment(date_of_birth,'YYYY-MM-DD HH:mm:ss ZZ').format('DD.MM.YYYY');
	let date_of_start_format = moment(date_of_start,'YYYY-MM-DD HH:mm:ss ZZ').format('DD.MM.YYYY');
	//console.log(date_of_birth_format);
	//console.log(date_of_start_format);
	json[0].date_of_birth = date_of_birth_format;
	json[0].date_of_start = date_of_start_format;
	//console.log(JSON.stringify(json));
	return JSON.stringify(json);
}

function changeDateEmployeeArray(response_array){
	let string = JSON.stringify(response_array);
	//console.log(string);
	let json = JSON.parse(string);
	//console.log(json.length);

	let result_array = [];
	for (var i=0; i<json.length; i++) {
		console.log(json[i]);
		let date_of_birth = json[i].date_of_birth;
		let date_of_start = json[i].date_of_start;
		let date_of_birth_format = moment(date_of_birth,'YYYY-MM-DD HH:mm:ss ZZ').format('DD.MM.YYYY');
		let date_of_start_format = moment(date_of_start,'YYYY-MM-DD HH:mm:ss ZZ').format('DD.MM.YYYY');
		json[i].date_of_birth = date_of_birth_format;
		json[i].date_of_start = date_of_start_format;
		result_array.push(json[i]);
	}
	return result_array;
}


function changeDateCheck(response) {
	let string = JSON.stringify(response);
	let json = JSON.parse(string);
	let print_date = json[0].print_date;
	//DD.MM.YYYY
	let print_date_format = moment(print_date,'YYYY-MM-DD HH:mm:ss ZZ').format('DD.MM.YYYY');
	json[0].print_date = print_date_format;
	return JSON.stringify(json);
}

function changeDateCheckArray(response_array){
	let string = JSON.stringify(response_array);
	//console.log(string);
	let json = JSON.parse(string);
	//console.log(json.length);

	let result_array = [];
	for (var i=0; i<json.length; i++) {
		console.log(json[i]);
		let print_date = json[i].print_date;
		let print_date_format = moment(print_date,'YYYY-MM-DD HH:mm:ss ZZ').format('DD.MM.YYYY');
		json[i].print_date = print_date_format;
		result_array.push(json[i]);
	}
	return result_array;
}

module.exports.changeDateEmployee = changeDateEmployee;
module.exports.changeDateEmployeeArray = changeDateEmployeeArray;
module.exports.changeDateCheck = changeDateCheck;
module.exports.changeDateCheckArray = changeDateCheckArray;
