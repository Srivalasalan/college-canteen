// Menu data with food items
const menuData = {
    breakfast: [
        {
            id: 'b1',
            name: 'Masala Dosa',
            price: 40,
            category: 'breakfast',
            image: 'images/food-items/masala-dosa.jpg',
            description: 'Crispy dosa served with potato masala, sambar and chutney'
        },
        {
            id: 'b2',
            name: 'Idli Sambar',
            price: 30,
            category: 'breakfast',
            image: 'images/food-items/idli.jpg',
            description: 'Soft idlis served with sambar and chutney'
        },
        {
            id: 'b3',
            name: 'Poha',
            price: 25,
            category: 'breakfast',
            image: 'images/food-items/poha.jpg',
            description: 'Flattened rice cooked with onions and spices'
        }
    ],
    lunch: [
        {
            id: 'l1',
            name: 'Thali',
            price: 80,
            category: 'lunch',
            image: 'images/food-items/thali.jpg',
            description: 'Complete meal with roti, rice, dal, sabzi, and more'
        },
        {
            id: 'l2',
            name: 'Biryani',
            price: 90,
            category: 'lunch',
            image: 'images/food-items/biryani.jpg',
            description: 'Fragrant rice cooked with spices and vegetables'
        },
        {
            id: 'l3',
            name: 'Chole Bhature',
            price: 60,
            category: 'lunch',
            image: 'images/food-items/chole-bhature.jpg',
            description: 'Spicy chickpea curry served with fried bread'
        }
    ],
    snacks: [
        {
            id: 's1',
            name: 'Samosa',
            price: 15,
            category: 'snacks',
            image: 'images/food-items/samosa.jpg',
            description: 'Crispy pastry filled with spiced potatoes'
        },
        {
            id: 's2',
            name: 'Vada Pav',
            price: 20,
            category: 'snacks',
            image: 'images/food-items/vada-pav.jpg',
            description: 'Spicy potato fritter in a bun with chutneys'
        },
        {
            id: 's3',
            name: 'French Fries',
            price: 40,
            category: 'snacks',
            image: 'images/food-items/french-fries.jpg',
            description: 'Crispy potato fries served with ketchup'
        }
    ],
    beverages: [
        {
            id: 'bv1',
            name: 'Masala Chai',
            price: 15,
            category: 'beverages',
            image: 'images/food-items/masala-chai.jpg',
            description: 'Indian spiced tea with milk'
        },
        {
            id: 'bv2',
            name: 'Coffee',
            price: 20,
            category: 'beverages',
            image: 'images/food-items/coffee.jpg',
            description: 'Fresh brewed coffee with milk'
        },
        {
            id: 'bv3',
            name: 'Lassi',
            price: 30,
            category: 'beverages',
            image: 'images/food-items/lassi.jpg',
            description: 'Sweet yogurt-based drink'
        }
    ]
};

// Function to display menu items with enhanced UI and error handling
function displayMenuItems(category = 'all') {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) {
        console.error('Menu container not found');
        return;
    }

    menuContainer.innerHTML = '';

    try {
        let items = [];
        if (category === 'all') {
            Object.values(menuData).forEach(categoryItems => {
                items = [...items, ...categoryItems];
            });
        } else {
            items = menuData[category] || [];
        }

        if (items.length === 0) {
            menuContainer.innerHTML = `
                <div class="no-items-message">
                    <p>No items available in this category</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.itemId = item.id;
            menuItem.dataset.category = item.category;

            
            menuItem.innerHTML = `
                <div class="menu-item-image">
                    <img src="images/food-items/default.jpg" alt="${item.name}">
                    ${item.isVeg ? '<span class="veg-badge">🌱</span>' : ''}
                </div>
                <div class="menu-item-content">
                    <h3 class="menu-item-title">${item.name}</h3>
                    <p class="menu-item-description">${item.description}</p>
                    <div class="menu-item-footer">
                        <p class="menu-item-price">₹${item.price}</p>
                        <button class="add-to-cart-btn" data-item-id="${item.id}">
                            <span class="btn-text">Add to Cart</span>
                            <span class="btn-icon">+</span>
                        </button>
                    </div>
                </div>
            `;

            // Add hover effect listeners
            menuItem.addEventListener('mouseenter', () => {
                menuItem.classList.add('menu-item-hover');
            });
            menuItem.addEventListener('mouseleave', () => {
                menuItem.classList.remove('menu-item-hover');
            });

            fragment.appendChild(menuItem);
        });

        menuContainer.appendChild(fragment);

    } catch (error) {
        console.error('Error displaying menu items:', error);
        menuContainer.innerHTML = `
            <div class="error-message">
                <p>Error loading menu items. Please try again.</p>
            </div>
        `;
    }
}

// Enhanced function to get item by ID with error handling
window.getItemById = function(id) {
    try {
        let foundItem = null;
        for (const category of Object.values(menuData)) {
            foundItem = category.find(item => item.id === id);
            if (foundItem) break;
        }
        console.log('getItemById found item:', foundItem);
        return foundItem;
    } catch (error) {
        console.error('Error finding item:', error);
        return null;
    }
};

// Function to filter menu items with animation
function filterMenuItems(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Add fade-out animation to current items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.add('fade-out');
    });

    // Wait for fade-out animation to complete
    setTimeout(() => {
        displayMenuItems(category);
        // Add fade-in animation to new items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.add('fade-in');
        });
    }, 300);
}

// Initialize menu display with enhanced functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    const menuAnimationStyles = document.createElement('style');
    menuAnimationStyles.textContent = `
        .menu-item {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .menu-item-hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }

        .fade-out {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .fade-in {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .veg-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            border-radius: 50%;
            padding: 4px;
            box-shadow: var(--shadow-sm);
        }

        .menu-item-image {
            position: relative;
            overflow: hidden;
        }

        .menu-item-image img {
            transition: transform 0.3s ease;
        }

        .menu-item:hover .menu-item-image img {
            transform: scale(1.1);
        }

        .menu-item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
        }

        .add-to-cart-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-icon {
            font-size: 1.2em;
            font-weight: bold;
        }
    `;
    document.head.appendChild(menuAnimationStyles);

    // Initialize menu and add event listeners
    displayMenuItems();

    // Add event listeners to filter buttons with error handling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            try {
                filterMenuItems(button.dataset.category);
            } catch (error) {
                console.error('Error filtering menu items:', error);
                showNotification('Error filtering menu items. Please try again.');
            }
        });
    });

    // Add event delegation for add to cart buttons with debug logging
    document.querySelector('.menu-items').addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        if (addToCartBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const itemId = addToCartBtn.dataset.itemId;
            console.log('Clicked add to cart button for item:', itemId);
            
            if (itemId) {
                try {
                    const item = getItemById(itemId);
                    console.log('Found item:', item);
                    
                    if (item) {
                        addToCart(itemId);
                        // Add visual feedback
                        addToCartBtn.classList.add('adding');
                        setTimeout(() => {
                            addToCartBtn.classList.remove('adding');
                        }, 500);
                    } else {
                        console.error('Item not found for ID:', itemId);
                        showNotification('Error: Item not found');
                    }
                } catch (error) {
                    console.error('Error adding item to cart:', error);
                    showNotification('Error adding item to cart. Please try again.');
                }
            } else {
                console.error('No item ID found on button');
            }
        }
    });

    // Add lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.menu-item img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
