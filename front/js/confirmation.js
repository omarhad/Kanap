// recuperation of the OrderId from the url
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const orderId = urlParams.get('id')
// display the orderId (order number) in the page
document.querySelector("#orderId").innerHTML = orderId