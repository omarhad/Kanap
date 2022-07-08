/**
 * Representation of the format of an article 
 */
class Article {

    constructor(jsonArticle){
        jsonArticle && Object.assign(this, jsonArticle)
    }

    // search for colors for the selected product 

    addColorOption (article){
        const htmlElmtColor = document.getElementById("colors")
        for (let color of article.colors) {
            // add color option tags with their value
            htmlElmtColor.innerHTML += `<option value="${color}">${color}</option>`
        }
    }
    
    // Verification if the color is well chosen 
    verificationItemSelected (color, quantity){
        // Checking the color
        if (color == "") {
            window.alert("Vous devez choisir une couleurs SVP .")
        }
        // Checking the quantity 
        if (quantity == 0) {
            window.alert("Vous devez choisir le nombre d'article souhaiter .")
        }
    }

}

class Cart extends Article {

    constructor(article){
            super(article)
            delete this.price 
    }

    addArticle(article, color, quantity){
        this.colors = color
        this.quantity = quantity
        let aricleAuPanier = JSON.parse(localStorage.getItem('purchaseArticle'))
        if (aricleAuPanier) {
            // check if the article already exists in the localStorage
            let foundArticle = aricleAuPanier.find( elmt => elmt._id == article._id 
                                                    && elmt.colors == article.colors)
            // if article exists : concatenate the quantity
            if (foundArticle != undefined){
                foundArticle.quantity = parseInt(foundArticle.quantity) + parseInt(article.quantity)
            }
            //if not : add it in the localStorage
            else {
                aricleAuPanier.push(article)
            }
            localStorage.setItem('purchaseArticle', JSON.stringify(aricleAuPanier))
            
        } else {
            aricleAuPanier = []
            aricleAuPanier.push(article)
            localStorage.setItem('purchaseArticle', JSON.stringify(aricleAuPanier))
        }  
    }

    addToCart(article){
        const htmlElmtAddToCart = document.getElementById("addToCart")
        htmlElmtAddToCart.addEventListener("click",  () => {
            // Recovery of the selected color
            let colorSelected = document.getElementById("colors").value
            // Recovery of the selected quantity
            let quantitySelected = document.getElementById("quantity").value
            if (colorSelected == "" || quantitySelected == 0) {
                this.verificationItemSelected(colorSelected, quantitySelected)
            }else {
                this.addArticle(article,colorSelected,quantitySelected)
                // redirect to cart page 
                window.location.href ="cart.html"
            }
        })
    }

    modificationQantity (jsonListeArticle){
        const articleCartId = document.getElementsByClassName( "cart__item" )
        const inputQantity = document.getElementsByClassName("itemQuantity")
        const articleCartPrice = document.getElementsByClassName( "cart__item__content__description" )
        let priceTotalCart = 0
        for (let i = 0; i < articleCartId.length; i++) {
            // recovery of the quantity of the article displayed in the basket
            let foundArticleLs = allCart.find( elmt => elmt._id == articleCartId[i].dataset.id
                                                                && elmt.quantity == inputQantity[i].value)
            foundArticleLs.quantity = inputQantity[i].value
            // recovery of the price of the item displayed in the cart
            let foundArticleBdd = jsonListeArticle.find(elmt => elmt._id == articleCartId[i].dataset.id)
            articleCartPrice[i].innerHTML += `<p>${foundArticleBdd.price} €</p>`;
            //calculation of the total price of the items in the basket
            priceTotalCart = priceTotalCart + (parseInt(foundArticleBdd.price)*parseInt(foundArticleLs.quantity));
            document.querySelector( "#totalPrice" ).innerHTML = priceTotalCart;
            
            inputQantity[i].addEventListener('change', () => {
                foundArticleLs.quantity = inputQantity[i].value;
                localStorage.setItem('purchaseArticle', JSON.stringify(allCart));
                //recalculates the total quantity and the total price after change
                let newQuantityArticleTotal = 0;
                let newPriceTotalCart = 0;
                allCart.forEach(element => {
                    let foundArticleBdd = jsonListeArticle.find(elmt => elmt._id == element._id)
                    newQuantityArticleTotal += parseInt(element.quantity);
                    newPriceTotalCart += parseInt(foundArticleBdd.price)*parseInt(element.quantity);
                });
                document.querySelector( "#totalQuantity" ).innerHTML = newQuantityArticleTotal;
                document.querySelector( "#totalPrice" ).innerHTML = newPriceTotalCart;
            })
        }
    }
    // method that takes an item as input and deletes it from the basket and the localStorage
    deleteArticle(id, articleCart){
        let index = allCart.findIndex(elmt => elmt._id == id)
        allCart.splice(index, 1)
        localStorage.setItem('purchaseArticle', JSON.stringify(allCart));
        // recalculate the quantity and total price after deleting an item
        let newQuantityArticleTotal = 0;
        let newPriceTotalCart = 0;
        allCart.forEach(element => {
            let foundArticleBdd = articleCart.find(elmt => elmt._id == element._id)
            newQuantityArticleTotal += parseInt(element.quantity);
            newPriceTotalCart += parseInt(foundArticleBdd.price)*parseInt(element.quantity);
        })
        document.querySelector( "#totalQuantity" ).innerHTML = newQuantityArticleTotal
        document.querySelector( "#totalPrice" ).innerHTML = newPriceTotalCart
        // redirection to the cart page
        window.location.href ="cart.html"
    }
}

