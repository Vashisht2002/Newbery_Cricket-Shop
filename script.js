// Firebase script is now embedded in the HTML with type="module" 
// So we need to handle this differently

// Safely accessing auth from the window object
let auth;
document.addEventListener('DOMContentLoaded', () => {
  // Wait until auth is available on window
  const checkAuth = setInterval(() => {
    if (window.auth) {
      auth = window.auth;
      initApp();
      clearInterval(checkAuth);
    }
  }, 100);
});

function initApp() {
  
  const cartCountElement = document.getElementById("cart-count");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const logoutButton = document.getElementById("logout-btn");
  const signInLink = document.getElementById("signin-link");
  const signUpLink = document.getElementById("signup-link");
  const logoutLink = document.getElementById("logout-link");

  
  let cart = [];

  
  function updateCartCount() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) cartCountElement.textContent = totalItems;
  }

  
  function addToCart(event) {
    const button = event.target;
    const product = button.closest(".product");

    const title = product.querySelector(".product-title").textContent;
    const priceText = product.querySelector(".product-price").textContent;
    const price = parseInt(priceText.replace("₹", "").replace(",", ""));

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ title, price, quantity: 1 });
    }

    updateCartCount(); // Update Navbar
  }

  
  document.querySelectorAll(".btn").forEach(button => {
    if (button.textContent.includes("Add to Cart")) {
      button.addEventListener("click", addToCart);
    }
  });

  
  function signUp(event) {
    event.preventDefault();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!email || !password) {
      alert("❌ Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      alert("⚠️ Password must be at least 6 characters long.");
      return;
    }

    
    import("https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js")
      .then(({ createUserWithEmailAndPassword }) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            alert("🎉 Sign-Up Successful!");
            console.log("User Registered:", userCredential.user);
            window.location.href = "index.html"; // Redirect to home after signup
          })
          .catch((error) => {
            console.error("❌ Sign-Up Error:", error);
            alert("⚠️ " + error.message);
          });
      });
  }

  
  function signIn(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      alert("❌ Please enter both email and password.");
      return;
    }

    
    import("https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js")
      .then(({ signInWithEmailAndPassword }) => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            alert("🎉 Login Successful!");
            console.log("User Logged In:", userCredential.user);
            window.location.href = "index.html"; // Redirect to home after login
          })
          .catch((error) => {
            console.error("❌ Login Error:", error);
            alert("⚠️ " + error.message);
          });
      });
  }

  
  function signOutUser() {
    
    import("https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js")
      .then(({ signOut }) => {
        signOut(auth)
          .then(() => {
            alert("✅ Signed Out Successfully!");
            window.location.href = "index.html"; // Refresh page after logout
          })
          .catch((error) => {
            console.error("❌ Sign-Out Error:", error);
            alert("⚠️ " + error.message);
          });
      });
  }

  
  import("https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js")
    .then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          
          if (signInLink) signInLink.style.display = "none";
          if (signUpLink) signUpLink.style.display = "none";
          if (logoutLink) logoutLink.style.display = "block";
        } else {
          
          if (signInLink) signInLink.style.display = "block";
          if (signUpLink) signUpLink.style.display = "block";
          if (logoutLink) logoutLink.style.display = "none";
        }
      });
    });

  
  if (signupForm) signupForm.addEventListener("submit", signUp);
  if (loginForm) loginForm.addEventListener("submit", signIn);
  if (logoutButton) logoutButton.addEventListener("click", signOutUser);
  if (logoutLink) logoutLink.addEventListener("click", signOutUser);
}
