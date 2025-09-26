// FitCoin / Bharat Points System
// Gamified fitness economy for SpotnPlay

class FitCoinSystem {
    constructor() {
        this.points = 0;
        this.level = 1;
        this.totalActivities = 0;
        this.streak = 0;
        this.lastActivityDate = null;
        this.transactionHistory = [];
        this.achievements = [];
        
        // Points multipliers for different activities
        this.activityMultipliers = {
            'workout': 10,
            'cardio': 15,
            'strength': 12,
            'yoga': 8,
            'sports': 20,
            'challenge': 25,
            'team_activity': 30,
            'daily_goal': 50,
            'weekly_goal': 100,
            'streak_bonus': 5,
            'first_activity': 100,
            'social_share': 5,
            'referral': 200
        };
        
        // Swadeshi products marketplace
        this.marketplace = [
            {
                id: 1,
                name: "Organic Protein Powder",
                brand: "Swadeshi Nutrition",
                points: 500,
                discount: "20%",
                originalPrice: 1200,
                category: "nutrition"
            },
            {
                id: 2,
                name: "Ayurvedic Energy Drink",
                brand: "Desi Wellness",
                points: 300,
                discount: "15%",
                originalPrice: 150,
                category: "beverages"
            },
            {
                id: 3,
                name: "Handcrafted Yoga Mat",
                brand: "Indian Crafts Co.",
                points: 800,
                discount: "25%",
                originalPrice: 2000,
                category: "equipment"
            },
            {
                id: 4,
                name: "Traditional Sports Shoes",
                brand: "Bharat Footwear",
                points: 1200,
                discount: "30%",
                originalPrice: 3000,
                category: "footwear"
            },
            {
                id: 5,
                name: "Herbal Recovery Oil",
                brand: "Ayurveda Plus",
                points: 400,
                discount: "18%",
                originalPrice: 800,
                category: "wellness"
            },
            {
                id: 6,
                name: "Indian Sports Jersey",
                brand: "Tricolor Sports",
                points: 600,
                discount: "22%",
                originalPrice: 1500,
                category: "apparel"
            }
        ];
        
        this.loadUserData();
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.checkStreak();
        this.renderMarketplace();
        this.renderLeaderboard();
        this.renderAchievements();
    }
    
    // Load user data from localStorage
    loadUserData() {
        const saved = localStorage.getItem('fitcoin_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.points = data.points || 0;
            this.level = data.level || 1;
            this.totalActivities = data.totalActivities || 0;
            this.streak = data.streak || 0;
            this.lastActivityDate = data.lastActivityDate;
            this.transactionHistory = data.transactionHistory || [];
            this.achievements = data.achievements || [];
        }
    }
    
    // Save user data to localStorage
    saveUserData() {
        const data = {
            points: this.points,
            level: this.level,
            totalActivities: this.totalActivities,
            streak: this.streak,
            lastActivityDate: this.lastActivityDate,
            transactionHistory: this.transactionHistory,
            achievements: this.achievements
        };
        localStorage.setItem('fitcoin_data', JSON.stringify(data));
    }
    
    // Award points for activities
    awardPoints(activityType, description = '', bonusMultiplier = 1) {
        const basePoints = this.activityMultipliers[activityType] || 10;
        const pointsEarned = Math.floor(basePoints * bonusMultiplier);
        
        this.points += pointsEarned;
        this.totalActivities++;
        
        // Check for level up
        const newLevel = Math.floor(this.points / 1000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showNotification(`Level Up! You're now Level ${this.level}!`, 'success');
        }
        
        // Add to transaction history
        this.transactionHistory.unshift({
            id: Date.now(),
            type: 'earned',
            points: pointsEarned,
            activity: activityType,
            description: description,
            timestamp: new Date().toISOString(),
            totalPoints: this.points
        });
        
        // Check achievements
        this.checkAchievements();
        
        this.saveUserData();
        this.updateDisplay();
        
        return pointsEarned;
    }
    
