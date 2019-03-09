var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //this is where my password is saved.
    password: process.env.DATABASE_PASSWORD,
    database: "bamazon"
});

connection.connect(function(error) {
    if (error) throw error;
    askToBuy();
});

function askToBuy() {
    console.log("Select the Product you would like to Buy: \n\n");
    connection.query("SELECT * FROM PRODUCTS",function(error,data) {
        if (error) throw error;
        console.log(data);
    });
}


