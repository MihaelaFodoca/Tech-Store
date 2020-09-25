
window.onload = () => {
    getProducts().then(fillProductsTable())
}

//gets the productsModelobject and uses it to fill in the admin table
async function fillProductsTable() {
    await fetch(Product.BASE_URL);
    var table = document.getElementById("products_table");
    var header=table.createTHead();
    var headerRow=header.insertRow(0);
    var cellHeader1=headerRow.insertCell(0);
    var cellHeader2=headerRow.insertCell(1);
    var cellHeader3=headerRow.insertCell(2);
    var cellHeader4=headerRow.insertCell(3);
    var cellHeader5=headerRow.insertCell(4);
    cellHeader1.innerHTML="<p>"+"Image"+"</p>";
    cellHeader2.innerHTML="<p>"+"Name"+"</p>";
    cellHeader3.innerHTML="<p>"+"Price"+"</p>";
    cellHeader4.innerHTML="<p>"+"Qty"+"</p>";
    cellHeader5.innerHTML="";
    productsModel.forEach(el => {
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        cell1.innerHTML = "<center>"+"<img class='admin_img' src=" + el.productData.image + ">"+"</center>";
        cell2.innerHTML = "<div id='update_box'" + "<a class='update' href='#' onclick=updateProduct('" + el.productId + "')>" + el.productData.Name + "</a>" + "</div>";
        cell3.innerHTML = "<div class='price'>" + el.productData.price + "</div>";
        cell4.innerHTML = el.productData.stock;
        cell5.innerHTML = "<div id='delete_box'" + "<a class='delete' href='#' onclick=deleteThisProduct('" + el.productId + "')>Delete</a>" + "</div>";
    });
}

async function refreshTable() {
    await fetch(Product.BASE_URL);
    document.getElementById("products_table").innerHTML = "";
    console.log(document.getElementById("products_table").innerHTML);
    console.log(productsModel);
    productsModel = [];
}

//called at the delete button click
//sends the DElete request to the server, empties the products model
//then makes a request to get the products Model object and 
//fills in the table again
async function deleteThisProduct(ProductId) {
    await fetch(Product.BASE_URL);
    DeleteProduct(ProductId)
        .then(refreshTable())
        .then(getProducts())
        .then(fillProductsTable());
    console.log(productsModel);

}
//called upon  click on the product name
//fills in the update form with the details obtained from the server through method GET
async function updateProduct(ProductId) {
    await fetch(Product.BASE_URL);
    console.log(ProductId);
    getProductDetailsUpdate(ProductId).then(
    document.getElementById("products_wrapper").style.display = "none")
    document.getElementById("update_product").style.display = "block";
}
//called at getProductDetailsUpdate(ProductId)
//-fills in the update form with the info received from the server
function fillUpdateForm(response) {
    document.getElementById("image-field").value = response.image;
    document.getElementById("name-field").value = response.Name;
    document.getElementById("description-field").value = response.Description;
    document.getElementById("price-field").value = response.price;
    document.getElementById("quantity-field").value = response.stock;
    document.getElementById("name").innerHTML = response.Name;
    var id=response.id;
    console.log(id);
}

//used to retrieve the updated information from the update product input fields
//the info retrieved is used in the updateProducts(ProductId) from Models
function getUpdateName() {
    if (document.getElementById("name-field").value != "") {
        var updateName = document.getElementById("name-field").value;
    } return (updateName);
}
function getUpdateDescription() {
    if (document.getElementById("description-field").value != "") {
        var updateDescription = document.getElementById("description-field").value;
    } return (updateDescription);
}
function getUpdateQuantity() {
    if (document.getElementById("quantity-field").value != "") {
        var updateStock = document.getElementById("quantity-field").value;
    } return (updateStock);
}
function getUpdateImage() {
    if (document.getElementById("image-field").value != "") {
        var updateImage = document.getElementById("image-field").value;
    } return (updateImage);;
}
function getUpdatePrice() {
    if (document.getElementById("price-field").value != "") {
        var updatePrice = document.getElementById("price-field").value;
    } return (updatePrice);;
}
//called at the save update button click
//sends the put request to the server, empties the products model
//then makes a request to get the products Model object and 
//fills in the table again
document.getElementById("save_update").addEventListener("click",async (e) => {
     await fetch(Product.BASE_URL)
     .then( validateUpdateForm())
     
 })
 //cancels the update request
 document.getElementById("cancel_update").addEventListener("click",async (e) => {
      document.getElementById("update_product").style.display = "none";   
      document.getElementById("products_wrapper").style.display = "block";
  })
 
