/**
 * Manages the display and interactions of the home page
 */
 const htmlElmtAllArticle = document.getElementById("items")
 // Connection to the database 
 fetch("http://localhost:3000/api/products")
 // Response formatting in JSON format
 .then( res => res.json() )
 // Recovering the JSON table of articles 
 .then( jsonListeArticle => {
     for (let jsonArticle of jsonListeArticle){
         let article = new Article(jsonArticle)
         htmlElmtAllArticle.innerHTML += `<a href="./product.html?id=${article._id}">
                                             <article>
                                             <img src="${article.imageUrl}" alt="${article.altTxt}">
                                             <h3 class="productName">${article.name}</h3>
                                             <p class="productDescription">${article.description}</p>
                                             </article>
                                         </a>`
     }
 })