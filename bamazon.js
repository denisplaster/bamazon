//stores the info for passwords
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({

    host: "localhost",
    // Your port; if not 3306
	port: 8889,
	//username
	user:"root",
	//ENTER YOUR PASSWORD HERE 
	password: "root",
	database: "bamazon_db"

	});

	connection.connect(function(err) {
		if (err) throw err;
		console.log("connected as id " + connection.threadId);
	});


