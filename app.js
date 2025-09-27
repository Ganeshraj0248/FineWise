// FinWise Dashboard Application
class FinWiseApp {
    constructor() {
        this.currentUser = 0;
        this.users = [
            {
                name: "Priya Patel",
                age: 29,
                city: "Mumbai",
                occupation: "Marketing Manager",
                salary: 67500,
                total_income: 80525.50,
                total_expenses: 65746.00,
                savings_rate: 18.35,
                risk_score: 42,
                credit_score: 725,
                transactions: [
                    {
                        date: "2024-03-15",
                        description: "SALARY CREDIT",
                        amount: 67500,
                        type: "credit",
                        category: "Income/Salary",
                        merchant: "GLOBAL CONSUMER GOODS LTD",
                        payment_method: "Bank Transfer"
                    },
                    {
                        date: "2024-03-01",
                        description: "RENT PAYMENT",
                        amount: -18000,
                        type: "debit",
                        category: "Essentials/Rent",
                        merchant: "LANDLORD",
                        payment_method: "Bank Transfer"
                    },
                    {
                        date: "2024-03-05",
                        description: "GROCERY SHOPPING",
                        amount: -4500,
                        type: "debit",
                        category: "Essentials/Food",
                        merchant: "BIG BAZAAR",
                        payment_method: "Debit Card"
                    },
                    {
                        date: "2024-03-10",
                        description: "RESTAURANT",
                        amount: -1200,
                        type: "debit",
                        category: "Lifestyle/Food",
                        merchant: "SOCIAL OFFLINE",
                        payment_method: "Credit Card"
                    },
                    {
                        date: "2024-03-12",
                        description: "ONLINE SHOPPING",
                        amount: -3500,
                        type: "debit",
                        category: "Lifestyle/Shopping",
                        merchant: "AMAZON",
                        payment_method: "Credit Card"
                    },
                    {
                        date: "2024-03-08",
                        description: "ELECTRICITY BILL",
                        amount: -2100,
                        type: "debit",
                        category: "Essentials/Utilities",
                        merchant: "MSEB",
                        payment_method: "Online"
                    },
                    {
                        date: "2024-03-14",
                        description: "MUTUAL FUND SIP",
                        amount: -5000,
                        type: "debit",
                        category: "Investments/SIP",
                        merchant: "HDFC MUTUAL FUND",
                        payment_method: "Auto Debit"
                    },
                    {
                        date: "2024-03-06",
                        description: "FREELANCE INCOME",
                        amount: 13025.50,
                        type: "credit",
                        category: "Income/Freelance",
                        merchant: "CLIENT PAYMENT",
                        payment_method: "Bank Transfer"
                    }
                ]
            },
            {
                name: "Rahul Kumar",
                age: 35,
                city: "Delhi",
                occupation: "IT Project Manager",
                salary: 125000,
                total_income: 154850.25,
                total_expenses: 205342.75,
                savings_rate: -32.6,
                risk_score: 78,
                credit_score: 650,
                transactions: [
                    {
                        date: "2024-03-01",
                        description: "SALARY CREDIT",
                        amount: 125000,
                        type: "credit",
                        category: "Income/Salary",
                        merchant: "TECH SOLUTIONS INC",
                        payment_method: "Bank Transfer"
                    },
                    {
                        date: "2024-03-01",
                        description: "HOME LOAN EMI",
                        amount: -45000,
                        type: "debit",
                        category: "Financial Commitments/Loan EMI",
                        merchant: "HDFC BANK",
                        payment_method: "Auto Debit"
                    },
                    {
                        date: "2024-03-02",
                        description: "CAR LOAN EMI",
                        amount: -18000,
                        type: "debit",
                        category: "Financial Commitments/Loan EMI",
                        merchant: "AXIS BANK",
                        payment_method: "Auto Debit"
                    },
                    {
                        date: "2024-03-05",
                        description: "CREDIT CARD BILL",
                        amount: -25000,
                        type: "debit",
                        category: "Financial Commitments/Credit Card",
                        merchant: "ICICI BANK",
                        payment_method: "Online"
                    },
                    {
                        date: "2024-03-07",
                        description: "RENT PAYMENT",
                        amount: -35000,
                        type: "debit",
                        category: "Essentials/Rent",
                        merchant: "LANDLORD",
                        payment_method: "Bank Transfer"
                    },
                    {
                        date: "2024-03-10",
                        description: "DINING OUT",
                        amount: -8500,
                        type: "debit",
                        category: "Lifestyle/Food",
                        merchant: "VARIOUS RESTAURANTS",
                        payment_method: "Credit Card"
                    },
                    {
                        date: "2024-03-12",
                        description: "ONLINE SHOPPING",
                        amount: -15000,
                        type: "debit",
                        category: "Lifestyle/Shopping",
                        merchant: "FLIPKART",
                        payment_method: "Credit Card"
                    },
                    {
                        date: "2024-03-15",
                        description: "CONSULTING INCOME",
                        amount: 29850.25,
                        type: "credit",
                        category: "Income/Consulting",
                        merchant: "FREELANCE CLIENT",
                        payment_method: "Bank Transfer"
                    }
                ]
            }
        ];
        
        this.currentPage = 'dashboard';
        this.charts = {};
        this.filteredTransactions = [];
        this.initialized = false;
    }

