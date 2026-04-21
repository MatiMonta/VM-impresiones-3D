//Traigo los productos que hayan cargados y el carrito
let products = JSON.parse(localStorage.getItem("products")) || []
let cart = JSON.parse(sessionStorage.getItem("cart")) || []

//Modal
let modal = document.getElementById("modal")
let openBtn = document.getElementById("abrirFormulario")
let closeBtn = document.getElementById("closeModal")

//Variables para conversión de moneda
let currentCurrency = "ARS"
let exchangeRate = 1

openBtn.addEventListener("click", () => {
    modal.style.display = "flex"
})

closeBtn.addEventListener("click", () => {
    modal.style.display = "none"
})

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none"
    }
})

//Funcion constructora de productos
function Product(id, name, price, category, stock, image) {
    this.id = id
    this.name = name
    this.price = price
    this.category = category
    this.stock = stock
    this.image = image
}

function addProduct() {
    let name = document.getElementById("name").value
    let price = parseFloat(document.getElementById("price").value)
    let category = document.getElementById("category").value
    let stock = parseInt(document.getElementById("stock").value)
    let image = document.getElementById("image").value
    let id = products.length + 1
    let newProduct = new Product(id, name, price, category, stock, image)

    products.push(newProduct)
    localStorage.setItem("products", JSON.stringify(products))
    displayProducts()
    document.getElementById("productForm").reset()
    modal.style.display = "none"
}

function displayProducts() {

    let container = document.getElementById("productContainer")
    container.innerHTML = ""
    products.forEach(product => {
        container.innerHTML += `
                                <div class="productCard">

                                <img src="${product.image}" alt="${product.name}">

                                <h3>${product.name}</h3>

                                <p>Precio: $${product.price}</p>
                                <p>Precio: ${currentCurrency === "USD" ? "USD" : "$"}${convertirPrecio(product.price)}</p>

                                <p>Stock: ${product.stock}</p>

                                <button onclick="addToCart(${product.id})"
                                ${product.stock === 0 ? "disabled" : ""}>
                                ${product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                                </button>

                                <button onclick="addStock(${product.id})">
                                Agregar stock
                                </button>

                                </div>
                                `
    })
}

function addToCart(id) {
    let product = products.find(p => p.id === id)
    if (product.stock > 0) {
        let productInCart = cart.find(p => p.id === id)
        if (productInCart) {
            productInCart.quantity++
        }
        else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            })
        }
        product.stock--
        sessionStorage.setItem("cart", JSON.stringify(cart))
        localStorage.setItem("products", JSON.stringify(products))
        displayProducts()
        displayCart()
    }
}

function displayCart() {

    let container = document.getElementById("carrito")

    container.innerHTML = ""

    cart.forEach(product => {

        container.innerHTML += `
        <div class="cartItem">
            <p>${product.name} x${product.quantity} - $${product.price * product.quantity}</p>
            <button onclick="removeFromCart(${product.id})">Eliminar</button>
        </div>
        `
    })

    calculateTotal()
}

function removeFromCart(id) {

    let productInCart = cart.find(product => product.id === id)
    let productInStore = products.find(product => product.id === id)

    if (productInCart) {
        productInCart.quantity--
        if (productInStore) {
            productInStore.stock++
        }
        else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            })
        }
        product.stock--
        sessionStorage.setItem("cart", JSON.stringify(cart))
        localStorage.setItem("products", JSON.stringify(products))
        displayProducts()
        displayCart()
    }
}

function displayCart() {

    let container = document.getElementById("carrito")

    container.innerHTML = ""

    cart.forEach(product => {

        container.innerHTML += `
        <div class="cartItem">
            <p>${product.name} x${product.quantity} - 
                ${currentCurrency === "USD" ? "USD" : "$"}
                ${convertirPrecio(product.price * product.quantity)}
            </p>
            <button onclick="removeFromCart(${product.id})">Eliminar</button>
        </div>
        `
    })

    calculateTotal()
}

function removeFromCart(id) {

    let productInCart = cart.find(product => product.id === id)
    let productInStore = products.find(product => product.id === id)

    if (productInCart) {
        productInCart.quantity--
        if (productInStore) {
            productInStore.stock++
        }
        if (productInCart.quantity === 0) {
            cart = cart.filter(product => product.id !== id)
        }
        sessionStorage.setItem("cart", JSON.stringify(cart))
        localStorage.setItem("products", JSON.stringify(products))
        displayCart()
        displayProducts()
    }
}


