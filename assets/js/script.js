/* script.js - Contains logic for Pong game, product listing, search/filter, and cart management */

// Product data
const productsData = [
    { id: 1, name: "Tensor X1", category: "rubbers", price: 69.99, icon: "sports_tennis", image: "../assets/img/products/rubber_tensor_x1.png" },
    { id: 2, name: "Pro Carbon", category: "blades", price: 199.99, icon: "dashboard", image: "../assets/img/products/blade_pro_carbon.png" },
    { id: 3, name: "Premium Rubber Sheet", category: "rubbers", price: 79.99, icon: "sports_tennis", image: "../assets/img/products/category_rubbers.png" },
    { id: 4, name: "Professional Blade", category: "blades", price: 189.99, icon: "dashboard", image: "../assets/img/products/category_blades.png" },
    { id: 5, name: "Table Tennis Shoes", category: "shoes", price: 89.99, icon: "directions_walk", image: "../assets/img/products/category_shoes.png" },
    { id: 6, name: "Competition Balls", category: "balls", price: 19.99, icon: "circle", image: "../assets/img/products/category_balls.png" },
    { id: 7, name: "Complete Racket Pro", category: "rackets", price: 129.99, icon: "sports_tennis", image: "../assets/img/products/category_complete_rackets.png" }
];

// Helper function to escape HTML (security measure)
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showFeedback(message, type) {
    alert(message); // Simple feedback for now
}

// Keyboard navigation for dropdown menu
document.addEventListener('DOMContentLoaded', function() {
    // Detect which page we are in
    if(document.getElementById('pongCanvas')) {
        initPongGame();
    }

    if(document.getElementById('productsContainer')) {
        initProductsPage();
    }

    if(document.getElementById('cartContainer')) {
        initCartPage();
    }

    // Add keyboard navigation
    const dropdownButtons = document.querySelectorAll('.dropdown > a');
    dropdownButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                const dropdownContent = this.nextElementSibling;
                dropdownContent.style.display = 'block';
                this.setAttribute('aria-expanded', 'true');
                const firstMenuItem = dropdownContent.querySelector('a');
                if (firstMenuItem) firstMenuItem.focus();
            }
        });
    });

    // Handle keyboard navigation within dropdown
    document.querySelectorAll('.dropdown-content a').forEach(item => {
        item.addEventListener('keydown', function(e) {
            const parentUl = this.closest('ul');
            const items = Array.from(parentUl.querySelectorAll('a'));
            const index = items.indexOf(this);
            const dropdownTrigger = parentUl.previousElementSibling;

            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (items[index + 1]) items[index + 1].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (items[index - 1]) items[index - 1].focus();
                    else dropdownTrigger.focus();
                    break;
                case 'Escape':
                    e.preventDefault();
                    dropdownTrigger.focus();
                    parentUl.style.display = 'none';
                    dropdownTrigger.setAttribute('aria-expanded', 'false');
                    break;
            }
        });
    });

    // Close dropdown when focus leaves
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('focusout', function(e) {
            if (!this.contains(e.relatedTarget)) {
                const dropdownContent = this.querySelector('.dropdown-content');
                const dropdownTrigger = this.querySelector('a');
                dropdownContent.style.display = 'none';
                dropdownTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    });
});

/* ------------------ Pong Game ------------------ */
function initPongGame() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    // Game settings
    const paddleWidth = 10, paddleHeight = 80;
    const ballSize = 10;

    // Paddle positions
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;

    // Ball position and velocity
    let ballX = canvas.width / 2 - ballSize / 2;
    let ballY = canvas.height / 2 - ballSize / 2;
    let ballSpeedX = 3;
    let ballSpeedY = 2;

    // Draw functions
    function drawPaddles() {
        ctx.fillStyle = '#0077B6';
        ctx.fillRect(10, paddle1Y, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - 20, paddle2Y, paddleWidth, paddleHeight);
    }

    function drawBall() {
        ctx.fillStyle = '#2D6A4F';
        ctx.fillRect(ballX, ballY, ballSize, ballSize);
    }

    function update() {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Bounce off top and bottom
        if(ballY <= 0 || ballY + ballSize >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        // Bounce off paddles
        // Left paddle
        if(ballX <= 20 && ballY + ballSize >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballX = 20; // reposition ball
        }
        // Right paddle
        if(ballX + ballSize >= canvas.width - 20 && ballY + ballSize >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballX = canvas.width - 20 - ballSize;
        }

        // Reset if ball goes out (simulate score reset)
        if(ballX < 0 || ballX > canvas.width) {
            ballX = canvas.width / 2 - ballSize / 2;
            ballY = canvas.height / 2 - ballSize / 2;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddles();
        drawBall();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Listen for keydown events to move both paddles
    document.addEventListener('keydown', function(e) {
        if(e.key === 'ArrowUp') {
            paddle1Y = Math.max(paddle1Y - 20, 0);
            paddle2Y = Math.max(paddle2Y - 20, 0);
        } else if(e.key === 'ArrowDown') {
            paddle1Y = Math.min(paddle1Y + 20, canvas.height - paddleHeight);
            paddle2Y = Math.min(paddle2Y + 20, canvas.height - paddleHeight);
        }
    });

    gameLoop();
}

/* ------------------ Product Data and Listing ------------------ */

// Loading state management
function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');
    } else {
        element.classList.remove('loading');
        element.setAttribute('aria-busy', 'false');
    }
}

function initProductsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('cat') || 'all';
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    // If category is 'all', show category filter
    if(categoryParam === 'all') {
        categoryFilter.style.display = 'inline-block';
    }

    let filteredProducts = productsData.filter(product => {
        return categoryParam === 'all' ? true : product.category === categoryParam;
    });

    function renderProducts(productsList) {
        productsContainer.innerHTML = '';
        if(productsList.length === 0) {
            productsContainer.innerHTML = '<p>No products found.</p>';
            return;
        }
        productsList.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                ${product.image ? 
                    `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="product-image">` :
                    `<span class="material-icons">${escapeHtml(product.icon)}</span>`
                }
                <h3>${escapeHtml(product.name)}</h3>
                <p>Price: $${escapeHtml(product.price.toString())}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productsContainer.appendChild(card);
        });
    }

    renderProducts(filteredProducts);

    // Search functionality with loading state
    searchInput.addEventListener('input', function() {
        try {
            setLoading(productsContainer, true);
            const searchTerm = searchInput.value.toLowerCase();
            
            // Simulate network delay for demo purposes
            setTimeout(() => {
                const searchedProducts = filteredProducts.filter(product => 
                    product.name.toLowerCase().includes(searchTerm)
                );
                renderProducts(searchedProducts);
                setLoading(productsContainer, false);
                if (searchedProducts.length === 0) {
                    showFeedback('No products found matching your search', 'info');
                }
            }, 300);
        } catch (error) {
            setLoading(productsContainer, false);
            showFeedback('Search failed. Please try again.', 'error');
            console.error('Search error:', error);
        }
    });

    // Category filter functionality on All Products page
    categoryFilter.addEventListener('change', function() {
        setLoading(productsContainer, true);
        const selectedCategory = categoryFilter.value;
        
        // Simulate network delay
        setTimeout(() => {
            filteredProducts = productsData.filter(product => {
                return selectedCategory === 'all' ? true : product.category === selectedCategory;
            });
            renderProducts(filteredProducts);
            setLoading(productsContainer, false);
        }, 300);
    });
}

/* ------------------ Cart Management ------------------ */
// Helper: Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Helper: Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId) {
    const button = document.querySelector(`button[onclick="addToCart(${productId})"]`);
    try {
        setLoading(button, true);
        const product = productsData.find(p => p.id === productId);
        if (!product) {
            throw new Error('Product not found');
        }

        // Simulate network delay
        setTimeout(() => {
            let cart = getCart();
            const existingItem = cart.find(item => item.id === productId);
            if(existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart(cart);
            setLoading(button, false);
            showFeedback(`${product.name} added to cart`, 'success');
        }, 300);
    } catch (error) {
        setLoading(button, false);
        showFeedback('Failed to add product to cart', 'error');
        console.error('Cart error:', error);
    }
}

function initCartPage() {
    const cartContainer = document.getElementById('cartContainer');
    const checkoutButton = document.getElementById('checkoutButton');
    let cart = getCart();

    function renderCart() {
        cartContainer.innerHTML = '';
        if(cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `<p>${escapeHtml(item.name)} - $${escapeHtml(item.price.toString())} x ${escapeHtml(item.quantity.toString())}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>`;
            cartContainer.appendChild(itemDiv);
        });
    }

    checkoutButton.addEventListener('click', function() {
        alert('Payment processed (mocked). Thank you for your purchase!');
        localStorage.removeItem('cart');
        cart = [];
        renderCart();
    });

    renderCart();
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    initCartPage();
    alert('Item removed from cart.');
}
