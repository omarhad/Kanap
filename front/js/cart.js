/*
 * Manages the display of the page cart
 */
let allCart = JSON.parse(localStorage.getItem("purchaseArticle"));

// Connection to the database 
fetch("http://localhost:3000/api/products")
// Response formatting in JSON format
.then( jsonListeArticle => jsonListeArticle.json() )
// Recovering the JSON table of articles 
.then( articleCart => {
    if (allCart && allCart.length != 0) {
        let priceTotalCart = 0
        let totalQuantity = 0
        for (let article of allCart){
            let articleCartContent = `<article class="cart__item" data-id="${article._id}" data-color="${article.colors}">
                                                <div class="cart__item__img">
                                                <img src="${article.imageUrl}" alt="${article.altTxt}">
                                                </div>
                                                <div class="cart__item__content">
                                                <div class="cart__item__content__description">
                                                    <h2>${article.name}</h2>
                                                    <p>${article.colors}</p>
                                                </div>
                                                <div class="cart__item__content__settings">
                                                    <div class="cart__item__content__settings__quantity">
                                                    <p>Qté : </p>
                                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                                                    </div>
                                                    <div class="cart__item__content__settings__delete">
                                                    <p class="deleteItem">Supprimer</p>
                                                    </div>
                                                </div>
                                                </div>
                                            </article>`;
                //construction of the cart with all the items 
                document.querySelector( "#cart__items" ).innerHTML += articleCartContent
                //recover the price of the item displayed in the item list
                let foundArticleBdd = articleCart.find(elmt => elmt._id == article._id)
                // calculate the total price of the item, convert to number
                let priceTotalArticle = parseInt(foundArticleBdd.price) * parseInt(article.quantity)
                priceTotalCart += priceTotalArticle
                // display the total price of the cart
                document.querySelector( "#totalPrice" ).innerHTML = `${priceTotalCart}`
                // display the total number of items in the cart
                totalQuantity += parseInt(article.quantity)
                document.querySelector( "#totalQuantity" ).innerHTML = `${totalQuantity}`

        }
        // modification of the quantity of the item in the cart
        let cart = new Cart()
        cart.modificationQantity(articleCart)

        // Delete the item from the cart

        document.querySelectorAll( ".deleteItem" ).forEach( elmt => {
            elmt.addEventListener( "click", () => {
                let article = elmt.parentElement.parentElement.parentElement.parentElement
                let id = article.dataset.id
                cart.deleteArticle(id, articleCart)
            })
        })
        
        
    }else {
        // if there is no cart we would create an informative H1 and appropriate quantity
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
    }  

    // monitor the change of value of the input firstName
    let firstName = document.getElementById("firstName")
    let firstNameError = document.getElementById("firstNameErrorMsg")
    firstName.addEventListener("change", function(){
        // recovery of the input value
        let inputFirstName = document.getElementById("firstName").value
        let firstNameVerification = new VerificationInput(inputFirstName, firstNameError)
        firstNameVerification.verificationVarious()
    })
    // monitor the change of value of the input lastName
    let lastName = document.getElementById("lastName")
    let lastNameError = document.getElementById("lastNameErrorMsg")
    lastName.addEventListener("change", function(){
        // recovery of the input value
        let inputLastName = document.getElementById("lastName").value
        let lastNameVerification = new VerificationInput(inputLastName, lastNameError)
        lastNameVerification.verificationVarious()
    })
    // monitor the change of value of the input address
    let address = document.getElementById("address")
    let addressError = document.getElementById("addressErrorMsg")
    address.addEventListener("change", function(){
        // recovery of the input value
        let inputAddress = document.getElementById("address").value
        let addressVerification = new VerificationInput(inputAddress, addressError)
        addressVerification.verificationAdress()
    })
    // monitor the change of value of the input city
    let city = document.getElementById("city")
    let cityError = document.getElementById("cityErrorMsg")
    city.addEventListener("change", function(){
        // recovery of the input value
        let inputCity = document.getElementById("city").value
        let cityVerification = new VerificationInput(inputCity, cityError)
        cityVerification.verificationVarious()
    })
    // monitor the change of value of the input email
    let email = document.getElementById("email")
    let emailError = document.getElementById("emailErrorMsg")
    email.addEventListener("change", function(){
        // recovery of the input value
        let inputEmail = document.getElementById("email").value
        let emailVerification = new VerificationInput(inputEmail, emailError)
        emailVerification.verificationEmail()
    })
})

 // if the #order button is clicked
    document.querySelector("#order").addEventListener("click", function(event){
        event.preventDefault();
        // if the form is valid
        let order = new Order( firstName.value, lastName.value, address.value, city.value, email.value )
        if (order.checkValidity()){
            if(allCart){
                order.sendOrder()
            }else{
                alert("Vous n'avez pas d'article dans votre panier, veuillez ajoutez un article dans le panier.")
            }
        }
    })