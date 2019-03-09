const mysql = require("mysql");
const inquirer = require("inquirer");
require('dotenv').config(); //so we can access my password
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //this is where my password is saved.
    password: process.env.DATABASE_PASSWORD,
    database: "bamazon"
});
//allows us to create headers for the table
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
            items.push(formatItem(data[i])); //pushes each item into a table
        }
        inquirer.prompt([{
            message: formatItem(headers)+"\n".padEnd(70,"-")+"\n ", //the head of the table
            type: "list",
            name: "item",
            choices: items,
            pageSize:20
        }, {
            message: "How many would you like to buy?",
            name:"quantity",
            validate:function (input) {
                return (input == parseInt(input,10));
            }
        }]).then(res => {
            let item = res.item.split("|"); //splits item into it's pieces
            let inStock = parseInt(item[4].trim());
            //if the number you want to buy is less than the number in stock...
            if (res.quantity < inStock) { 
                connection.query(`UPDATE products SET stock_quantity =${inStock-res.quantity} where item_id = ${parseInt(item[0].trim())}`,function(error) {
                    if (error) throw error;
                    console.log(`Your total comes to $${(res.quantity * parseFloat(item[3].trim())).toFixed(2)}`);
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

//returns string that fits into a table
function formatItem(item) {
    let price = item.price; 
    //This formats the price so that it will always show the cents, but won't run for the table labels
    if (parseFloat(price) === price) {
        price = price.toFixed(2);
    }
    if (item.price)
    return ` ${item.item_id}`.padEnd(4)+"|  "+item.product_name.padEnd(24)+`|  ${item.department_name}`.padEnd(15) +
    `|  ${price}`.padEnd(11)+`|  ${item.stock_quantity}`;
}


