// Cart state with timestamp and event handling
let cart = {
    items: {},
    total: 0,
    lastUpdated: null
};

// Custom event for cart updates
const cartUpdateEvent = new CustomEvent('cartUpdate');

// Load cart from localStorage if exists
function loadCart() {
    const savedCart = localStorage.getItem('collegeCanteenCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            // Add lastUpdated if it doesn't exist in saved cart
            if (!cart.lastUpdated) {
                cart.lastUpdated = new Date().toISOString();
            }
            updateCartDisplay();
            updateCartCount();
        } catch (error) {
            console.error('Error loading cart:', error);
            showNotification('Error loading cart. Starting fresh.');
            clearCart();
        }
    }
}

// Save cart to localStorage with timestamp
function saveCart() {
    cart.lastUpdated = new Date().toISOString();
    try {
        localStorage.setItem('collegeCanteenCart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
        showNotification('Error saving cart. Please try again.');
    }
}

// Add item to cart with enhanced animation, feedback, and debug logging
function addToCart(itemId) {
    console.log('Adding item to cart:', itemId);
    console.log('Current cart state:', cart);

    const item = getItemById(itemId);
    console.log('Found item:', item);

    if (!item) {
        console.error('Item not found:', itemId);
        showNotification('Error: Item not found');
        return;
    }

    try {
        // Add or update item in cart
        if (cart.items[itemId]) {
            console.log('Updating existing item quantity');
            cart.items[itemId].quantity++;
        } else {
            console.log('Adding new item to cart');
            cart.items[itemId] = {
                id: itemId,
                name: item.name,
                price: item.price,
                quantity: 1
            };
        }

        // Update cart total
        cart.total = calculateTotal();
        console.log('Updated cart total:', cart.total);
        
        // Update UI
        updateCartDisplay();
        updateCartCount();
        saveCart();
        
        // Show success animation
        const menuItem = document.querySelector(`[data-item-id="${itemId}"]`);
        if (menuItem) {
            console.log('Adding animation to menu item');
            menuItem.classList.add('added-to-cart');
            setTimeout(() => {
                menuItem.classList.remove('added-to-cart');
            }, 500);
        } else {
            console.warn('Menu item element not found for animation');
        }

        // Show cart drawer
        const cartElement = document.getElementById('cart');
        if (cartElement) {
            console.log('Opening cart drawer');
            cartElement.classList.add('open');
        } else {
            console.error('Cart element not found');
        }
        
        // Show success notification
        showNotification(`Added ${item.name} to cart`);
        console.log('Final cart state:', cart);

        // Dispatch cart update event
        document.dispatchEvent(cartUpdateEvent);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        console.error('Error details:', error.message);
        showNotification('Error adding item to cart. Please try again.');
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    if (!cart.items[itemId]) return;
    
    const itemName = cart.items[itemId].name;
    delete cart.items[itemId];
    cart.total = calculateTotal();
    
    updateCartDisplay();
    updateCartCount();
    saveCart();
    
    showNotification(`Removed ${itemName} from cart`);
}

// Update item quantity
function updateQuantity(itemId, delta) {
    if (!cart.items[itemId]) return;
    
    cart.items[itemId].quantity += delta;
    
    if (cart.items[itemId].quantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    cart.total = calculateTotal();
    updateCartDisplay();
    updateCartCount();
    saveCart();
}

// Calculate cart total
function calculateTotal() {
    const total = Object.values(cart.items).reduce(
        (total, item) => total + (item.price * item.quantity),
        0
    );
    return parseFloat(total.toFixed(2)); // Ensure we don't get floating point errors
}

function calculateTotalItems() {
    return Object.values(cart.items).reduce(
        (total, item) => total + item.quantity,
        0
    );
}

// Enhanced cart display update with animations
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    
    if (!cartItems || !cartTotal || !cartCount) return;
    
    cartItems.innerHTML = '';
    
    if (Object.keys(cart.items).length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <p class="empty-cart-message">Add items from the menu to get started</p>
            </div>
        `;
    } else {
        Object.entries(cart.items).forEach(([itemId, item]) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">₹${item.price} x ${item.quantity}</p>
                    <p class="item-total">₹${item.price * item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity('${itemId}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${itemId}', 1)">+</button>
                    <button onclick="removeFromCart('${itemId}')" class="remove-btn" title="Remove item">&times;</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });
    }
    
    // Update totals with animation
    const oldTotal = parseFloat(cartTotal.textContent) || 0;
    const newTotal = cart.total;
    
    if (oldTotal !== newTotal) {
        cartTotal.classList.add('total-update');
        setTimeout(() => cartTotal.classList.remove('total-update'), 300);
    }
    
    cartTotal.textContent = newTotal;
    cartCount.textContent = calculateTotalItems();
    
    // Update order summary if modal is open
    updateOrderSummary();
    
    // Save cart state
    saveCart();
}

// Update cart count in navbar with animation
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const cartBtn = document.getElementById('cartBtn');
    const totalItems = calculateTotalItems();
    
    if (cartCount) {
        // Add animation class
        cartCount.classList.add('count-update');
        cartCount.textContent = totalItems;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            cartCount.classList.remove('count-update');
        }, 300);
    }

    // Update cart button appearance based on items
    if (cartBtn) {
        if (totalItems > 0) {
            cartBtn.classList.add('has-items');
        } else {
            cartBtn.classList.remove('has-items');
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

// Update order summary in modal
function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const orderTotal = document.getElementById('orderTotal');
    
    if (!orderSummary || !orderTotal) return;
    
    orderSummary.innerHTML = '';
    
    Object.values(cart.items).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        `;
        orderSummary.appendChild(itemElement);
    });
    
    orderTotal.textContent = cart.total;
}

// Clear cart
function clearCart() {
    cart = {
        items: {},
        total: 0
    };
    updateCartDisplay();
    updateCartCount();
    saveCart();
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Cart toggle
    const cartBtn = document.getElementById('cartBtn');
    const cart = document.getElementById('cart');
    const closeCart = document.getElementById('closeCart');
    
    cartBtn.addEventListener('click', () => {
        cart.classList.add('open');
    });
    
    closeCart.addEventListener('click', () => {
        cart.classList.remove('open');
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    const orderModal = document.getElementById('orderModal');
    const cancelOrder = document.getElementById('cancelOrder');
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.total === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        updateOrderSummary();
        orderModal.style.display = 'block';
        cart.classList.remove('open');
    });
    
    cancelOrder.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });
    
