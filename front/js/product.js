/**
 * Display of the selected article
 */
// Retrieve the article ID of the page
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get('id')
// If no ID in the URL then it redirects to the home page
if (id === null) {window.location.href ="index.html"}

const htmlELmtImage = document.querySelector("article div.item__img")
const htmlELmtTitle = document.querySelector("#title")
const htmlELmtPrice = document.querySelector("#price")
const htmlELmtDescription = document.querySelector("#description")

fetch( "http://localhost:3000/api/products/" + id )
.then( res => res.json() )
.then( articleSelected => {
    document.title = articleSelected.name
    let article = new Article(articleSelected)
    htmlELmtImage.innerHTML = `<img src="${article.imageUrl}" alt=${article.altTxt}>`
    htmlELmtTitle.innerHTML = `<h1 id="title">${article.name}</h1>`
    htmlELmtPrice.innerHTML = `${article.price} `
    htmlELmtDescription.innerHTML = `<p id="description">${article.description}</p>`
    article.addColorOption(article)
    let cart = new Cart(articleSelected)
    cart.addToCart(cart)

})