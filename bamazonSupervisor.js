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
        message:"What would you like to do?",
        type:"list",
        choices:["View Product Sales by Department","Create New Department","Quit"],
        name:"choice"
    }).then(res => {
        switch(res.choice) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                newDepartment();
                break;
            case "Quit":
            default:
                console.log("Have a nice day");
                connection.end();
        }
    })
}

function viewSales() {
    connection.query(`select departments.department_id,departments.department_name,departments.over_head_costs,
        SUM(products.product_sales) as sales, (departments.over_head_costs - SUM(products.product_sales)) as total_profit
        FROM departments left join products on (departments.department_name = products.department_name)
        GROUP BY department_name`
    ,function(error,data) {
        if (error) throw error;
        console.log("\n"+formatDepartment(header),"\n".padEnd(70,"-"));
        for (let i=0; i < data.length; i++) {
            console.log(formatDepartment(data[i]));
        }
        console.log("\n");
        menu();
    })
}
const header = {
    department_id : "ID",
    department_name : "Department Name",
    over_head_costs : "Overhead",
    sales : "Total Sales",
    total_profit : "Total Profit"
}
function formatDepartment(row) {
    return ` ${row.department_id}`.padEnd(4)+`|  ${row.department_name}`.padEnd(20) +
    `|  ${row.over_head_costs}`.padEnd(13)+`|  ${row.sales}`.padEnd(16)+`|  ${row.total_profit}`;
}

function newDepartment() {
    inquirer.prompt([{
        message:"What is the Department name?",
        name: "name"
    }, {
        message: "What is the overhead cost?",
        name: "overhead",
        validate: function(input) {
            //must be a number and not negative
            return parseFloat(input) == input && parseFloat(input) > 0;
        }
    }]).then(res => {
        connection.query(`INSERT into departments (department_name,over_head_costs) values ('${res.name}',${res.overhead})`,function(error) {
            if (error) throw error;
            console.log("New Department has been added");
            menu();
        })
    })
}