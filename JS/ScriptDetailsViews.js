window.onload = () => {
    setDetailsId();
    keepLocalStorageInfo();
    showNoOfItems();
}

//home button-redirects to index page
document.getElementById("home").addEventListener("click",async () => {
    location.href="index.html"
})
//redirects to admin page
document.getElementById("admin").addEventListener("click", () => {
    location.href = "admin.html"
});
//redirects to cart page
document.getElementById("shopping_cart").addEventListener("click", () => {
    location.href = "cart.html"
});

var url = document.URL;
var url_array = url.split("=");
var Id = url_array[url_array.length - 1];
console.log(Id);

//uses the URL to set the id of the product to be displayed
async function setDetailsId() {
    var url = document.URL;
    var url_array = url.split("=");
    var idDetails = url_array[url_array.length - 1];
    getProductDetails(idDetails).then(  //uses the id to request the information from the server
    displayProductDetails(ProductDetails)); //fills in the product details container using the object received from the server
}

var ProductDetail;
var cartProducts = [];
//fills in the product details container using the object received from the server
async function displayProductDetails(ProductDetails) {
    await fetch("https://magazin-electronic-miha-fodoca.firebaseio.com/products/" + Id + ".json");
    // var descriptionArray;
    // descriptionArray = ProductDetails.Description;
    // var descriptionLi = descriptionArray.split(",");
    // for (var i = 0; i < descriptionLi.length; i++) {
    //     var description;
    //     description += descriptionLi[i];
    // }
    // var descriere = url_array[url_array.length - 1];
    document.getElementById("details_container").innerHTML = "<div class='details_wrapper '>" +
        "<img src=" + ProductDetails.image + ">" + "<br>" + "<div class='details_box'>" +
        "<h3 class='detail_title'>" + ProductDetails.Name + "</h3>" +
        "<h5 class='detail_description'>" + ProductDetails.Description + "</h5>" +
        "<div class= 'detail_price'>" + "<p>" + ProductDetails.price + "&#8364" + "</p>" +
        "<div class= 'detail_stock'" + "<p>" + "Left in stock: " + ProductDetails.stock + " pcs" + "</p>" +
        "<div class= 'detail_quantity'" + "<p>" + "Quantity: " + "<input type='number' id='qty' name='quantity' min='1' max='100'>" + "</p>" +
        "<button class='add_basket' name='add' onclick='displayAddCartMessage(" + ProductDetails.stock + " )' value='ADD TO CART'>" + "<i class='fa_details fa fa-shopping-cart fa-lg'>" + "</i>" + "ADD TO CART" + "</button>"
    "</div>" + "</div>" + "</div>";
}
//called at the Add to cart button click
function displayAddCartMessage() {
    var totalStock = parseInt(ProductDetails[0].stock); //the totalstock of the product
    var orderValue = parseInt(document.getElementById("qty").value); //the qty entered in the order qty field
    if (orderValue >= 1 && orderValue <= totalStock) { 
        //if ordered qty is greater than 1 and less or equal to the total stock
        //the call the function that generates the object and makes further validations
        document.getElementById("add_cart_message").style.visibility = "visible";
        document.getElementById("add_cart_message").style.backgroundColor = "rgb(201, 201, 201)";
        setTimeout(function () { document.getElementById("add_cart_message").style.visibility = "hidden"; }, 3000)
        document.getElementById("add_cart_message").innerHTML = orderValue + " pcs " + ProductDetails["0"].Name + " was added to the cart!"
        generateCartObject();
        document.getElementById("qty").value = "";
        showNoOfItems();

    } else if (orderValue <= 0 || isNaN(orderValue)) { //if the ordered qty is less than 0 or invalid, display a message
        document.getElementById("add_cart_message").style.visibility = "visible";
        document.getElementById("add_cart_message").style.backgroundColor = "red";
        document.getElementById("add_cart_message").innerHTML = "Please choose a valid quantity!"
    } else { //if the ordered qty is greather than the stock-display a message
        document.getElementById("add_cart_message").style.visibility = "visible";
        document.getElementById("add_cart_message").style.backgroundColor = "red";
        document.getElementById("add_cart_message").innerHTML = "There is not enough stock!"
    }
}

var arrayID = [];
var cartObjects = [];
function generateCartObject() { //se cheama la apasearea pe  butonul add to cart
    var quantity = parseInt(document.getElementById("qty").value);//the qty entered in the order qty field
    var name = ProductDetails[0].Name;
    var cartProd = new NewCartProduct(Id, quantity, name,);//cart object constructor
    var arrayObjectIds = [];//an array in which I store the Ids of the cart objects for cheching if an ordered item has already been added in the cart
    for (Ids in cartObjects) {
        arrayObjectIds.push(cartObjects[Ids].Id) //creez un array care contine toate id-urile din cartobjects
    }
    if (cartObjects.length == 0) { //if the cart is empty, I add the new object to the cart 
        cartObjects.push(cartProd);
    }
    else if (arrayObjectIds.includes(Id)) {   //verifica daca id-ul paginii este inclus in array-ul de obiecte din cos
        for (var i = 0; i < cartObjects.length; i++) {
            if (cartObjects[i].Id === Id) {//identifies the already existing cart object
                var cartQuantity;
                cartQuantity = parseInt(cartObjects[i].quantity);//verify which is the quantity already added in the cart
                var totalStock = parseInt(ProductDetails[0].stock);//verify which is the total stock for the product
                var sumTotal = cartQuantity + quantity; //summarize the qty already in cart and the new ordered qty
                if (sumTotal <= totalStock) {//if the total is less than the total stock, the quantity of the object is incremented with the new ordered qty
                    cartObjects[i].quantity += quantity; //daca exista deja in array,i se incrementeaza cantitatea
                } else { //if the total is greater than the total stoc, display a message
                    document.getElementById("add_cart_message").style.visibility = "visible";
                    document.getElementById("add_cart_message").style.backgroundColor = "red";
                    document.getElementById("add_cart_message").innerHTML = "There is not enough stock!"
                }
            }
        }
    }
    else {
        cartObjects.push(cartProd); //daca nu exista in array-ul de Id-uri creez un obiect nou
    }
    pushObjectToLocalStorage();
    return (cartObjects);
}
//sends the newly created object or the updated info about an existing object to local storage
async function pushObjectToLocalStorage() {
    var val = JSON.stringify(cartObjects);
    localStorage.setItem("object", val);
}

//total items in the cart
function totalProducts() {
    var total_qty = 0
    for (Ids in cartObjects) {
        total_qty += cartObjects[Ids].quantity;
    }
    return total_qty;
}
//shows the no of items in the cart
function showNoOfItems() {
    var nr;
    nr = totalProducts();
    if (nr > 0) {
        document.getElementById("shopping_cart_pcs").value = nr;
        console.log(document.getElementById("shopping_cart_pcs").value);
        document.getElementById("shopping_cart_pcs").style.display = "inline-block";
        document.getElementById("shopping_cart_pcs").style.position = "absolute";

    } else {
        document.getElementById("shopping_cart_pcs").style.display = "none";
    }
}