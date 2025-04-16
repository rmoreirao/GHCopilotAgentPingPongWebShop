/* script.js - Contains logic for Pong game, product listing, search/filter, and cart management */

import { productsData } from './products.js';

// Helper function to escape HTML (security measure)
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showFeedback(message, type = 'info') {
    // Remove any existing feedback elements
    const existingFeedback = document.querySelector('.feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    
    // Add appropriate icon based on message type
    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    if (type === 'error') icon = 'error';
    
    // Create feedback content with icon, message and close button
    feedback.innerHTML = `
        <i class="material-icons">${icon}</i>
        <span class="message">${escapeHtml(message)}</span>
        <button class="close-btn" aria-label="Close notification">
            <i class="material-icons">close</i>
        </button>
    `;
    
    // Add to DOM
    document.body.appendChild(feedback);
    
    // Add close button functionality
    const closeBtn = feedback.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    });
    
    // Show the feedback with animation
    setTimeout(() => feedback.classList.add('show'), 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        if (document.body.contains(feedback)) {
            feedback.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(feedback)) {
                    feedback.remove();
                }
            }, 300);
        }
    }, 5000);
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

    if(document.getElementById('contactForm')) {
        initContactForm();
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

/* ------------------ Enhanced Pong Game ------------------ */
function initPongGame() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    // Create game controls
    createGameControls(canvas);

    // Game settings
    const paddleWidth = 12, paddleHeight = 80;
    const ballSize = 15;
    
    // Game state
    let gameMode = 'player-vs-computer'; // or 'two-players'
    let gameActive = true;
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;
    let winningScore = 5;
    let gameSpeed = 1; // Multiplier for speed
    
    // Paddle positions
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;

    // Ball position and velocity (reduced speed)
    let ballX = canvas.width / 2 - ballSize / 2;
    let ballY = canvas.height / 2 - ballSize / 2;
    let ballSpeedX = 2;
    let ballSpeedY = 1.5;
    
    // Ball trail effect
    let ballTrail = [];
    const maxTrailLength = 10;
    
    // Computer AI difficulty
    const computerDifficulty = 0.7; // Between 0 and 1
    
    // Paddle movement controls
    let upPressed = false;
    let downPressed = false;
    let wPressed = false;
    let sPressed = false;
    
    // Colors
    const colors = {
        background: '#F8F9FA',
        paddle1: '#0077B6',  // Blue
        paddle2: '#2D6A4F',  // Green
        ball: '#FF5733',     // Vibrant orange
        text: '#333333',
        centerLine: '#CCCCCC'
    };
    
    // Add key listeners for paddle movement
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') upPressed = true;
        if (e.key === 'ArrowDown') downPressed = true;
        if (e.key === 'w' || e.key === 'W') wPressed = true;
        if (e.key === 's' || e.key === 'S') sPressed = true;
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.key === 'ArrowUp') upPressed = false;
        if (e.key === 'ArrowDown') downPressed = false;
        if (e.key === 'w' || e.key === 'W') wPressed = false;
        if (e.key === 's' || e.key === 'S') sPressed = false;
    });

    function drawCenterLine() {
        ctx.beginPath();
        ctx.setLineDash([10, 15]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = colors.centerLine;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    function drawScoreboard() {
        ctx.font = '32px Arial';
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        
        // Player 1 score (left side)
        ctx.fillText(scorePlayer1, canvas.width / 4, 50);
        
        // Player 2 score (right side)
        ctx.fillText(scorePlayer2, 3 * canvas.width / 4, 50);
    }
    
    function drawBall() {
        // Draw ball trail
        for (let i = 0; i < ballTrail.length; i++) {
            const opacity = (i / maxTrailLength) * 0.5;
            ctx.beginPath();
            ctx.arc(ballTrail[i].x + ballSize/2, ballTrail[i].y + ballSize/2, 
                   ballSize/2 * (i / maxTrailLength), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 87, 51, ${opacity})`;
            ctx.fill();
        }
        
        // Draw main ball
        ctx.beginPath();
        ctx.arc(ballX + ballSize/2, ballY + ballSize/2, ballSize/2, 0, Math.PI * 2);
        ctx.fillStyle = colors.ball;
        ctx.fill();
        
        // Add ball highlight
        ctx.beginPath();
        ctx.arc(ballX + ballSize/3, ballY + ballSize/3, ballSize/6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    }
    
    function drawPaddles() {
        // Left paddle (Player 1)
        ctx.fillStyle = colors.paddle1;
        ctx.fillRect(10, paddle1Y, paddleWidth, paddleHeight);
        
        // Right paddle (Player 2 or Computer)
        ctx.fillStyle = colors.paddle2;
        ctx.fillRect(canvas.width - paddleWidth - 10, paddle2Y, paddleWidth, paddleHeight);
        
        // Add paddle details
        // Left paddle grip
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(10, paddle1Y + 10, paddleWidth, 10);
        ctx.fillRect(10, paddle1Y + paddleHeight - 20, paddleWidth, 10);
        
        // Right paddle grip
        ctx.fillRect(canvas.width - paddleWidth - 10, paddle2Y + 10, paddleWidth, 10);
        ctx.fillRect(canvas.width - paddleWidth - 10, paddle2Y + paddleHeight - 20, paddleWidth, 10);
    }
    
    function checkPaddleCollision() {
        // Left paddle collision
        if (ballX <= 10 + paddleWidth && 
            ballY + ballSize >= paddle1Y && 
            ballY <= paddle1Y + paddleHeight) {
            
            // Calculate where on the paddle the ball hit (normalized from -1 to 1)
            const hitPosition = (ballY + ballSize/2 - (paddle1Y + paddleHeight/2)) / (paddleHeight/2);
            
            // Change angle based on where the ball hit the paddle
            ballSpeedX = Math.abs(ballSpeedX); // Ensure it's moving right
            ballSpeedY = hitPosition * 4; // More pronounced angle change
            
            // Add some velocity based on game progress
            if (Math.abs(ballSpeedX) < 5) {
                ballSpeedX *= 1.05;
            }
            
            // Position the ball correctly to avoid sticking
            ballX = 10 + paddleWidth;
        }
        
        // Right paddle collision
        if (ballX + ballSize >= canvas.width - paddleWidth - 10 &&
            ballY + ballSize >= paddle2Y && 
            ballY <= paddle2Y + paddleHeight) {
            
            // Calculate where on the paddle the ball hit (normalized from -1 to 1)
            const hitPosition = (ballY + ballSize/2 - (paddle2Y + paddleHeight/2)) / (paddleHeight/2);
            
            // Change angle based on where the ball hit the paddle
            ballSpeedX = -Math.abs(ballSpeedX); // Ensure it's moving left
            ballSpeedY = hitPosition * 4; // More pronounced angle change
            
            // Add some velocity based on game progress
            if (Math.abs(ballSpeedX) < 5) {
                ballSpeedX *= 1.05;
            }
            
            // Position the ball correctly to avoid sticking
            ballX = canvas.width - paddleWidth - 10 - ballSize;
        }
    }
    
    function updateBallPosition() {
        // Add current position to trail
        ballTrail.push({x: ballX, y: ballY});
        if (ballTrail.length > maxTrailLength) {
            ballTrail.shift();
        }
        
        ballX += ballSpeedX * gameSpeed;
        ballY += ballSpeedY * gameSpeed;
        
        // Top and bottom wall collision
        if (ballY <= 0 || ballY + ballSize >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
        
        // Left wall collision (Player 2 scores)
        if (ballX < 0) {
            scorePlayer2++;
            resetBall();
            
            if (scorePlayer2 >= winningScore) {
                gameActive = false;
                showGameOver("Player 2 Wins!");
            }
        }
        
        // Right wall collision (Player 1 scores)
        if (ballX + ballSize > canvas.width) {
            scorePlayer1++;
            resetBall();
            
            if (scorePlayer1 >= winningScore) {
                gameActive = false;
                showGameOver("Player 1 Wins!");
            }
        }
    }
    
    function resetBall() {
        ballX = canvas.width / 2 - ballSize / 2;
        ballY = canvas.height / 2 - ballSize / 2;
        ballTrail = [];
        
        // Randomize the ball direction
        ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 2;
        ballSpeedY = (Math.random() * 2 - 1) * 1.5;
        
        // Reset game speed for new round
        gameSpeed = 1;
    }
    
    function showGameOver(message) {
        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw game over message
        ctx.font = '36px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
        
        // Draw restart instructions
        ctx.font = '24px Arial';
        ctx.fillText('Click anywhere to restart', canvas.width / 2, canvas.height / 2 + 60);
    }
    
    function updatePaddlePositions() {
        // Player 1 controls (Left paddle)
        if (wPressed && paddle1Y > 0) {
            paddle1Y -= 5 * gameSpeed;
        } 
        if (sPressed && paddle1Y < canvas.height - paddleHeight) {
            paddle1Y += 5 * gameSpeed;
        }
        
        // Player 2 or Computer controls (Right paddle)
        if (gameMode === 'two-players') {
            if (upPressed && paddle2Y > 0) {
                paddle2Y -= 5 * gameSpeed;
            } 
            if (downPressed && paddle2Y < canvas.height - paddleHeight) {
                paddle2Y += 5 * gameSpeed;
            }
        } else {
            // Computer AI with some delay and limits
            const paddleCenter = paddle2Y + paddleHeight / 2;
            const ballCenterY = ballY + ballSize / 2;
            
            // Only move if the ball is moving toward the computer's paddle
            if (ballSpeedX > 0) {
                // Calculate ideal paddle position with some difficulty adjustment
                const targetY = ballCenterY - (paddleHeight / 2);
                
                // Add some "thinking" delay and imperfection based on difficulty
                const distanceToMove = (targetY - paddle2Y) * computerDifficulty;
                
                // Limit the maximum speed the AI can move
                const maxSpeed = 4 * gameSpeed;
                const moveAmount = Math.min(maxSpeed, Math.abs(distanceToMove)) * Math.sign(distanceToMove);
                
                // Apply the movement within canvas boundaries
                if ((moveAmount < 0 && paddle2Y > 0) || (moveAmount > 0 && paddle2Y < canvas.height - paddleHeight)) {
                    paddle2Y += moveAmount;
                }
            }
        }
    }
    
    function update() {
        if (!gameActive) return;
        
        updatePaddlePositions();
        updateBallPosition();
        checkPaddleCollision();
        
        // Gradually increase game speed
        gameSpeed += 0.0001;
    }
    
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw game elements
        drawCenterLine();
        drawScoreboard();
        drawPaddles();
        drawBall();
    }
    
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    // Handle restart on click
    canvas.addEventListener('click', function() {
        if (!gameActive) {
            gameActive = true;
            scorePlayer1 = 0;
            scorePlayer2 = 0;
            gameSpeed = 1;
            resetBall();
        }
    });
    
    // Handle game mode toggle
    document.getElementById('gameMode').addEventListener('change', function(e) {
        gameMode = e.target.value;
        resetBall();
        scorePlayer1 = 0;
        scorePlayer2 = 0;
        gameActive = true;
    });
    
    // Start the game
    resetBall();
    gameLoop();
}

function createGameControls(canvas) {
    const container = canvas.parentElement;
    
    // Create game controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.style.marginTop = '15px';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.justifyContent = 'center';
    controlsContainer.style.alignItems = 'center';
    controlsContainer.style.gap = '15px';
    
    // Create game mode selector
    const gameModeLabel = document.createElement('label');
    gameModeLabel.textContent = 'Game Mode: ';
    gameModeLabel.setAttribute('for', 'gameMode');
    
    const gameModeSelect = document.createElement('select');
    gameModeSelect.id = 'gameMode';
    
    const option1 = document.createElement('option');
    option1.value = 'player-vs-computer';
    option1.textContent = 'Player vs Computer';
    
    const option2 = document.createElement('option');
    option2.value = 'two-players';
    option2.textContent = 'Two Players';
    
    gameModeSelect.appendChild(option1);
    gameModeSelect.appendChild(option2);
    
    // Create controls info
    const controlsInfo = document.createElement('div');
    controlsInfo.style.marginTop = '10px';
    controlsInfo.style.fontSize = '14px';
    controlsInfo.innerHTML = '<strong>Controls:</strong> Player 1: W (up), S (down) | Player 2: Arrow Up, Arrow Down';
    
    // Append all elements
    controlsContainer.appendChild(gameModeLabel);
    controlsContainer.appendChild(gameModeSelect);
    
    container.appendChild(controlsContainer);
    container.appendChild(controlsInfo);
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
                <button data-product-id="${product.id}">Add to Cart</button>
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

    // Add event delegation for add to cart buttons
    if(productsContainer) {
        productsContainer.addEventListener('click', e => {
            const button = e.target.closest('button[data-product-id]');
            if (button) {
                const productId = parseInt(button.dataset.productId);
                addToCart(productId);
            }
        });
    }
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
    try {
        // Find the button with this productId
        const button = document.querySelector(`button[data-product-id="${productId}"]`);
        if (button) {
            setLoading(button, true);
        }
        
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
                showFeedback(`Quantity of ${product.name} updated in cart`, 'success');
            } else {
                cart.push({ ...product, quantity: 1 });
                showFeedback(`${product.name} added to cart`, 'success');
            }
            saveCart(cart);
            
            if (button) {
                setLoading(button, false);
            }
        }, 300);
    } catch (error) {
        const button = document.querySelector(`button[data-product-id="${productId}"]`);
        if (button) {
            setLoading(button, false);
        }
        
        showFeedback('Failed to add product to cart', 'error');
        console.error('Cart error:', error);
    }
}

function initCartPage() {
    const cartContainer = document.getElementById('cartContainer');
    const checkoutButton = document.getElementById('checkoutButton');
    let cart = getCart();

    function renderCart() {
        if(!cartContainer) return;
        
        cartContainer.innerHTML = '';
        if(cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>${escapeHtml(item.name)} - $${escapeHtml(item.price.toString())} x ${escapeHtml(item.quantity.toString())}</p>
                <button data-product-id="${item.id}">Remove</button>
            `;
            cartContainer.appendChild(itemDiv);
        });
    }

    if(cartContainer) {
        // Add event delegation for remove buttons
        cartContainer.addEventListener('click', e => {
            const button = e.target.closest('button[data-product-id]');
            if (button) {
                const productId = parseInt(button.dataset.productId);
                removeFromCart(productId);
            }
        });
    }

    if(checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            showFeedback('Payment processed (mocked). Thank you for your purchase!', 'success');
            localStorage.removeItem('cart');
            cart = [];
            renderCart();
        });
    }

    renderCart();
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    const product = cart.find(item => item.id === productId);
    const productName = product ? product.name : 'Item';
    
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    initCartPage();
    showFeedback(`${productName} removed from cart`, 'info');
}

/* ------------------ Contact Form ------------------ */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            setLoading(contactForm, true);
            fetch('https://api.pingpongshop.com/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(() => {
                showFeedback('Thank you for your message. We will get back to you soon!', 'success');
                contactForm.reset();
            })
            .catch(() => {
                showFeedback('Failed to send message. Please try again later.', 'error');
            })
            .finally(() => {
                setLoading(contactForm, false);
            });
        });
    }
}
