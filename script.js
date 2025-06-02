document.addEventListener("DOMContentLoaded", function () {
  // ====== Part 1: Index.html logic - Add to Cart functionality ======
  const cartCount = document.getElementById("cart-count");

  function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    alert(`Added ${name} to cart! Total items: ${getCartItemCount()}`);
  }

  // Function to update cart count
  function updateCartCount() {
    if (cartCount) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  }

  // Function to get total cart item count
  function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Function to remove item from cart
  function removeFromCart(itemName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    return cart;
  }

  // Function to update item quantity
  function updateQuantity(itemName, newQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(item => item.name === itemName);
    
    if (item) {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        cart = cart.filter(item => item.name !== itemName);
      } else {
        item.quantity = newQuantity;
      }
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    return cart;
  }

  // Attach click listeners to all Add to Cart buttons on index.html
  document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function (event) {
      if (event.target.textContent.trim() === "Add to Cart") {
        const product = event.target.closest(".product");
        const name = product.querySelector(".product-title").textContent;
        const price = parseInt(product.querySelector(".product-price").textContent.replace(/₹|,/g, ""));
        const image = product.querySelector("img").src;
        addToCart(name, price, image);
      }
    });
  });

  // Initialize cart count on page load (index.html)
  updateCartCount();

  // ====== Part 2: cart.html logic - Display cart items and total ======
  if (document.querySelector(".cart-items")) { // Run only on cart.html
    
    function displayCartItems() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const cartItemsContainer = document.querySelector(".cart-items");
      const cartTotal = document.getElementById("cart-total");

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #666;">
            <h3>Your cart is empty</h3>
            <p>Add some items to get started!</p>
            <a href="index.html" style="color: #007bff; text-decoration: none;">← Continue Shopping</a>
          </div>
        `;
        if (cartTotal) cartTotal.innerText = "0";
        return;
      }

      let totalPrice = 0;

      cartItemsContainer.innerHTML = cart.map(item => {
        totalPrice += item.price * item.quantity;
        return `
          <div class="cart-item" style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee; margin-bottom: 10px;">
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
            
            <div class="cart-info" style="flex: 1;">
              <h4 style="margin: 0 0 5px 0; color: #333;">${item.name}</h4>
              <p style="margin: 3px 0; color: #666;">Price: ₹${item.price.toLocaleString()}</p>
              <p style="margin: 3px 0; color: #666;">Subtotal: ₹${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            
            <div class="quantity-controls" style="display: flex; align-items: center; margin: 0 15px;">
              <button class="quantity-btn decrease-btn" data-name="${item.name}" 
                      style="background: #f8f9fa; border: 1px solid #dee2e6; color: #6c757d; width: 30px; height: 30px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold;">-</button>
              
              <span class="quantity-display" style="margin: 0 15px; font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
              
              <button class="quantity-btn increase-btn" data-name="${item.name}" 
                      style="background: #f8f9fa; border: 1px solid #dee2e6; color: #6c757d; width: 30px; height: 30px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;">+</button>
            </div>
            
            <button class="remove-btn" data-name="${item.name}" 
                    style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">
              Remove
            </button>
          </div>
        `;
      }).join("");

      if (cartTotal) {
        cartTotal.innerText = totalPrice.toLocaleString();
      }

      // Add event listeners for quantity buttons and remove buttons
      addCartEventListeners();
    }

    function addCartEventListeners() {
      // Remove button listeners
      document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function() {
          const itemName = this.getAttribute("data-name");
          
          if (confirm(`Are you sure you want to remove "${itemName}" from your cart?`)) {
            removeFromCart(itemName);
            displayCartItems(); // Refresh the display
            
            // Show feedback
            const feedback = document.createElement("div");
            feedback.textContent = `"${itemName}" removed from cart`;
            feedback.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #28a745;
              color: white;
              padding: 12px 20px;
              border-radius: 6px;
              z-index: 1000;
              font-size: 14px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(feedback);
            
            setTimeout(() => {
              feedback.remove();
            }, 3000);
          }
        });
      });

      // Decrease quantity button listeners
      document.querySelectorAll(".decrease-btn").forEach(button => {
        button.addEventListener("click", function() {
          const itemName = this.getAttribute("data-name");
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const item = cart.find(item => item.name === itemName);
          
          if (item) {
            if (item.quantity > 1) {
              updateQuantity(itemName, item.quantity - 1);
              displayCartItems();
            } else {
              // If quantity is 1, ask for confirmation to remove
              if (confirm(`Remove "${itemName}" from your cart?`)) {
                removeFromCart(itemName);
                displayCartItems();
              }
            }
          }
        });
      });

      // Increase quantity button listeners
      document.querySelectorAll(".increase-btn").forEach(button => {
        button.addEventListener("click", function() {
          const itemName = this.getAttribute("data-name");
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const item = cart.find(item => item.name === itemName);
          
          if (item) {
            updateQuantity(itemName, item.quantity + 1);
            displayCartItems();
          }
        });
      });

      // Add hover effects
      document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("mouseenter", function() {
          this.style.backgroundColor = "#c82333";
        });
        button.addEventListener("mouseleave", function() {
          this.style.backgroundColor = "#dc3545";
        });
      });

      document.querySelectorAll(".quantity-btn").forEach(button => {
        button.addEventListener("mouseenter", function() {
          this.style.backgroundColor = "#e9ecef";
          this.style.borderColor = "#adb5bd";
        });
        button.addEventListener("mouseleave", function() {
          this.style.backgroundColor = "#f8f9fa";
          this.style.borderColor = "#dee2e6";
        });
      });
    }

    // Initial display of cart items
    displayCartItems();

    // Checkout button logic
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
          alert("Your cart is empty. Please add items before checking out.");
          return;
        }
        window.location.href = 'payment.html';
      });
    }

    // Clear cart button (optional - you can add this to your HTML)
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', function() {
        if (confirm("Are you sure you want to clear your entire cart?")) {
          localStorage.removeItem("cart");
          updateCartCount();
          displayCartItems();
          
          // Show feedback
          const feedback = document.createElement("div");
          feedback.textContent = "Cart cleared successfully";
          feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #17a2b8;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          `;
          document.body.appendChild(feedback);
          
          setTimeout(() => {
            feedback.remove();
          }, 3000);
        }
      });
    }
  }
});