    // Check and award achievements
    checkAchievements() {
        const newAchievements = [];
        
        // First workout achievement
        if (this.totalActivities === 1 && !this.hasAchievement('first_workout')) {
            newAchievements.push({
                id: 'first_workout',
                title: 'First Steps',
                description: 'Completed your first activity!',
                points: 100,
                icon: '🎯'
            });
        }
        
        // Streak achievements
        if (this.streak >= 7 && !this.hasAchievement('week_streak')) {
            newAchievements.push({
                id: 'week_streak',
                title: 'Week Warrior',
                description: '7-day activity streak!',
                points: 200,
                icon: '🔥'
            });
        }
        
        if (this.streak >= 30 && !this.hasAchievement('month_streak')) {
            newAchievements.push({
                id: 'month_streak',
                title: 'Monthly Master',
                description: '30-day activity streak!',
                points: 500,
                icon: '🏆'
            });
        }
        
        // Points milestones
        if (this.points >= 1000 && !this.hasAchievement('thousand_points')) {
            newAchievements.push({
                id: 'thousand_points',
                title: 'Point Collector',
                description: 'Earned 1000+ FitCoins!',
                points: 0,
                icon: '💰'
            });
        }
        
        if (this.points >= 5000 && !this.hasAchievement('five_thousand_points')) {
            newAchievements.push({
                id: 'five_thousand_points',
                title: 'FitCoin Millionaire',
                description: 'Earned 5000+ FitCoins!',
                points: 0,
                icon: '💎'
            });
        }
        
        // Add new achievements
        newAchievements.forEach(achievement => {
            this.achievements.push(achievement);
            this.showNotification(`Achievement Unlocked: ${achievement.title}!`, 'achievement');
            if (achievement.points > 0) {
                this.points += achievement.points;
            }
        });
    }
    
    hasAchievement(achievementId) {
        return this.achievements.some(a => a.id === achievementId);
    }
    
    // Check daily streak
    checkStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (this.lastActivityDate === today) {
            // Already active today
            return;
        } else if (this.lastActivityDate === yesterday) {
            // Continuing streak
            this.streak++;
        } else if (this.lastActivityDate && this.lastActivityDate !== yesterday) {
            // Streak broken
            this.streak = 1;
        } else {
            // First activity
            this.streak = 1;
        }
        
