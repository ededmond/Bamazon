const mysql = require("mysql");
const inquirer = require("inquirer");
const products = require(__dirname + "/products.js");
require('dotenv').config(); //so we can access my password
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    //this is where my password is saved.
    password: process.env.DATABASE_PASSWORD,
    database: "bamazon"
});

//connect to the database
connection.connect(function(error) {
    if (error) throw error;
    //main code
    menu();
});

function menu() {
    inquirer.prompt({
        message: "What would you like to do?",
        type: "list",
        choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Quit"],
        name:"choice"
    }).then(res => {
        switch (res.choice) {
            case "View Products for Sale":
                search("SELECT * FROM products");
                break;
            case "View Low Inventory":
                search("SELECT * FROM products WHERE stock_quantity < 5");
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Quit":
            default:
                console.log("Have a nice day.");
                connection.end();
        }
    });
}
function addToInventory() {
    console.log("Select the product: \n\n");
    connection.query("SELECT * FROM PRODUCTS",function(error,data) {
        if (error) throw error;
        let items =[];
        for (let i =0; i < data.length; i++) {
            items.push(products.formatItem(data[i])); //pushes each item into a table
        }
        inquirer.prompt([{
            message: products.getProductHeader(), //the head of the table
            type: "list",
            name: "item",
            choices: items,
            pageSize:20
        }, {
            message: "How many would you like to add?",
            name:"quantity",
            validate:function (input) {
                return (input == parseInt(input,10));
            }
        }]).then(res => {
            let item = res.item.split("|"); //splits item into it's pieces
            let inStock = parseInt(item[4].trim());
            //if the number you want to buy is less than the number in stock...
            connection.query(`UPDATE products SET stock_quantity =${inStock+parseInt(res.quantity)} where item_id = ${parseInt(item[0].trim())}`,function(error) {
                if (error) throw error;
                console.log("Inventory added");
                menu();
            })
        });
    });
}
function addProduct() {
    connection.query(`SELECT department_name FROM departments`,function(error,data) {
        if (error) throw error;
        let deps = [];
        for (let i =0; i < data.length;i++) {
            deps.push(data[i].department_name);
        }
            inquirer.prompt([{
            message: "What is the product name?",
            name: "name"
        }, {
            message: "What department is the product in?",
            name:"department",
            type: "list",
            choices: deps
        }, {
            message: "How much will the product cost?",
            name: "price",
            validate: function(input) {
                try {
                    if (input.toString().split(".")[1].length > 2) {
                        return false;
                    }
                    return parseFloat(input) == input && parseFloat(input) > 0;
                } catch (error) {
                    return false;
                }
                
            }
        } , {
            message: "How many are you selling?",
            name: "stock",
            validate: function(input) {
                return parseInt(input) == input && parseInt(input) > 0;
            }
        }]).then(res => {
            connection.query(`insert into products (product_name, department_name,price,stock_quantity)
                            values ('${res.name}','${res.department}','${res.price}','${res.stock}')`
            ,function(error) {
                if (error) throw error;
                console.log("Product added.");
                menu();
            });
        });
    });
}

//searches for the query, and formats the data
function search(query) {
    connection.query(query,function(error,data) {
        if (error) throw error;
        console.log("\n" + products.getProductHeader());
        for (let i =0; i < data.length; i++) {
            console.log(products.formatItem(data[i]));
        }
        console.log("\n");
        menu();
    })
}