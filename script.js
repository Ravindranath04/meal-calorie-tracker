// Wait for the DOM to be fully loaded
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
        updateThermometer(calories);
    });
    
    increaseGoalBtn.addEventListener('click', () => {
        dailyGoal = Math.min(5000, dailyGoal + 100);
        dailyGoalValue.textContent = dailyGoal;
        updateThermometer(calories);
    });
    
    // Event listeners for portion controls
    increasePortion.addEventListener('click', () => {
        updatePortion(portion + 0.25);
    });
    
    decreasePortion.addEventListener('click', () => {
        updatePortion(portion - 0.25);
    });
    
    // Add meal handler
    addMealBtn.addEventListener('click', () => {
        const mealCalories = Math.round(mealBaseCalories * portion);
        calories = Math.min(calories + mealCalories, dailyGoal);
        
        // Add meal animation
        addMealBtn.classList.add('meal-added');
        setTimeout(() => {
            addMealBtn.classList.remove('meal-added');
        }, 500);
        
        // Update thermometer with animation
        updateThermometer(calories);
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
        { name: 'Grilled Chicken Salad', calories: 320 },
        { name: 'Avocado Toast', calories: 250 },
        { name: 'Protein Smoothie', calories: 180 }
    ];
    
    let currentMealIndex = 0;
    const mealName = document.querySelector('.meal-name');
    
    // Change meal option every 10 seconds for demo purposes
    setInterval(() => {
        currentMealIndex = (currentMealIndex + 1) % meals.length;
        const meal = meals[currentMealIndex];
        
        // Animate transition
        mealName.style.opacity = '0';
        setTimeout(() => {
            mealName.textContent = meal.name;
            mealName.style.opacity = '1';
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
    
    // Initialize
    updateThermometer(0);
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

.meal-added {
    animation: pulse 0.5s ease;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.meal-name, .meal-calories {
    transition: opacity 0.3s ease;
}
</style>
`);