    init() {
        console.log('Initializing FinWise App...');
        
        // Hide loading overlay first
        this.hideLoading();
        
        // Setup all event listeners
        this.setupNavigation();
        this.setupUserToggle();
        this.setupTransactionFilters();
        this.setupProfile();
        this.setupNotifications();
        
        // Update UI and load initial content
        this.updateUserInterface();
        this.loadDashboard();
        
        this.initialized = true;
        console.log('FinWise App initialized successfully');
    }

    // Navigation Management
    setupNavigation() {
        console.log('Setting up navigation...');
        
        // Setup nav links
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Found nav links:', navLinks.length);
        
        navLinks.forEach((link, index) => {
            console.log(`Setting up nav link ${index}:`, link.getAttribute('data-page'));
            link.addEventListener('click', (e) => {
                console.log('Nav link clicked:', e.target.getAttribute('data-page'));
                e.preventDefault();
                e.stopPropagation();
                const page = e.target.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Setup View All button with a more specific selector
        setTimeout(() => {
            const viewAllButtons = document.querySelectorAll('.recent-transactions .btn');
            console.log('Found view all buttons:', viewAllButtons.length);
            viewAllButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    console.log('View All button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    this.navigateToPage('transactions');
                });
            });
        }, 100);
    }

    navigateToPage(page) {
        console.log('Navigating to page:', page);
        
        try {
            // Update navigation active state
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`[data-page="${page}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                console.log('Set active nav link for:', page);
            }

            // Hide all pages
            document.querySelectorAll('.page').forEach(p => {
                p.classList.remove('active');
            });

            // Show target page
            const targetPage = document.getElementById(page);
            if (targetPage) {
                targetPage.classList.add('active');
                console.log('Showing page:', page);
            } else {
                console.error('Page not found:', page);
                return;
            }

            this.currentPage = page;

            // Load page-specific content
            this.loadPageContent(page);
            
        } catch (error) {
            console.error('Error navigating to page:', error);
        }
    }

    loadPageContent(page) {
        console.log('Loading content for page:', page);
        
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'transactions':
                this.loadTransactions();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'credit':
                this.loadCreditScore();
                break;
            case 'risk':
                this.loadRiskAnalysis();
                break;
            case 'notifications':
                this.loadNotifications();
                break;
            default:
                console.warn('Unknown page:', page);
        }
    }

    // User Management
    setupUserToggle() {
        console.log('Setting up user toggle...');
        const userToggleBtn = document.getElementById('userToggle');
        
        if (userToggleBtn) {
            console.log('User toggle button found');
            userToggleBtn.addEventListener('click', (e) => {
                console.log('User toggle clicked, current user:', this.currentUser);
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle user
                this.currentUser = this.currentUser === 0 ? 1 : 0;
                console.log('Switched to user:', this.currentUser, this.getCurrentUser().name);
                
                // Update interface and reload current page
                this.updateUserInterface();
                this.loadPageContent(this.currentPage);
            });
        } else {
            console.error('User toggle button not found');
        }
    }

    updateUserInterface() {
        const user = this.getCurrentUser();
        console.log('Updating UI for user:', user.name);
        
        const userNameEl = document.querySelector('.user-name');
        if (userNameEl) {
            userNameEl.textContent = user.name;
        }
        
        const profileInitials = document.getElementById('profileInitials');
        if (profileInitials) {
            profileInitials.textContent = user.name.split(' ').map(n => n[0]).join('');
        }
    }

    getCurrentUser() {
        return this.users[this.currentUser];
    }

    // Dashboard Functions
    loadDashboard() {
        console.log('Loading dashboard...');
        const user = this.getCurrentUser();
        
        // Update metrics
        this.updateElement('totalIncome', `₹${user.total_income.toLocaleString('en-IN')}`);
        this.updateElement('totalExpenses', `₹${user.total_expenses.toLocaleString('en-IN')}`);
        this.updateElement('savingsRate', `${user.savings_rate.toFixed(1)}%`);
        this.updateElement('creditScore', user.credit_score);

        // Load recent transactions
        this.loadRecentTransactions();
        
        // Load charts with delay to ensure canvas elements are rendered
        setTimeout(() => {
            this.createIncomeExpenseChart();
            this.createCategoryChart();
        }, 200);
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        } else {
            console.warn(`Element not found: ${id}`);
        }
    }

    createIncomeExpenseChart() {
        console.log('Creating income expense chart...');
        const ctx = document.getElementById('incomeExpenseChart');
        if (!ctx) {
            console.error('Income expense chart canvas not found');
            return;
        }
        
        if (this.charts.incomeExpense) {
            this.charts.incomeExpense.destroy();
        }

        const user = this.getCurrentUser();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const incomeData = [65000, 67500, user.total_income, 70000, 72000, 68000];
        const expenseData = [58000, 62000, user.total_expenses, 66000, 68000, 63000];

        try {
            this.charts.incomeExpense = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Income',
                            data: incomeData,
                            borderColor: '#1FB8CD',
                            backgroundColor: 'rgba(31, 184, 205, 0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Expenses',
                            data: expenseData,
                            borderColor: '#FFC185',
                            backgroundColor: 'rgba(255, 193, 133, 0.1)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toLocaleString('en-IN');
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
            console.log('Income expense chart created successfully');
        } catch (error) {
            console.error('Error creating income expense chart:', error);
        }
    }

    createCategoryChart() {
        console.log('Creating category chart...');
        const ctx = document.getElementById('categoryChart');
        if (!ctx) {
            console.error('Category chart canvas not found');
            return;
        }
        
        if (this.charts.category) {
            this.charts.category.destroy();
        }

        const user = this.getCurrentUser();
        const categoryData = this.getCategoryBreakdown(user.transactions);

        try {
            this.charts.category = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        data: Object.values(categoryData),
                        backgroundColor: [
                            '#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', 
                            '#5D878F', '#DB4545', '#D2BA4C', '#964325'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            console.log('Category chart created successfully');
        } catch (error) {
            console.error('Error creating category chart:', error);
        }
    }

    getCategoryBreakdown(transactions) {
        const categories = {};
        transactions.forEach(t => {
            if (t.type === 'debit') {
                const category = t.category.split('/')[0];
                categories[category] = (categories[category] || 0) + Math.abs(t.amount);
            }
        });
        return categories;
    }

    loadRecentTransactions() {
        const user = this.getCurrentUser();
        const recent = user.transactions.slice(0, 5);
        const container = document.getElementById('recentTransactionsList');
        
        if (container) {
            container.innerHTML = recent.map(t => `
                <div class="transaction-item">
                    <div class="transaction-details">
                        <h4>${t.description}</h4>
                        <p>${t.merchant} • ${new Date(t.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${t.amount > 0 ? '+' : ''}₹${Math.abs(t.amount).toLocaleString('en-IN')}
                    </div>
                </div>
            `).join('');
        }
    }

    // Transactions Functions
    setupTransactionFilters() {
        // Setup filters when transactions page loads
        const setupFilters = () => {
            const searchInput = document.getElementById('transactionSearch');
            const categoryFilter = document.getElementById('categoryFilter');
            const typeFilter = document.getElementById('typeFilter');
            const dateFilter = document.getElementById('dateFilter');

            [searchInput, categoryFilter, typeFilter, dateFilter].forEach(element => {
                if (element) {
                    element.addEventListener('input', () => this.filterTransactions());
                }
            });
        };
        
        // Try to setup filters now and also when transactions page loads
        setupFilters();
        this.setupFilters = setupFilters; // Store reference for later use
    }

    loadTransactions() {
        console.log('Loading transactions...');
        const user = this.getCurrentUser();
        this.filteredTransactions = [...user.transactions];
        this.renderTransactions();
        
        // Setup filters again for this page
        if (this.setupFilters) {
            setTimeout(this.setupFilters, 100);
        }
    }

    filterTransactions() {
        const user = this.getCurrentUser();
        const searchEl = document.getElementById('transactionSearch');
        const categoryEl = document.getElementById('categoryFilter');
        const typeEl = document.getElementById('typeFilter');
        const dateEl = document.getElementById('dateFilter');
        
        const search = searchEl ? searchEl.value.toLowerCase() : '';
        const category = categoryEl ? categoryEl.value : '';
        const type = typeEl ? typeEl.value : '';
        const date = dateEl ? dateEl.value : '';

        this.filteredTransactions = user.transactions.filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(search) || 
                                t.merchant.toLowerCase().includes(search);
            const matchesCategory = !category || t.category === category;
            const matchesType = !type || t.type === type;
            const matchesDate = !date || t.date === date;

            return matchesSearch && matchesCategory && matchesType && matchesDate;
        });

        this.renderTransactions();
    }

    renderTransactions() {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.filteredTransactions.map(t => `
            <tr>
                <td>${new Date(t.date).toLocaleDateString('en-IN')}</td>
                <td>${t.description}</td>
                <td>${t.merchant}</td>
                <td>${t.category}</td>
                <td class="amount ${t.type}">
                    ${t.amount > 0 ? '+' : ''}₹${Math.abs(t.amount).toLocaleString('en-IN')}
                </td>
                <td>
                    <span class="transaction-type ${t.type}">${t.type}</span>
                </td>
            </tr>
        `).join('');
    }

    // Profile Functions
    setupProfile() {
        const setupProfileForm = () => {
            const form = document.querySelector('.profile-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.updateProfile();
                });
            }
        };
        
        setupProfileForm();
        this.setupProfileForm = setupProfileForm;
    }

    loadProfile() {
        console.log('Loading profile...');
        const user = this.getCurrentUser();
        
        const elements = {
            fullName: document.getElementById('fullName'),
            age: document.getElementById('age'),
            city: document.getElementById('city'),
            occupation: document.getElementById('occupation'),
            salary: document.getElementById('salary')
        };
        
        if (elements.fullName) elements.fullName.value = user.name;
        if (elements.age) elements.age.value = user.age;
        if (elements.city) elements.city.value = user.city;
        if (elements.occupation) elements.occupation.value = user.occupation;
        if (elements.salary) elements.salary.value = user.salary;
        
        // Setup form if needed
        if (this.setupProfileForm) {
            setTimeout(this.setupProfileForm, 100);
        }
    }

    updateProfile() {
        const user = this.getCurrentUser();
        
        const fullNameEl = document.getElementById('fullName');
        const ageEl = document.getElementById('age');
        const cityEl = document.getElementById('city');
        const occupationEl = document.getElementById('occupation');
        const salaryEl = document.getElementById('salary');
        
        if (fullNameEl) user.name = fullNameEl.value;
        if (ageEl) user.age = parseInt(ageEl.value);
        if (cityEl) user.city = cityEl.value;
        if (occupationEl) user.occupation = occupationEl.value;
        if (salaryEl) user.salary = parseFloat(salaryEl.value);

        this.updateUserInterface();
        alert('Profile updated successfully!');
    }

    // Credit Score Functions
    loadCreditScore() {
        console.log('Loading credit score...');
        const user = this.getCurrentUser();
        this.updateElement('currentScore', user.credit_score);
        
        setTimeout(() => {
            this.createCreditGauge();
        }, 200);
    }

    createCreditGauge() {
        const ctx = document.getElementById('creditGauge');
        if (!ctx) return;
        
        if (this.charts.creditGauge) {
            this.charts.creditGauge.destroy();
        }

        const user = this.getCurrentUser();
        const score = user.credit_score;
        const maxScore = 850;

        try {
            this.charts.creditGauge = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [score, maxScore - score],
                        backgroundColor: [
                            score >= 750 ? '#1FB8CD' : 
                            score >= 650 ? '#FFC185' : '#B4413C',
                            'rgba(180, 180, 180, 0.2)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    rotation: -90,
                    circumference: 180,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating credit gauge:', error);
        }
    }

    // Risk Analysis Functions
    loadRiskAnalysis() {
        console.log('Loading risk analysis...');
        const user = this.getCurrentUser();
        this.updateElement('riskScore', user.risk_score);
        
        setTimeout(() => {
            this.createSpendingPersonalityChart();
        }, 200);
    }

    createSpendingPersonalityChart() {
        const ctx = document.getElementById('spendingPersonalityChart');
        if (!ctx) return;
        
        if (this.charts.spendingPersonality) {
            this.charts.spendingPersonality.destroy();
        }

        try {
            this.charts.spendingPersonality = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Essentials', 'Lifestyle', 'Investments', 'Savings', 'Financial Planning'],
                    datasets: [{
                        label: 'Your Profile',
                        data: [85, 65, 45, 55, 70],
                        backgroundColor: 'rgba(31, 184, 205, 0.2)',
                        borderColor: '#1FB8CD',
                        borderWidth: 2
                    }, {
                        label: 'Ideal Profile',
                        data: [80, 50, 70, 80, 90],
                        backgroundColor: 'rgba(255, 193, 133, 0.2)',
                        borderColor: '#FFC185',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating spending personality chart:', error);
        }
    }

    // Notifications Functions
    setupNotifications() {
        const setupNotificationEvents = () => {
            const markAllReadBtn = document.getElementById('markAllRead');
            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', () => {
                    this.markAllNotificationsRead();
                });
            }
        };
        
        setupNotificationEvents();
        this.setupNotificationEvents = setupNotificationEvents;
    }

    loadNotifications() {
        console.log('Loading notifications...');
        this.updateNotificationCount();
        
        if (this.setupNotificationEvents) {
            setTimeout(this.setupNotificationEvents, 100);
        }
    }

    markAllNotificationsRead() {
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        this.updateNotificationCount();
    }

    updateNotificationCount() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        this.updateElement('unreadCount', unreadCount);
    }

    // Utility Functions
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }
}

// Global variables
let finwiseApp = null;

// Initialize the application
function initializeApp() {
    console.log('Initializing FinWise Application...');
    try {
        finwiseApp = new FinWiseApp();
        finwiseApp.init();
        window.finwiseApp = finwiseApp;
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Global function to show pages (for button clicks in HTML)
function showPage(page) {
    if (finwiseApp) {
        finwiseApp.navigateToPage(page);
    }
}

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (finwiseApp && finwiseApp.charts) {
        Object.values(finwiseApp.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }
});