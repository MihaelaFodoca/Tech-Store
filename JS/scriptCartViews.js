window.onload = () => {
    getProducts()
        .then(displayCart())
        .then(createProductsModelIdArray())
        .then(excludeDeletedObject())
        .then(fillCartTotals())
    }
var storedProducts = localStorage.getItem("object");
var storedCartProducts = JSON.parse(storedProducts);
var cartObjects = JSON.parse(storedProducts); //retrieve the cart object stored in the local storage
console.log(cartObjects);

document.getElementById("home").addEventListener("click", async () => {
    location.href = "index.html"
})

function clearCartItems() {
    document.getElementById("cart_table").innerHTML = "";
}

//displays the shopping cart
async function displayCart() {
    await fetch(Product.BASE_URL);
    var table = document.getElementById("cart_table");
    var header = table.createTHead();
    var headerRow = header.insertRow(0);
    var cellHeader1 = headerRow.insertCell(0);
    var cellHeader2 = headerRow.insertCell(1);
    var cellHeader3 = headerRow.insertCell(2);
    var cellHeader4 = headerRow.insertCell(3);
    var cellHeader5 = headerRow.insertCell(4);
    var cellHeader6 = headerRow.insertCell(5);
    cellHeader1.innerHTML = "<p>"+"Image"+"</p>";
    cellHeader2.innerHTML = "<p>"+"Name"+"</p>";
    cellHeader3.innerHTML = "<p>"+"Price"+"</p>";
    cellHeader4.innerHTML = "<p>"+"Qty"+"</p>";
    cellHeader5.innerHTML = "<p>"+"SubTotal"+"</p>";
    cellHeader6.innerHTML = "";
    if(cartObjects!==null){
    cartObjects.forEach(el => {
        var productInfo = getProductById(el.Id);//gets the info received from the server for this product
        if (productInfo === null) { //if one product already added in the cart is being deleted from Admin-a message is displayes in the cart 
            pushObjectToLocalStorage();
            document.getElementById("unavailable_cart_message").style.visibility = "visible";
            document.getElementById("unavailable_cart_message").style.backgroundColor = "rgb(201, 201, 201)";
            setTimeout(function () { document.getElementById("unavailable_cart_message").style.visibility = "hidden"; }, 4000)
            document.getElementById("unavailable_cart_message").innerHTML = "One product became unavailable!"
        }else {
            document.getElementById("unavailable_cart_message").style.visibility = "hidden";
            //if the admin modifies the qty of one product added in the cart
            //and the qty in the cart is greater than the qty in stock,
            //then the qty in the cart is being updated according to the updated qty
            var updatedQty = updateProductQuantity(productInfo.productData.stock, el.quantity);
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            cell1.innerHTML = "<center>"+"<img class='cart_img' src=" + productInfo.productData.image + ">"+"</center>";
            cell2.innerHTML = "<div id='details_box'" + "<a class='details' href='#' onclick=detailsDisplay('" + productInfo.productId + "')>" + productInfo.productData.Name + "</a>" + "</div>";
            cell3.innerHTML = "<div class='price'>" + productInfo.productData.price + "</div>";
            cell4.innerHTML = "<a class='minus' href='#' onclick=decreaseQty('" + productInfo.productId + "')>" + "-   " + "</a>" + updatedQty + "<a class='plus' href='#' onclick=increaseQty('" + productInfo.productId + "')>" + "    +   " + "</a>";
            var sum = updatedQty * productInfo.productData.price
            cell5.innerHTML = sum.toFixed(2) + " &#8364";
            cell6.innerHTML = "<div id='delete_box'" + "<a class='delete' href='#' onclick=deleteCartItem('" + productInfo.productId + "')>Remove</a>" + "</div>";
        }
    })}else{ //if cartobjects is empty,then display a message
    document.getElementById("cart_table").innerHTML= "<p id='empty_msg'>"+"This cart is empty"+"</p>";
    }
    fillCartTotals();//fills the total value of the order
    deleteNoStockObject();
}


