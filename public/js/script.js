const container = document.getElementById("container");
const add_to_cart_btns = document.querySelectorAll(".add-to-cart-btn");
const cart_controls = document.querySelectorAll(".cart-controls");

// Function to get the cart from cookies
function getCartFromCookies() {
    const cart = document.cookie
        .split(';')
        .find(row => row.trim().startsWith('cart='))
        ?.split('=')[1];
    return cart ? JSON.parse(cart) : [];
}

// Function to set the cart in cookies
function setCartInCookies(cart) {
    // console.log(cart);
    // console.log(JSON.stringify(cart));
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; max-age=3600`;
}

// Function to clear the cart cookies


// Add item to cart in cookies and the server database
function addToCart(button) {
    const card = button.closest(".product-card");
    const cartControls = card.querySelector(".cart-controls");
    const quantityDisplay = card.querySelector(".quantity");
    const isbn = button.getAttribute("data-isbn");
    let quantity = parseInt(quantityDisplay.textContent, 10);

    button.style.display = "none"; // Hide Add to Cart button
    cartControls.style.display = "flex"; // Show quantity controls
    const mycart = {
        isbn13:"",
        qtty:1
    }
    mycart.isbn13=isbn;
    const cart = getCartFromCookies(); // Get current cart from cookies
    // console.log(cart);
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(item => item.isbn === isbn);
    if (existingItemIndex > -1) {
        // Item exists, update the quantity

        cart[existingItemIndex].quantity += quantity;
    } else {
        // Item doesn't exist, add new item
        cart.push({ isbn, quantity });
    }

    setCartInCookies(cart); // Update the cart in cookies

    // Update the cart in the database
    updateCartInDatabase(mycart);
}

// Increase quantity of a product in the cart
function increaseQuantity(button) {
    const card = button.closest(".product-card");
    const quantityDisplay = card.querySelector(".quantity");
    let quantity = parseInt(quantityDisplay.textContent, 10);

    quantity++;
    quantityDisplay.textContent = quantity;

    updateCartInCookiesAndDatabase(card, 1);
}

// Decrease quantity of a product in the cart
function decreaseQuantity(button) {
    const card = button.closest(".product-card");
    const quantityDisplay = card.querySelector(".quantity");
    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    const cartControls = card.querySelector(".cart-controls");
    let quantity = parseInt(quantityDisplay.textContent, 10);

    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
    } else {
        cartControls.style.display = "none"; // Hide quantity controls
        addToCartBtn.style.display = "inline-block"; // Show Add to Cart button
    }

    updateCartInCookiesAndDatabase(card, -1);
}

// Update the cart in cookies and send data to the server to update the database
function updateCartInCookiesAndDatabase(card, quantity) {
    const isbn = card.querySelector(".add-to-cart-btn").getAttribute("data-isbn");
    const cart = getCartFromCookies(); // Get current cart from cookies
    const mycart = {
        isbn13:"",
        qtty:quantity
    }
    mycart.isbn13=isbn;
    mycart.qtty=quantity;
    // Update or add the item to the cart in cookies
    const existingItemIndex = cart.findIndex(item => item.isbn === isbn);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity = quantity;
    }

    setCartInCookies(cart); // Update the cart in cookies

    // Send updated cart to the server to update in the database
    updateCartInDatabase(mycart);
}

// Function to send the cart data to the server to update the user's cart in the database
function updateCartInDatabase(cart) {
    // console.log(JSON.stringify({ cart }));
    // cart = JSON.stringify(cart);
    console.log(cart);
    fetch('/api/updateCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Cart updated in the database', data);
        // clearCartCookies(); // Clear cart cookies after a successful update
    })
    .catch(error => {
        console.error('Error updating cart in the database:', error);
    });
}
function see_product(product)
{
    const card = product.closest('.product-card');
    console.log(card.getAttribute('data-isbn'));
}