// Enhanced order form submission with loading state
const orderForm = document.getElementById('orderForm');
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // Disable submit button and show loading state
    const submitBtn = orderForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        const formData = {
            name: document.getElementById('name').value.trim(),
            rollNo: document.getElementById('rollNo').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            items: Object.entries(cart.items).map(([id, item]) => ({
                id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            })),
            total: cart.total,
            orderTime: new Date().toISOString(),
            status: 'pending'
        };

        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store order in localStorage
        const orders = JSON.parse(localStorage.getItem('collegeCanteenOrders') || '[]');
        orders.push(formData);
        localStorage.setItem('collegeCanteenOrders', JSON.stringify(orders));
        
        // Show success message with order details
        showNotification(`Order #${orders.length} placed successfully! Total: ₹${cart.total}`);
        
        // Clear cart and close modal
        clearCart();
        document.getElementById('orderModal').style.display = 'none';
        orderForm.reset();
        
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Error placing order. Please try again.');
    } finally {
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
    });

    // Add animation styles for cart interactions
    const cartAnimationStyles = document.createElement('style');
    cartAnimationStyles.textContent = `
        .added-to-cart {
            animation: addToCartPulse 0.5s ease-out;
        }

        @keyframes addToCartPulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
                box-shadow: var(--shadow-lg);
            }
            100% {
                transform: scale(1);
            }
        }

        .cart-item {
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(cartAnimationStyles);
});