        this.lastActivityDate = today;
    }
    
    // Redeem points for marketplace items
    redeemPoints(itemId) {
        const item = this.marketplace.find(p => p.id === itemId);
        if (!item) return false;
        
        if (this.points >= item.points) {
            this.points -= item.points;
            
            // Add to transaction history
            this.transactionHistory.unshift({
                id: Date.now(),
                type: 'redeemed',
                points: -item.points,
                activity: 'marketplace_purchase',
                description: `Redeemed ${item.name}`,
                timestamp: new Date().toISOString(),
                totalPoints: this.points
            });
            
            this.saveUserData();
            this.updateDisplay();
            this.showNotification(`Successfully redeemed ${item.name}!`, 'success');
            return true;
        } else {
            this.showNotification('Insufficient FitCoins!', 'error');
            return false;
        }
    }
    
    // Update display elements
    updateDisplay() {
        // Update header points display
        const pointsDisplay = document.getElementById('fitcoin-display');
        if (pointsDisplay) {
            pointsDisplay.innerHTML = `
                <div class="fitcoin-info">
                    <span class="fitcoin-icon">🪙</span>
                    <span class="fitcoin-amount">${this.points}</span>
                    <span class="fitcoin-label">FitCoins</span>
                </div>
                <div class="level-info">
                    <span class="level-badge">Level ${this.level}</span>
                </div>
            `;
        }
        
        // Update streak display
        const streakDisplay = document.getElementById('streak-display');
        if (streakDisplay) {
            streakDisplay.innerHTML = `
                <div class="streak-info">
                    <span class="streak-icon">🔥</span>
                    <span class="streak-count">${this.streak}</span>
                    <span class="streak-label">Day Streak</span>
                </div>
            `;
        }
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'achievement' ? '🏆' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Render marketplace
    renderMarketplace() {
        const container = document.getElementById('marketplace-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="marketplace-header">
                <h3>🛒 Swadeshi Marketplace</h3>
                <p>Support Indian startups with your FitCoins</p>
            </div>
            <div class="marketplace-grid">
                ${this.marketplace.map(item => `
                    <div class="marketplace-item">
                        <div class="item-image">
                            <div class="item-placeholder">${item.category === 'nutrition' ? '🥤' : 
                                item.category === 'beverages' ? '🍵' : 
                                item.category === 'equipment' ? '🧘' : 
                                item.category === 'footwear' ? '👟' : 
                                item.category === 'wellness' ? '🌿' : '👕'}</div>
                        </div>
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p class="item-brand">by ${item.brand}</p>
                            <div class="item-pricing">
                                <span class="original-price">₹${item.originalPrice}</span>
                                <span class="discount">${item.discount} OFF</span>
                            </div>
                            <div class="item-points">
                                <span class="points-cost">${item.points} FitCoins</span>
                            </div>
                            <button class="btn primary redeem-btn" ${this.points < item.points ? 'disabled' : ''} 
                                    onclick="fitcoinSystem.redeemPoints(${item.id})">
                                ${this.points >= item.points ? 'Redeem Now' : 'Need More Points'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Render leaderboard
    renderLeaderboard() {
        const container = document.getElementById('leaderboard-container');
        if (!container) return;
        
        // Sample leaderboard data (in real app, this would come from server)
        const leaderboard = [
            { name: 'Raj Patel', points: 12500, level: 13, avatar: '🇮🇳' },
            { name: 'Priya Sharma', points: 11200, level: 12, avatar: '🏃‍♀️' },
            { name: 'Amit Kumar', points: 9800, level: 10, avatar: '💪' },
            { name: 'Sneha Singh', points: 8700, level: 9, avatar: '🏅' },
            { name: 'Vikram Reddy', points: 7500, level: 8, avatar: '⚡' }
        ];
        
        container.innerHTML = `
            <div class="leaderboard-header">
                <h3>🏆 Bharat Fitness Leaderboard</h3>
                <p>Top performers this month</p>
            </div>
            <div class="leaderboard-list">
                ${leaderboard.map((user, index) => `
                    <div class="leaderboard-item ${index < 3 ? 'top-three' : ''}">
                        <div class="rank">${index + 1}</div>
                        <div class="user-info">
                            <span class="avatar">${user.avatar}</span>
                            <div class="user-details">
                                <span class="name">${user.name}</span>
                                <span class="level">Level ${user.level}</span>
                            </div>
                        </div>
                        <div class="points">${user.points.toLocaleString()} FitCoins</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Render achievements
    renderAchievements() {
        const container = document.getElementById('achievements-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="achievements-header">
                <h3>🏆 Achievements</h3>
                <p>Your fitness milestones</p>
            </div>
            <div class="achievements-grid">
                ${this.achievements.map(achievement => `
                    <div class="achievement-item">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-info">
                            <h4>${achievement.title}</h4>
                            <p>${achievement.description}</p>
                            ${achievement.points > 0 ? `<span class="achievement-points">+${achievement.points} FitCoins</span>` : ''}
                        </div>
                    </div>
                `).join('')}
                ${this.achievements.length === 0 ? '<p class="no-achievements">Complete activities to unlock achievements!</p>' : ''}
            </div>
        `;
    }
    
    // Simulate activity completion (for demo purposes)
    simulateActivity(activityType) {
        const descriptions = {
            'workout': 'Completed a workout session',
            'cardio': 'Finished cardio training',
            'strength': 'Completed strength training',
            'yoga': 'Finished yoga session',
            'sports': 'Played sports with team',
            'challenge': 'Completed fitness challenge'
        };
        
        const points = this.awardPoints(activityType, descriptions[activityType]);
        this.showNotification(`+${points} FitCoins earned for ${descriptions[activityType]}!`, 'success');
    }
}

// Initialize FitCoin system
let fitcoinSystem;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.dataset.theme = savedTheme;
        if (savedTheme === 'light') {
            document.getElementById('themeToggle').checked = true;
        }
    }

    // Add theme toggle listener
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'light' : 'dark';
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
    });

    fitcoinSystem = new FitCoinSystem();
    
    // Add demo activity buttons
    const demoContainer = document.getElementById('demo-activities');
    if (demoContainer) {
        demoContainer.innerHTML = `
            <div class="demo-activities">
                <h4>🎮 Demo Activities</h4>
                <div class="activity-buttons">
                    <button class="btn primary" onclick="fitcoinSystem.simulateActivity('workout')">💪 Workout</button>
                    <button class="btn primary" onclick="fitcoinSystem.simulateActivity('cardio')">🏃 Cardio</button>
                    <button class="btn primary" onclick="fitcoinSystem.simulateActivity('strength')">🏋️ Strength</button>
                    <button class="btn primary" onclick="fitcoinSystem.simulateActivity('yoga')">🧘 Yoga</button>
                    <button class="btn primary" onclick="fitcoinSystem.simulateActivity('sports')">⚽ Sports</button>
                    <button class="btn primary" onclick="fitcoinSystem.simulateActivity('challenge')">🎯 Challenge</button>
                </div>
            </div>
        `;
    }
});
