// Selecting necessary elements
const cartCountElement = document.getElementById("cart-count");

let cart = []; // Store cart items

// Function to add item to cart
function addToCart(event) {
    const button = event.target;
    const product = button.closest(".product"); // Find the product div

    const title = product.querySelector(".product-title").textContent;
    const priceText = product.querySelector(".product-price").textContent;
    const price = parseInt(priceText.replace("₹", "").replace(",", "")); // Convert price to number

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ title, price, quantity: 1 });
    }

    updateCartCount(); // Update navbar cart count
}

// Function to update cart count in navbar
function updateCartCount() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Add event listeners to all "Add to Cart" buttons
document.querySelectorAll(".btn").forEach(button => {
    if (button.textContent.includes("Add to Cart")) {
        button.addEventListener("click", addToCart);
    }
});
