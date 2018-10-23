//npm modules: connect to mysql, terminal table with colored font for header
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
var Table = require('cli-table3');


var connection = mysql.createConnection({
	host: "localhost",

	// Your port; if not 3306
	port: 8889,

	// Your username
	user: "root",

	// Your password
	password: "root",
	database: "bamazon_db"
});

//connect to mysql function. If there is a connection error, terminal will show throw error

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);

});

// Access request data  from mysql, and receive table data

function selection() {
	connection.query('SELECT * FROM products', function (err, res) {
		if (err) throw err;

		// npm module table

		var table = new Table({
			head: ["Product ID".cyan, "Product Name".cyan, "Department Name".cyan, "Price".cyan, "Quantity".cyan],
			colWidths: [13, 20, 20, 13, 13],
		});

		//push table data to terminal table

		for (var i = 0; i < res.length; i++) {
			table.push(
				[res[i].itemID, res[i].ProductName, res[i].DepartmentName, parseFloat(res[i].Price).toFixed(2), res[i].StockQuantity]
			);
		}

		console.log(table.toString());

		// terminal prompts

		inquirer.prompt([
			{
				type: "number",
				message: "Which item would you like to purchase? (the Product ID)".cyan,
				name: "itemNumber"
			},
			{
				type: "number",
				message: "How many would you like to buy?".cyan,
				name: "howMany"
			},
		]).then(function (user) {

			connection.query("SELECT * FROM products", function (err, res) {
				if (err) throw err;

				if (res[user.itemNumber - 1].StockQuantity > user.howMany) {
					var newQuantity = parseInt(res[user.itemNumber - 1].StockQuantity) - parseInt(user.howMany);
					var total = parseFloat(user.howMany) * parseFloat(res[user.itemNumber - 1].Price);
					total = total.toFixed(2);


					connection.query("UPDATE products SET ? WHERE ?", [{
						StockQuantity: newQuantity
					}, {
						itemID: user.itemNumber
					}], function (error, results) {
						if (error) throw error;

						console.log("Your order for " + user.howMany + " " + res[user.itemNumber - 1].ProductName +
							"(s) has been placed.");
						console.log("Your total is $" + total);
						orderMore();
					});

				} else {
					console.log("We're sorry, we only have ".cyan + res[user.itemNumber - 1].StockQuantity + " of that product.".cyan);
					orderMore();
				}
			});
		});
	});
}

function orderMore() {
	inquirer.prompt([
		{
			type: "confirm",
			message: "Would you like to order anything else?".cyan,
			name: "again"
		},
	]).then(function (user) {
		if (user.again) {
			selection();
		} else {
			exit();
		}
	});
}

function exit() {
	connection.end();
	console.log("Have a great day!".cyan);
}

selection();
