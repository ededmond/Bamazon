const productHeaders = {
    "item_id" : "ID",
    product_name: "Item",
    department_name: "Department",
    price: "Price",
    stock_quantity: "Quantity"
};
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

function getProductHeader() {
    return formatItem(productHeaders)+"\n".padEnd(70,"-");
}

module.exports.getProductHeader = getProductHeader;
module.exports.formatItem = formatItem;