// class to check the user input on the input element of the page cart.html in RegEx
class VerificationInput {
    constructor(input , message){
        this.input = input
        this.message = message
    }
    // verification of the input format #firstName / #lastName / #city  
    verificationVarious(){
        let regEx = /^[a-zA-ZàâäéèêëîïôöûüùçÀÂÄÉÈÊËÎÏÔÖÛÜÙÇ'-']+$/
        // on surveille le changement de valeur de l'input
        if (regEx.test(this.input) && this.input != "") {
            // if true clears the content of the error message
            this.message.innerHTML = ""
            return true
        } else {
            // if false displays the error message
            this.message.innerHTML = `<span>Votre saisie n'est pas valide</span>`
            return false
        }
    }
    // verification of the input format #adress 
    verificationAdress(){
        let regEx = /^[a-zA-Z0-9àâäéèêëîïôöûüùçÀÂÄÉÈÊËÎÏÔÖÛÜÙÇ\s\,\''\-]*$/
        // on surveille le changement de valeur de l'input
        if (regEx.test(this.input) && this.input != "") {
            // if true clears the content of the error message
            this.message.innerHTML = ""
            return true
        } else {
            // if false displays the error message
            this.message.innerHTML = `<span>Veuillez entrer une adresse valide</span>`
            return false
        }
    }
    
    // verification of the input format #email
    verificationEmail(){
        let regEx = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
        // on surveille le changement de valeur de l'input
        if (regEx.test(this.input) && this.input != "") {
            // if true clears the content of the error message
            this.message.innerHTML = ""
            return true
        } else {
            // if false displays the error message
            this.message.innerHTML = `<span>Veuillez entrer une adresse email valide</span>`
            return false
        }
    }

}
// class pour confirmation de la commande
class Order {
    constructor(firstName, lastName, city, adress, email){
        this.firstName = firstName
        this.lastName = lastName
        this.city = city
        this.adress = adress
        this.email = email
    }
    // method that sends the order to the server
    sendOrder(){
        let idProducts = []
        for(let i = 0; i < allCart.length; i++){
            idProducts.push(allCart[i]._id)
        }
        let order = {
            contact: {
                firstName: this.firstName,
                lastName: this.lastName,
                city: this.city,
                address: this.adress,
                email: this.email,
            },
            products: idProducts
        }

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json' 
            },body: JSON.stringify(order)
        })
        .then(res => {
            if (res.ok){
                return res.json()
            }
        })
        .then(data => {
            // redirect to the confirmation page
            window.location.href ="confirmation.html?id="+data.orderId
            // clear the localStorage
            localStorage.removeItem('purchaseArticle')
        })
        .catch(error => console.log(error))
    }
    // verification the valability of the input
    checkValidity(){
        let firstName = document.querySelector('#firstName')
        let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg')
        let lastName = document.querySelector('#lastName')
        let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg')
        let city = document.querySelector('#city')
        let cityErrorMsg = document.querySelector('#cityErrorMsg')
        let address = document.querySelector('#address')
        let adressErrorMsg = document.querySelector('#addressErrorMsg')
        let email = document.querySelector('#email')
        let emailErrorMsg = document.querySelector('#emailErrorMsg')
        
        let verificationInput = new VerificationInput(firstName.value, firstNameErrorMsg)
        let verificationInput2 = new VerificationInput(lastName.value, lastNameErrorMsg)
        let verificationInput3 = new VerificationInput(city.value, cityErrorMsg)
        let verificationInput4 = new VerificationInput(address.value, adressErrorMsg)
        let verificationInput5 = new VerificationInput(email.value, emailErrorMsg)
        if (verificationInput.verificationVarious() && verificationInput2.verificationVarious() && verificationInput3.verificationVarious() && verificationInput4.verificationAdress() && verificationInput5.verificationEmail()) {
            return true
        }else {
            return false
        }
    }

}