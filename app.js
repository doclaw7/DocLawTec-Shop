// app.js

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const searchInput = document.getElementById("search");
    const cartPage = document.getElementById("cart-page");
    const categoryCards = document.querySelectorAll(".category-card");
    const sideNav = document.querySelector('.side-nav');
    const cartPopup = document.querySelector('.cart-popup');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Add mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    document.querySelector('header .container').prepend(menuToggle);

    menuToggle.addEventListener('click', () => {
        sideNav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sideNav.contains(e.target) && !menuToggle.contains(e.target)) {
            sideNav.classList.remove('active');
        }
    });

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let filteredProducts = [...products];
  
    function updateCartCount() {
      cartCount.textContent = cart.length;
    }
  
    function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  
    function formatPrice(price) {
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES'
      }).format(price);
    }
  
    function renderProducts(productsToRender = filteredProducts) {
      productList.innerHTML = "";
      productsToRender.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product";
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${formatPrice(product.price)}</p>
          <p class="description">${product.description}</p>
          <button data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productCard);
      });
    }
  
    function renderCart() {
      if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
            <p>Your cart is empty</p>
          </div>
        `;
        cartTotalAmount.textContent = 'KES 0.00';
        return;
      }

      let total = 0;
      cartItems.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
          <div class="cart-item">
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
          </div>
        `;
      }).join('');

      cartTotalAmount.textContent = formatPrice(total);
    }
  
    function filterProducts(query) {
      query = query.toLowerCase();
      filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      renderProducts();
    }
  
    function filterByCategory(category) {
      filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
      renderProducts();
    }
  
    document.getElementById("product-list").addEventListener("click", e => {
      if (e.target.tagName === "BUTTON") {
        const id = parseInt(e.target.getAttribute("data-id"));
        const product = products.find(p => p.id === id);
        cart.push(product);
        saveCart();
        updateCartCount();
        
        // Show notification
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = `${product.name} added to cart`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 2000);
      }
    });
  
    // Toggle cart popup
    document.getElementById("cart-icon").addEventListener("click", () => {
      cartPopup.classList.add('active');
      cartOverlay.classList.add('active');
      renderCart();
    });

    // Close cart when clicking the close button
    closeCart.addEventListener('click', () => {
      cartPopup.classList.remove('active');
      cartOverlay.classList.remove('active');
    });

    // Close cart when clicking the overlay
    cartOverlay.addEventListener('click', () => {
      cartPopup.classList.remove('active');
      cartOverlay.classList.remove('active');
    });

    // Handle remove item from cart
    cartItems.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        const index = parseInt(e.target.dataset.index);
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCart();
      }
    });

    // Handle checkout
    checkoutBtn.addEventListener('click', () => {
      if (cart.length > 0) {
        alert("Thank you for your purchase! Continue shopping with 'DoclawTec' enterprises for more eye-catching tech!");
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
        cartPopup.classList.remove('active');
        cartOverlay.classList.remove('active');
      }
    });

    // Close cart on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cartPopup.classList.contains('active')) {
        cartPopup.classList.remove('active');
        cartOverlay.classList.remove('active');
      }
    });
  
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterProducts(searchTerm);
    });
  
    // Add click event listeners to category cards
    categoryCards.forEach(card => {
      card.addEventListener("click", () => {
        const category = card.querySelector("h3").textContent.toLowerCase();
        filterByCategory(category);
        
        // Scroll to product list
        productList.scrollIntoView({ behavior: "smooth" });
      });
    });
  
    updateCartCount();
    renderProducts();
  
    // Add notification styles
    const style = document.createElement("style");
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        animation: slideIn 0.5s ease-out;
        z-index: 1000;
      }
  
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 5;
        }
      }
  
      .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
      }
  
      .cart-item-details {
        display: flex;
        justify-content: space-between;
        width: 80%;
      }
  
      .remove-item {
        background-color: #ff4444;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
      }
  
      .cart-total-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
  
      #checkout-btn {
        width: 100%;
        padding: 10px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }
  
      #checkout-btn:hover {
        background-color: #e67e00;
      }
  
      .description {
        color: #666;
        font-size: 14px;
        margin: 10px 0;
        min-height: 40px;
      }
    `;
    document.head.appendChild(style);
  
    // Contact Form Handling
    const contactForm = document.getElementById("contact-form");

    // Handle form submission
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert("Thank you for your message! We'll get back to you soon.");
        
        // Reset form
        contactForm.reset();
    });

    // Tab Navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.side-nav a');

    // Hide all sections except home initially
    sections.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('tab-content');
        }
    });

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id !== 'home') {
                    section.classList.add('tab-content');
                }
            });

            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.classList.remove('tab-content');
                
                // Close mobile menu after navigation
                if (window.innerWidth <= 768) {
                    sideNav.classList.remove('active');
                }
                
                // Smooth scroll to section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Update active state in navigation
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            link.parentElement.classList.add('active');
        });
    });

    // Add animation to products when they appear
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product').forEach(product => {
        observer.observe(product);
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                sideNav.classList.remove('active');
            }
        }, 250);
    });
});
  