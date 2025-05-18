document.addEventListener('DOMContentLoaded', function() {
    // ===== Page Elements =====
    const landingPage = document.getElementById('landing-page');
    const calorieTracker = document.getElementById('calorie-tracker');
    const getStartedBtn = document.getElementById('get-started-btn');
    const backToLandingBtn = document.getElementById('back-to-landing');
    const calorieCounter = document.getElementById('calorie-counter');
    const calorieCount = document.getElementById('calorie-count');
    
    // Calorie Tracker Elements
    const decreaseGoalBtn = document.getElementById('decrease-goal');
    const increaseGoalBtn = document.getElementById('increase-goal');
    const dailyGoalValue = document.getElementById('daily-goal-value');
    const thermometerFill = document.getElementById('thermometer-fill');
    const caloriesConsumed = document.getElementById('calories-consumed');
    const percentageGoal = document.getElementById('percentage-goal');
    const caloriesRemaining = document.getElementById('calories-remaining');
    const increasePortion = document.getElementById('increase-portion');
    const decreasePortion = document.getElementById('decrease-portion');
    const portionValue = document.getElementById('portion-value');
    const mealCalories = document.getElementById('meal-calories');
    const addMealBtn = document.getElementById('add-meal-btn');
    
    // NEW: Meal Log elements
    const mealLog = document.getElementById('meal-log');
    const summaryCalories = document.getElementById('summary-calories');
    const summaryCarbs = document.getElementById('summary-carbs');
    const summaryProtein = document.getElementById('summary-protein');
    const nutritionCards = document.getElementById('nutrition-cards');
    
    // Get meal emoji container and create a span element if it doesn't exist
    const mealImageContainer = document.querySelector('.meal-image-container');
    let mealEmoji;
    
    if (!document.getElementById('meal-emoji')) {
        mealEmoji = document.createElement('span');
        mealEmoji.id = 'meal-emoji';
        mealEmoji.className = 'meal-emoji';
        mealEmoji.textContent = '🥗'; // Default emoji
        
        // Add the emoji span to the container
        if (mealImageContainer) {
            // Remove any existing icon placeholder if it exists
            const iconPlaceholder = mealImageContainer.querySelector('.food-icon-placeholder');
            if (iconPlaceholder) {
                iconPlaceholder.remove();
            }
            
            mealImageContainer.appendChild(mealEmoji);
        }
    } else {
        mealEmoji = document.getElementById('meal-emoji');
    }
    
    // ===== Animation Setup =====
    // Animated entrance for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        const delay = parseFloat(card.getAttribute('data-delay'));
        setTimeout(() => {
            card.style.animation = `fadeIn 1s ease forwards`;
            card.style.opacity = '1';
        }, delay * 1000);
    });
    
    // ===== Event Handlers =====
    // Handle calorie counter animation on button hover
    getStartedBtn.addEventListener('mouseenter', () => {
        calorieCounter.style.opacity = '1';
        calorieCounter.style.transform = 'translateX(-50%) scale(1)';
        
        // Animate counting up
        let count = 0;
        const interval = setInterval(() => {
            count += 50;
            if (count >= 2000) {
                count = 2000;
                clearInterval(interval);
            }
            calorieCount.textContent = count;
        }, 50);
    });
    
    getStartedBtn.addEventListener('mouseleave', () => {
        calorieCounter.style.opacity = '0';
        calorieCounter.style.transform = 'translateX(-50%) scale(0.95)';
        calorieCount.textContent = '0';
    });
    
    // Switch between landing page and calorie tracker
    getStartedBtn.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        calorieTracker.classList.remove('hidden');
        
        // Animate thermometer on page load
        setTimeout(() => {
            updateThermometer(0);
        }, 300);
        
        // NEW: Create nutrition cards when the tracker page loads
        createNutritionCards();
    });
    
    backToLandingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        calorieTracker.classList.add('hidden');
        landingPage.classList.remove('hidden');
    });
    
    // ===== Calorie Tracker Functionality =====
    let calories = 0;
    let dailyGoal = 2000;
    let portion = 1;
    const mealBaseCalories = 320;
    
    // NEW: Tracking daily totals
    let dailyTotals = {
        calories: 0,
        carbs: 0,
        protein: 0
    };
    
    // NEW: Meal log array
    let mealsLogged = [];
    
    // Update thermometer and related displays
    function updateThermometer(value) {
        const percentage = Math.min((value / dailyGoal) * 100, 100);
        
        // Animate thermometer fill
        thermometerFill.style.height = `${percentage}%`;
        
        // Update color based on percentage
        if (percentage < 50) {
            thermometerFill.className = 'thermometer-fill green-bg';
        } else if (percentage < 80) {
            thermometerFill.className = 'thermometer-fill yellow-bg';
        } else {
            thermometerFill.className = 'thermometer-fill red-bg';
        }
        
        // Update calorie stats
        caloriesConsumed.textContent = value;
        percentageGoal.textContent = `${percentage.toFixed(1)}% of daily goal`;
        caloriesRemaining.textContent = `${dailyGoal - value} calories remaining`;
        
        // Highlight if over limit
        if (percentage >= 100) {
            percentageGoal.classList.add('danger');
        } else {
            percentageGoal.classList.remove('danger');
        }
    }
    
    // Update portion and calorie display
    function updatePortion(value) {
        portion = Math.max(0.25, Math.min(3, value));
        portionValue.textContent = portion.toFixed(2).replace(/\.?0+$/, ''); // Remove trailing zeros
        const calculatedCalories = Math.round(mealBaseCalories * portion);
        mealCalories.textContent = `${calculatedCalories} calories`;
    }
    
    // Event listeners for daily goal controls
    decreaseGoalBtn.addEventListener('click', () => {
        dailyGoal = Math.max(1000, dailyGoal - 100);
        dailyGoalValue.textContent = dailyGoal;
        updateThermometer(dailyTotals.calories);
    });
    
    increaseGoalBtn.addEventListener('click', () => {
        dailyGoal = Math.min(5000, dailyGoal + 100);
        dailyGoalValue.textContent = dailyGoal;
        updateThermometer(dailyTotals.calories);
    });
    
    // Event listeners for portion controls
    increasePortion.addEventListener('click', () => {
        updatePortion(portion + 0.25);
    });
    
    decreasePortion.addEventListener('click', () => {
        updatePortion(portion - 0.25);
    });
    
    // NEW: Update meal log display
    function updateMealLog() {
        // Clear current log
        mealLog.innerHTML = '';
        
        if (mealsLogged.length === 0) {
            mealLog.innerHTML = '<li class="empty-log">No meals logged today</li>';
            return;
        }
        
        // Add each meal to the log
        mealsLogged.forEach((meal, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="meal-log-emoji">
                    <span class="food-emoji">${meal.emoji}</span>
                </div>
                <div class="meal-log-info">
                    <div class="meal-log-name">${meal.name}</div>
                    <div class="meal-log-details">
                        ${meal.calories} cal • ${meal.carbs}g carbs • ${meal.protein}g protein
                    </div>
                </div>
                <div class="meal-log-time">${meal.time}</div>
                <button class="remove-meal-btn" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            mealLog.appendChild(li);
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-meal-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeMeal(index);
            });
        });
        
        // Update daily summary totals
        summaryCalories.textContent = dailyTotals.calories;
        summaryCarbs.textContent = `${dailyTotals.carbs}g`;
        summaryProtein.textContent = `${dailyTotals.protein}g`;
    }
    
    // NEW: Remove a meal from the log
    function removeMeal(index) {
        const meal = mealsLogged[index];
        
        // Update daily totals
        dailyTotals.calories -= meal.calories;
        dailyTotals.carbs -= meal.carbs;
        dailyTotals.protein -= meal.protein;
        
        // Remove from array
        mealsLogged.splice(index, 1);
        
        // Update displays
        updateMealLog();
        updateThermometer(dailyTotals.calories);
    }
    
    // Add meal handler
    addMealBtn.addEventListener('click', () => {
        const mealCaloriesValue = Math.round(mealBaseCalories * portion);
        const currentMeal = meals[currentMealIndex];
        
        // Add meal to log
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
        
        const mealEntry = {
            name: currentMeal.name,
            emoji: currentMeal.emoji,
            portions: portion,
            calories: mealCaloriesValue,
            carbs: Math.round(currentMeal.carbs * portion),
            protein: Math.round(currentMeal.protein * portion),
            time: timeStr
        };
        
        mealsLogged.push(mealEntry);
        
        // Update daily totals
        dailyTotals.calories += mealEntry.calories;
        dailyTotals.carbs += mealEntry.carbs;
        dailyTotals.protein += mealEntry.protein;
        
        // Add meal animation
        addMealBtn.classList.add('meal-added');
        setTimeout(() => {
            addMealBtn.classList.remove('meal-added');
        }, 500);
        
        // Update displays
        updateMealLog();
        updateThermometer(dailyTotals.calories);
        
        // Reset portion to 1
        updatePortion(1);
    });
    
    // Enhance floating foods with parallax effect on scroll
    const floatingFoods = document.querySelectorAll('.floating-food');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        floatingFoods.forEach((food, index) => {
            const speed = (index + 1) * 0.05;
            food.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    // Add hover effects for portion controls
    const portionDisplay = document.querySelector('.portion-display');
    portionDisplay.addEventListener('mouseenter', () => {
        document.querySelector('.portion-buttons').style.opacity = '1';
    });
    
    portionDisplay.addEventListener('mouseleave', () => {
        document.querySelector('.portion-buttons').style.opacity = '0';
    });
    
    // Add additional meals options (dynamically changing the current meal)
    const meals = [
        { 
            name: 'Grilled Chicken Salad', 
            calories: 320,
            carbs: 12,
            protein: 28,
            emoji: '🥗',
            details: 'High in protein, low in carbs, packed with vitamins.'
        },
        { 
            name: 'Avocado Toast', 
            calories: 250,
            carbs: 28,
            protein: 8,
            emoji: '🥑',
            details: 'Healthy fats from avocado with whole grain carbs.'
        },
        { 
            name: 'Protein Smoothie', 
            calories: 180,
            carbs: 15,
            protein: 25,
            emoji: '🥤',
            details: 'Perfect post-workout recovery drink with fruits and protein.'
        },
        { 
            name: 'Greek Yogurt Bowl', 
            calories: 210,
            carbs: 20,
            protein: 18,
            emoji: '🥣',
            details: 'Probiotic-rich yogurt with berries and honey.'
        },
        { 
            name: 'Quinoa Salad', 
            calories: 280,
            carbs: 35,
            protein: 12,
            emoji: '🌱',
            details: 'Complete protein source with fiber-rich vegetables.'
        }
    ];
    
    let currentMealIndex = 0;
    const mealName = document.querySelector('.meal-name');
    
    // Change meal option every 10 seconds for demo purposes
    setInterval(() => {
        currentMealIndex = (currentMealIndex + 1) % meals.length;
        const meal = meals[currentMealIndex];
        
        // Animate transition
        mealName.style.opacity = '0';
        
        // Check if mealEmoji exists before trying to update it
        if (mealEmoji) {
            mealEmoji.style.opacity = '0';
        }
        
        setTimeout(() => {
            mealName.textContent = meal.name;
            mealName.style.opacity = '1';
            
            if (mealEmoji) {
                mealEmoji.textContent = meal.emoji;
                mealEmoji.style.opacity = '1';
            }
        }, 300);
        
        // Update base calories and recalculate
        const newBaseCalories = meal.calories;
        const calculatedCalories = Math.round(newBaseCalories * portion);
        
        mealCalories.style.opacity = '0';
        setTimeout(() => {
            mealCalories.textContent = `${calculatedCalories} calories`;
            mealCalories.style.opacity = '1';
        }, 300);
    }, 10000);
    
    // NEW: Nutrition Information Cards
    const nutritionInfo = [
        {
            title: 'Protein-Rich Foods',
            icon: 'fa-drumstick-bite',
            emoji: '🍗',
            color: 'red-bg',
            content: 'Chicken breast, eggs, tofu, greek yogurt, and fish are excellent sources of lean protein that help build and repair muscles.'
        },
        {
            title: 'Complex Carbs',
            icon: 'fa-bread-slice',
            emoji: '🍞',
            color: 'green-bg',
            content: 'Sweet potatoes, brown rice, quinoa, and oats provide sustained energy and are rich in fiber and essential nutrients.'
        },
        {
            title: 'Healthy Fats',
            icon: 'fa-cheese',
            emoji: '🥑',
            color: 'yellow-bg',
            content: 'Avocados, nuts, olive oil, and fatty fish contain omega-3s and monounsaturated fats that support brain health and reduce inflammation.'
        },
        {
            title: 'Hydration',
            icon: 'fa-tint',
            emoji: '💧',
            color: 'blue-bg',
            content: 'Drinking enough water is crucial for metabolism, nutrient transport, and overall health. Aim for 8 glasses daily.'
        }
    ];
    
    function createNutritionCards() {
        nutritionCards.innerHTML = '';
        
        nutritionInfo.forEach((info, index) => {
            const card = document.createElement('div');
            card.className = 'nutrition-card';
            card.style.animationDelay = `${index * 0.2}s`;
            
            card.innerHTML = `
                <div class="nutrition-card-inner">
                    <div class="nutrition-card-front ${info.color}">
                        <span class="nutrition-emoji">${info.emoji}</span>
                        <h3>${info.title}</h3>
                    </div>
                    <div class="nutrition-card-back">
                        <p>${info.content}</p>
                    </div>
                </div>
            `;
            
            nutritionCards.appendChild(card);
        });
    }
    
    // Initialize
    updateThermometer(0);
    updateMealLog();
});

// Add CSS classes for additional animations
document.head.insertAdjacentHTML('beforeend', `
<style>
.yellow-bg {
    background-color: #fbbf24;
}

.red-bg {
    background-color: #ef4444;
}

.green-bg {
    background-color: #10b981;
}

.blue-bg {
    background-color: #3b82f6;
}

.meal-added {
    animation: pulse 0.5s ease;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.meal-name, .meal-calories, .meal-emoji {
    transition: opacity 0.3s ease;
}

/* NEW: Additional animations */
.meal-log li {
    animation: slideInRight 0.5s ease forwards;
}

@keyframes slideInRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.nutrition-card {
    opacity: 0;
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* Emoji styles */
.meal-emoji {
    font-size: 3rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.meal-image-container {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.meal-image-container:hover {
    transform: scale(1.05);
}

.meal-log-emoji {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
}

.food-emoji {
    font-size: 1.5rem;
}

.nutrition-emoji {
    font-size: 2rem;
    display: block;
    margin-bottom: 8px;
}

/* Override/remove old image styles */
.food-icon-placeholder {
    display: none;
}
</style>
`);