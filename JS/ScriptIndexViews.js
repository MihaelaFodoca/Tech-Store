window.onload = () => {
    getProducts() //requests the product model from the server
    .then(displayProdctsDOM());
    showNoOfItems();
}
//uses the product model object to fill in the products container
async function displayProdctsDOM() {
    await fetch(Product.BASE_URL);
    productsModel.forEach(el => {
        document.getElementById("products_container").innerHTML += "<div class='product_wrapper '  >" +
            "<center>" + "<img src=" + el.productData.image + ">" + "</center>" + "<br>" +
            "<div class= 'box2'>" + "<h4 class='title'>" + el.productData.Name + "</h4>" + "</div>" +
            "<div class= 'box1'>" + "<div class= 'price'>" + "<p>" + el.productData.price + "&#8364" + "</p>" + "</div>" +
            "<button class='details_box'" + "<a class='details' ' onclick=detailsDisplay('" + el.productId + "')>" + "<i class='details_fa fa fa-shopping-cart fa-lg'>" + "</i>Details</a>" + "</button>"
        "</div>" + "</div>" + "<br>";
    })
}
//redirects to the admin page
document.getElementById("admin").addEventListener("click", () => {
    location.href = "admin.html"
});
//redirects to the cart page
document.getElementById("shopping_cart").addEventListener("click", async () => {
    location.href = "cart.html"
})

//called at the details button click
//redirects to the details page adding the product id in the URL
async function detailsDisplay(id) {
    location.href = "details.html" + "?id=" + id;
}

//retrieves info from the local storage to use it in the showNoOfItems() function attached to the cart
var storedProducts = localStorage.getItem("object");
cartObjects = JSON.parse(storedProducts);
console.log(cartObjects);

//total items in the cart
function totalProducts() {
    var total_qty = 0
    for (Ids in cartObjects) { //object created upon add to cart click from details page
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
    } else {
        document.getElementById("shopping_cart_pcs").style.display = "none";
    }
}