async function detailsDisplay(id) {
    location.href = "details.html" + "?id=" + id;
}

//if the admin modifies the qty of one product added in the cart
//and the qty in the cart is greater than the qty in stock,
//then the qty in the cart is being updated according to the updated qty
function updateProductQuantity(stockQuantity, cartQuantity) {
    for(Id in cartObjects){
    if (stockQuantity < cartQuantity) {
        cartQuantity = stockQuantity;
        cartObjects[Id].quantity = parseInt(cartQuantity);
        return cartQuantity
    } else {
        return cartQuantity
    }}}

//fills the total value of the order
function fillCartTotals() { 
    var x=totalValue();
    console.log(x);
    if (totalValue() > 0) {
        document.getElementById("products_qty").innerHTML = "Products: " + totalProducts() + " pcs";
        document.getElementById("VAT").innerHTML = "VAT: " + calculateVAT() + "  &#8364";
        document.getElementById("transport_cost").innerHTML = "Transport cost: " + calculateTransport() + "  &#8364";
        var totalGeneral=Number(totalValue() + calculateTransport());
        var total=totalGeneral.toFixed(2);
        document.getElementById("Total").innerHTML = "Total: " + total+ " &#8364";
        document.getElementById("CheckOut").innerHTML =  "<button class='check_out'  onclick='deleteBoughtProducts()' value='CHECK OUT'>" + "Check Out" + "</button>"
    } 
    else {//if the value is <=0, then a message is displayed
        document.getElementById("cart_details").innerHTML = "";
        document.getElementById("cart_table").innerHTML= "<p id='empty_msg'>"+"This cart is empty"+"</p>"
     }
    showNoOfItems();//shows the total number of items in the cart
}

function showNoOfItems(){
    var nr;
    nr=totalProducts();
    if(nr>0){
    document.getElementById("shopping_cart_pcs").value=nr;
    console.log(document.getElementById("shopping_cart_pcs").value);
}else{
    document.getElementById("shopping_cart_pcs").style.display="none";
}}

function totalProducts() {
    var total_qty = 0;
    for (Ids in cartObjects) {
        total_qty += cartObjects[Ids].quantity;//summs up all the items in the cart
    }
    return total_qty;
}

function totalValue() {
    var total_value = 0;
    if (cartObjects!==null) {
        for (Ids in cartObjects) {
            var Id=cartObjects[Ids].Id;
                var productInfo = getProductById(Id);
                console.log(Id);
            total_value += cartObjects[Ids].quantity * productInfo.productData.price;//calculated the total value of the items purchased
            var total_Value = Number(total_value.toFixed(2));
        }
        return total_Value;
    } else {
        total_Value = 0;
    }
}
//if the total value is over 500, then 10 euro transport cost
function calculateTransport() {
    var total = totalValue();
    if (total > 0) {
        var totalSum = parseInt(totalValue());
        var target_value = 500;
        var transportCost;
        if (totalSum > target_value) {
            transportCost = 10;
        } else {
            transportCost = 0;
        }
        return transportCost;
    } else {
        console.log("cart is empty")
    }
}

function calculateVAT() {
    var totalSum = (parseInt(totalValue()) + calculateTransport());
    var VAT = totalSum * 0.19;
    var VAT_fixed = VAT.toFixed(2);
    return VAT_fixed;
}
//called when the delete button is clicked
function deleteCartItem(id) {
    for (var i = storedCartProducts.length; i--;) {
        if (storedCartProducts[i]["Id"] == id) {//dupa ce gaseste produsul dupa ID
            storedCartProducts.splice(i, 1);//sterge 1 produs incepand de la pozitia la care a fost gasit id-ul
        }
    }
    localStorage.setItem("object", JSON.stringify(storedCartProducts))//se trimite din nou array-ul de obiecte catre local storage
    clearCartItems();//goleste cart objects
    displayCart();//afiseaza din nou cart-ul pe baza info din local storage
    window.location.reload();
    fillCartTotals();//calculeaza totalurile
}

