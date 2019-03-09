const mysql = require("mysql");
const inquirer = require("inquirer");
require('dotenv').config(); //so we can access my password
const products = require(__dirname + "/products.js"); //has functions to help formatting
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //this is where my password is saved.
    password: process.env.DATABASE_PASSWORD,
    database: "bamazon"
});
const headers = {
    "item_id" : "ID",
    product_name: "Item",
    department_name: "Department",
    price: "Price",
    stock_quantity: "Quantity"
};
//connect to the database
connection.connect(function(error) {
    if (error) throw error;
    //main code
    askToBuy();
});

function askToBuy() {
    console.log("Select the Product you would like to Buy: \n\n");
    connection.query("SELECT * FROM PRODUCTS",function(error,data) {
        if (error) throw error;
        let items =[];
        for (let i =0; i < data.length; i++) {
            items.push(products.formatItem(data[i])); //pushes each item into a table
        }
        inquirer.prompt([{
            message: products.getProductHeader()+"\n ", //the head of the table
            type: "list",
            name: "item",
            choices: items,
            pageSize:20
        }, {
            message: "How many would you like to buy?",
            name:"quantity",
            validate:function (input) {
                let intInput = parseInt(input,10);
                return (input == intInput && intInput > 0);
            }
        }]).then(res => {
            let item = res.item.split("|"); //splits item into it's pieces
            let inStock = parseInt(item[4].trim());
            //if the number you want to buy is less than the number in stock...
            let cost = res.quantity * parseFloat(item[3].trim())
            if (res.quantity < inStock) { 
                connection.query(`UPDATE products SET stock_quantity =${inStock-res.quantity}, product_sales = product_sales + ${cost} where item_id = ${parseInt(item[0].trim())}`,function(error) {
                    if (error) throw error;
                    console.log(`Your total comes to $${cost.toFixed(2)}`);
                    restart();
                })
            } else {
                console.log(`Sorry, only ${inStock} items are in stock`)
                restart();
            }
        });
        
    });
}

function restart() {
    inquirer.prompt({
        message: "Would you like to buy something else?",
        name: "answer",
        type: "confirm"
    }).then(res => {
        if (res.answer) {
            askToBuy();
        } else {
            console.log("Have a nice day!");
            connection.end();
        }
    })
}



