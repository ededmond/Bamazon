# Bamazon
Database CLI app
There are 3 apps that can be used:
    1. bamazonCustomer
    2. bamazonManager
    3. bamazonSupervisor
All utilize the same database.
bamazonCustomer functions as follows:
    The user will be asked which product they would like to buy, and are given the option to select said item from a table.
    The user is then asked how many they would like to buy, and must input a whole number greater than 0.
    If there are enough items in stock, the database is updated with the new stock and total product sales, and the user is shown their total cost. 
    If there are not enough items in inventeory, the user is informed of this, and the database is not updated.
    The user is then asked whether they would be intersted in buying something else. "Yes" restarts the app, while "No" exits.
bamazonManager functions as follows:
    The user is given 5 options:
        1. View Products for Sale
            Shows all the information in the database for every product.
        2. View Low Inventory
            Shows all the information in the database for all products with less than 5 in stock
        3. Add to Inventory
            Allows the user to select a product, and then asks how many of said item they would like to add to the inventory.
            The user must enter a positive whole number (0 is allowed in case of mistakes)
            The database is then updated to reflect the increase in inventory.
        4. Add New Product
            The user is asked for the product name, the department, the price, and the number in stock.
            Price must be a float value, and the stock must be a whole number. Both must be greater than 0.
            This product is added to the database, with the sales set to 0
        5. Quit
            Exits the program.
            All other options return to this menu upon completion.

bamazonSupervisor functions as follows:
    The user is given 3 options:
        1. View Product Sales By Department
            Displays the ID, department name, overhead, total sales, and total profit for each department.
        2. Create New Department
            Asks the user for a department name and overhead cost
            cost must be a float greater than 0
            The database is updated with this new product. 
        3. Quit
            Exits the Program.
            All other options return to this menu upon completion

Things I would like to add:
    bamazonManager would select a department rather than typing it in
        When adding a product the price would disallow decimal places greater than 2
    bamazonCustomer would be able to search by department
    bamazonManager would have to add how much they paid for increasing inventory and adding products, which would be added to the overhead costs.
    bamazonSupervisor would include a column for the number of products in that department, and total sales and profit would not read as null when a department was empty