function getCartObjectsById(objectId) { //gets a certain cart object based on the provided id
    for (let i = 0; i < cartObjects.length; i++) {
        if (cartObjects[i].Id === objectId) {
            return cartObjects[i];
        }
    }
    return null;
}
function getProductInfoById(objectId) {//gets a certain product from products model based on the provided id
    for (let i = 0; i < productsModel.length; i++) {
        if (productsModel[i].productId === objectId) {
            return productsModel[i].productData.stock;
        }
    }
    return null;
}
//called when the minus sign is clicked
function decreaseQty(id) {
    var obj = getCartObjectsById(id);//gets a certain cart object based on the provided id
    obj.quantity = (obj.quantity - 1);//decreases the cart qty by 1 on each click 
    pushObjectToLocalStorage();//copy the new object to localstorage
    deleteNoStockObject();//if the qty for theproduct reaches 0, the product is completly deleted from the cart
    window.location.reload();
    fillCartTotals();//recalculates the total amounts
}
//called when the plus sign is clicked
function increaseQty(id, stock) {
    var obj = getCartObjectsById(id);//gets a certain cart object based on the provided id
    var stock = getProductInfoById(id);//gets a certain product from products model based on the provided id
    if (obj.quantity < stock) {//while the qty from the cart is less than the stock, increase the cart qty by 1
        obj.quantity = (obj.quantity + 1);
        pushObjectToLocalStorage();//copy the new object to localstorage
        window.location.reload();
        document.getElementById("unavailable_cart_message").style.visibility = "hidden";
    } else { //else display a warning that the max stock linit is reached
        document.getElementById("unavailable_cart_message").style.visibility = "visible";
        document.getElementById("unavailable_cart_message").style.backgroundColor = "rgb(201, 201, 201)";
        setTimeout(function () { document.getElementById("unavailable_cart_message").style.visibility = "hidden"; }, 4000)
        document.getElementById("unavailable_cart_message").innerHTML = "You've reached the maximum stock limit for " + obj.name + "!";
    }
    fillCartTotals();//recalculates the total amounts
}
//copy the modified object to localstorage
function pushObjectToLocalStorage() {
    var val = JSON.stringify(cartObjects);
    localStorage.setItem("object", val);
    console.log(cartObjects);
}

//creates an array with all the ids from the products model
var productsModelIdArray = [];
function createProductsModelIdArray() {
    console.log(productsModel);
    var productsModelIdArray = [];
    for (Ids in productsModel) {
        productsModelIdArray.push(productsModel[Ids].productId);
    }
    return (productsModelIdArray);
}
//if the admin deletes a product which is already added in the cart, then the product is erased from the cart
async function excludeDeletedObject() {
    await fetch(Product.BASE_URL);
    var model = [];
    model = createProductsModelIdArray();
    console.log(model);
    if(cartObjects!==null){
    for (let i = 0; i < cartObjects.length; i++) {
        if (!model.includes(cartObjects[i].Id)) {
            cartObjects.splice(i);
            console.log("nu include");
        }
    }
    pushObjectToLocalStorage();
    fillCartTotals();
}
}
//if the qty for thep roduct reaches 0 , the product is completly deleted from the cart
function deleteNoStockObject() {
    if(cartObjects!==null){
    for (let i = 0; i < cartObjects.length; i++) {
        if (cartObjects[i].quantity === 0) {
            cartObjects.splice(i, 1);
        }
    }
    pushObjectToLocalStorage();
}
}
//deletes the info from local storage after the purchase is finalized
function deleteBoughtProducts(){
    document.getElementById("cart_details").innerHTML = "";
    window.localStorage.clear();
    document.getElementById("cart_table").innerHTML= "<p id='empty_msg'>"+"Thank you for your purchase!"+"</p>"
    document.getElementById("shopping_cart_pcs").style.display="none";
}