//called at the add new product button click
//opens an empty form to be filled in
document.getElementById("add_new").addEventListener("click", () => {
    document.getElementById("add_product").style.display = "block";
    document.getElementById("products_wrapper").style.display = "none";

})

//used to retrieve  information from the Add new product input fields
//the info retrieved is used in the createProduct(newProduct) from Models
function getName() {
    if (document.getElementById("name-field_add").value != "") {
        var inputName = document.getElementById("name-field_add").value;
    } return (inputName);
}

function getDescription() {
    if (document.getElementById("description-field_add").value != "") {
        var inputDescription = document.getElementById("description-field_add").value;
    } return (inputDescription);
}
function getQuantity() {
    if (document.getElementById("quantity-field_add").value != "") {
        var inputStock = document.getElementById("quantity-field_add").value;
    } return (inputStock);;
}
function getImage() {
    if (document.getElementById("image-field_add").value != "") {
        var inputImage = document.getElementById("image-field_add").value;
    } return (inputImage);;
}
function getPrice() {
    if (document.getElementById("price-field_add").value != "") {
        var inputPrice = document.getElementById("price-field_add").value;
    } return (inputPrice);;
}

//sends the request for creation of a new product
document.getElementById("save_add").addEventListener("click", async() => {
    await fetch(Product.BASE_URL);
    validateAddForm();
});
//cancels the request for creation of a new product
document.getElementById("cancel_add").addEventListener("click", async() => {
     window.location.reload();
})

//home button-redirects to index page
document.getElementById("home").addEventListener("click",async () => {
    location.href="index.html"
})
//form validations
function validateAddForm(){
    var image=document.getElementById("image-field_add").innerHTML;
    var name=document.getElementById("name-field_add").innerHTML;
    var Description=document.getElementById("description-field_add").innerHTML;
    var price=document.getElementById("price-field_add").innerHTML;
    var quantity=document.getElementById("quantity-field_add").innerHTML;
    var inputDescription = getDescription();
    var inputName = getName();
    var inputImage = getImage();
    var inputPrice = getPrice();
    var inputStock = getQuantity();
    if(document.getElementById("image-field_add").value==""){
        document.getElementById("message_add").innerHTML="Please provide an image URL";
        document.getElementById("image-field_add").classList.add("redBorder");
        document.getElementById("message_add").style.display="block" ;
        console.log(1)
    }
    else if(document.getElementById("name-field_add").value==""){
        document.getElementById("message_add").innerHTML="Please provide a name";
        document.getElementById("name-field_add").classList.add("redBorder");
        document.getElementById("message_add").style.display="block" ;
        console.log(3)
    }else if(document.getElementById("description-field_add").value==""){
        document.getElementById("message_add").innerHTML="Please provide adescription";
        document.getElementById("description-field_add").classList.add("redBorder");
        document.getElementById("message_add").style.display="block" ;
        console.log(5)
    }else if(document.getElementById("price-field_add").value==""){
        document.getElementById("message_add").innerHTML="Please provide a price";
        document.getElementById("price-field_add").classList.add("redBorder");
        document.getElementById("message_add").style.display="block" ;
        console.log(7)
    }else if( inputPrice<=0||inputPrice==isNaN){
        document.getElementById("message_add").innerHTML="Please provide a valid price";
        document.getElementById("price-field_add").classList.add("redBorder");
        document.getElementById("message_add").style.display="block" ;
        console.log(8)
    }else if(document.getElementById("quantity-field_add").value==""){
        document.getElementById("message_add").innerHTML="Please provide a quantity";
        document.getElementById("quantity-field_add").classList.add("redBorder");
        document.getElementById("message_add").style.display="block" ;
        console.log(10);
    }else if( inputStock<=0){
        document.getElementById("message_add").innerHTML="Please provide a valid quantity";
        document.getElementById("quantity-field_add").classList.add("redBorder");
        document.getElementById("message_add").style.display="block" ;
        console.log(11)
    }else{
        document.getElementById("message_add").innerHTML=""  ;
        document.getElementById("message_add").style.display="none"  ;
        document.getElementById("name-field_add").classList.remove("redBorder");
        document.getElementById("image-field_add").classList.remove("redBorder");
        document.getElementById("description-field_add").classList.remove("redBorder");
        document.getElementById("price-field_add").classList.remove("redBorder");
        document.getElementById("quantity-field_add").classList.remove("redBorder");
       // document.getElementById("message").style.display="none" ;
        console.log(12);
        createProduct();
        window.location.reload();
    }
 
}

