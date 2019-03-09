drop database if exists bamazon;
create database bamazon;
use bamazon;

create table products (
	item_id int auto_increment,
    product_name varchar(45),
	department_name varchar(45),
    price decimal(10,2),
    stock_quantity int,
	primary key (item_id)
);

insert into products (product_name, department_name,price,stock_quantity)
values ("Bicycle","Sports",150.00,10),
("Dishwasher","Cooking",500.00,15),
("Vacuum Cleaner","Cleaning",149.99,25),
("Grand Theft Auto IV","Gaming",29.95,100),
("Tennis Racket","Sports",29.99,40),
("Paper Towels","Cleaning",4.50,75),
("Animal Crossing","Gaming",15.00,35),
("Ice Cream Maker","Cooking",55.95,4),
("Basketball","Sports",19.99,30),
("Tennis Balls","Sports",5.99,400);