function calculateTotal() {
    let totalPrice = cart.reduce((acc, product) => {
        return acc + (product.price * product.quantity)
    }, 0)
    document.getElementById("total").innerText =
    "Total: " +
    (currentCurrency === "USD" ? "USD " : "$") +
    convertirPrecio(totalPrice)
}

function vaciarCarrito() {

    cart.forEach(cartProduct => {
        let productInStore = products.find(product => product.id === cartProduct.id)

        if (productInStore) {
            productInStore.stock += cartProduct.quantity
        }
    })

    localStorage.setItem("products", JSON.stringify(products))

    cart = []

    sessionStorage.removeItem("cart")

    displayProducts()
    displayCart()
}

function addStock(id) {

    let amount = parseInt(prompt("¿Cuántas unidades querés agregar al stock?"))

    if (isNaN(amount) || amount <= 0) {
        alert("Cantidad inválida")
        return
    }

    let product = products.find(p => p.id === id)

    if (product) {
        product.stock += amount

        localStorage.setItem("products", JSON.stringify(products))

        displayProducts()
    }

}

let form = document.getElementById("productForm")

async function obtenerCotizacion() {
    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")

        if (!response.ok) {
            throw new Error("Error al obtener cotización")
        }

        const data = await response.json()

        exchangeRate = data.rates.ARS

    } catch (error) {
        console.error("Error en cotización:", error)
    }
}

function convertirPrecio(precio) {
    if (currentCurrency === "USD") {
        return (precio / exchangeRate).toFixed(2)
    }
    return precio
}

form.addEventListener("submit", function (e) {

    e.preventDefault()

    addProduct()

})

async function inicializarMoneda() {

    const savedCurrency = localStorage.getItem("currency")

    if (savedCurrency) {
        currentCurrency = savedCurrency
    } else {
        // Detectar idioma del navegador
        const locale = navigator.language

        if (locale.includes("es-AR")) {
            currentCurrency = "ARS"
        } else {
            currentCurrency = "USD"
        }
        if (productInCart.quantity === 0) {
            cart = cart.filter(product => product.id !== id)
        }
        sessionStorage.setItem("cart", JSON.stringify(cart))
        localStorage.setItem("products", JSON.stringify(products))
        displayCart()
        displayProducts()
    }
}


function calculateTotal() {
    let totalPrice = cart.reduce((acc, product) => {
        return acc + (product.price * product.quantity)
    }, 0)
    document.getElementById("total").innerText = "Total: $" + totalPrice
}

function vaciarCarrito() {

    cart.forEach(cartProduct => {
        let productInStore = products.find(product => product.id === cartProduct.id)

        if (productInStore) {
            productInStore.stock += cartProduct.quantity
        }
    })

    localStorage.setItem("products", JSON.stringify(products))

    cart = []

    sessionStorage.removeItem("cart")

    displayProducts()
    displayCart()
}

function addStock(id) {

    let amount = parseInt(prompt("¿Cuántas unidades querés agregar al stock?"))

    if (isNaN(amount) || amount <= 0) {
        alert("Cantidad inválida")
        return
    }


    let product = products.find(p => p.id === id)

    if (product) {
        product.stock += amount

        localStorage.setItem("products", JSON.stringify(products))

        displayProducts()
    }

}

let form = document.getElementById("productForm")

form.addEventListener("submit", function (e) {

    e.preventDefault()

    addProduct()

})

displayProducts()
displayCart()
    // Si es USD buscar cotización
    if (currentCurrency === "USD") {
        await obtenerCotizacion()
        document.getElementById("toggleCurrency").innerText = "Ver precios en ARS"
    } else {
        document.getElementById("toggleCurrency").innerText = "Ver precios en USD"
    }

async function init() {
    await inicializarMoneda()
    displayProducts()
    displayCart()
}

init()

const btnCurrency = document.getElementById("toggleCurrency")

if (btnCurrency) {
    btnCurrency.addEventListener("click", async () => {

        if (currentCurrency === "ARS") {

            await obtenerCotizacion()

            currentCurrency = "USD"
            localStorage.setItem("currency", "USD")

            btnCurrency.innerText = "Ver precios en ARS"

        } else {

            currentCurrency = "ARS"
            localStorage.setItem("currency", "ARS")

            btnCurrency.innerText = "Ver precios en USD"
        }

        displayProducts()
        displayCart()
    })
}