function validateUpdateForm(){
    var image=document.getElementById("image-field").innerHTML;
    var name=document.getElementById("name-field").innerHTML;
    var Description=document.getElementById("description-field").innerHTML;
    var price=document.getElementById("price-field").innerHTML;
    var quantity=document.getElementById("quantity-field").innerHTML;
    var inputDescription = getUpdateDescription();
    var inputName = getUpdateName();
    var inputImage = getUpdateImage();
    var inputPrice = getUpdatePrice();
    var inputStock = getUpdateQuantity();
    if(document.getElementById("image-field").value==""){
        document.getElementById("message").innerHTML="Please provide an image URL";
        document.getElementById("image-field").classList.add("redBorder");
        document.getElementById("message").style.display="block" ;
        console.log(1)
    }
    else if(document.getElementById("name-field").value==""){
        document.getElementById("message").innerHTML="Please provide a name";
        document.getElementById("name-field").classList.add("redBorder");
        document.getElementById("message").style.display="block" ;
        console.log(3)
    }else if(document.getElementById("description-field").value==""){
        document.getElementById("message").innerHTML="Please provide adescription";
        document.getElementById("description-field").classList.add("redBorder");
        document.getElementById("message").style.display="block" ;
        console.log(5)
    }else if(document.getElementById("price-field").value==""){
        document.getElementById("message").innerHTML="Please provide a price";
        document.getElementById("price-field").classList.add("redBorder");
        document.getElementById("message").style.display="block" ;
        console.log(7)
    }else if( inputPrice<=0||inputPrice==isNaN){
        document.getElementById("message").innerHTML="Please provide a valid price";
        document.getElementById("price-field").classList.add("redBorder");
        document.getElementById("message").style.display="block" ;
        console.log(8)
    }else if(document.getElementById("quantity-field").value==""){
        document.getElementById("message").innerHTML="Please provide a quantity";
        document.getElementById("quantity-field").classList.add("redBorder");
        document.getElementById("message").style.display="block" ;
        console.log(10);
    }else if( inputStock<=0){
        document.getElementById("message").innerHTML="Please provide a valid quantity";
        document.getElementById("quantity-field").classList.add("redBorder");
        document.getElementById("message").style.display="block" ;
        console.log(11)
    }else{
        document.getElementById("message").style.display="none"  ;
        document.getElementById("name-field").classList.remove("redBorder");
        document.getElementById("image-field").classList.remove("redBorder");
        document.getElementById("description-field").classList.remove("redBorder");
        document.getElementById("price-field").classList.remove("redBorder");
        document.getElementById("quantity-field").classList.remove("redBorder");
        console.log(12);
        updateProducts(id);
        
        document.getElementById("update_product").style.display = "none";   
     document.getElementById("products_wrapper").style.display = "block";
     refreshTable()
     .then(getProducts())
     .then(fillProductsTable());
    }
 
}

