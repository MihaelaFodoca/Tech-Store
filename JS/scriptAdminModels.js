class Product {
    constructor(id, description, image, stock, price) {
        this.id = id;
        this.description = description;
        this.image = image;
        this.stock = stock;
        this.price = price;
    }
}
class NewProduct {
    constructor( Description,Name, image,price, stock) { 
        this.Description = Description;
        this.Name = Name;
        this.image = image;
        this.price = price;
        this.stock = stock;
    }
}

class NewCartProduct{
    constructor( Id,  quantity,name,price) { 
        this.Id=Id;
        this.quantity = quantity;
        this.name=name;
    }
}

Product.BASE_URL = "https://magazin-electronic-miha-fodoca.firebaseio.com/products.json";
var productsModel=[];
var ProductDetails=[];
//get the product database from the server, method Get
function getProducts(){   
       return fetch(Product.BASE_URL)
    .then(response => response.json())
    .then(responseBody => {
         for(id in responseBody){
            productsModel.push({
                productId:id,
                productData:responseBody[id]
            })
        }
    })
}

//get the specified product from the productsmodel based on its id
function getProductById(productId) {
    for (let i=0; i<productsModel.length; i++) {
        if (productsModel[i].productId === productId) {
            return productsModel[i];
        }
    }
    return null;
}

//get the products details for filling in the fields from the update form-Admin
function getProductDetailsUpdate(ProductId){
    console.log(ProductId);
    return fetch("https://magazin-electronic-miha-fodoca.firebaseio.com/products/"+ProductId+".json")
 .then(response => response.json())
 .then(responseBody => {
 console.log(responseBody);
 localStorage.setItem("id",ProductId);
 fillUpdateForm(responseBody); //fills the fields in the update form - Admin with the responsebody
 })

}

//get the products details for filling in the details wrapper in the Details page
//create the object ProductDetails used in the product wrapper display
function getProductDetails(ProductId){
return fetch("https://magazin-electronic-miha-fodoca.firebaseio.com/products/"+ProductId+".json")
 .then(response => response.json())
 .then(responseBody => {
 console.log(responseBody);
 var ProductDetail = new NewProduct(responseBody.Description ,responseBody.Name, responseBody.image, responseBody.price, responseBody.stock );
 ProductDetails.push(ProductDetail)
 localStorage.setItem("id",ProductId);
 displayProductDetails(ProductDetail);
 })
}

function DeleteProduct(ProductId){
    return fetch("https://magazin-electronic-miha-fodoca.firebaseio.com/products/"+ProductId+".json",{
        method: 'DELETE',
    })
 .then(response => response.json())
}

//creates a new product based on the information filled in the input fields. 
//the info is used to create an object which is then sent to the server with the method post
function createProduct(newProduct) {   
    var inputDescription = getDescription();
    var inputName = getName();
    var inputImage = getImage();
    var inputPrice = getPrice();
    var inputStock = getQuantity();
    if(inputDescription!==undefined &&  inputName!==undefined &&  inputImage!==undefined && inputPrice!==undefined && inputStock!==undefined){
   var newProduct = new NewProduct(inputDescription,inputName, inputImage, inputPrice, inputStock );
   console.log(newProduct);
    fetch("https://magazin-electronic-miha-fodoca.firebaseio.com/products.json", {
       method: 'POST',
       headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
       body:JSON.stringify(newProduct)  
   })
   .then(response => console.log(response.json()))
   .catch(error => console.log(error));
  }else{
      alert ("please fill in")
  }}
 //modifies a product details based on the information filled in the update input fields. 
//the info is used to create an object which is then sent to the server with the method put
  function updateProducts(ProductId, updatedProduct) {   
    var ProductId=localStorage.getItem("id");
    var updateDescription = getUpdateDescription();
    var  updateName = getUpdateName();
    var  updateImage = getUpdateImage();
    var  updatePrice = getUpdatePrice();
    var  updateStock = getUpdateQuantity();
    var updatedProduct = new NewProduct(updateDescription,updateName, updateImage, updatePrice, updateStock );
   console.log(updatedProduct);
    return fetch("https://magazin-electronic-miha-fodoca.firebaseio.com/products/"+ProductId+".json",{
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Accept': 'application/json'},
        body:JSON.stringify(updatedProduct)
    })
    .then(response => console.log(response.json()))
    .catch(error => console.log(error));
}


//the function is called at details page reload and retrieves the elements from the previous local storage session
//and adds the info in cartobjects
function keepLocalStorageInfo() {  //la details page reload imi ia toate elementele din sesiunea de local storage anterioara si
    var newVal = localStorage.getItem("object");//le pune in cartobjects, pentru a avea istoricul atunci cand dau click pe alt produs p
    var parsednewVal = JSON.parse(newVal);
    console.log(parsednewVal);   
if(parsednewVal !==null){
    parsednewVal.forEach(el => {
        cartObjects.push(el);
        console.log(el);
    });
}
    console.log(cartObjects);
}