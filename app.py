from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='static')
CORS(app)

# =============================================================================
# DASHBOARD ROUTE
# =============================================================================

@app.route('/')
def dashboard():
    """Serve the Futuristic FinWise Dashboard"""
    return render_template('index.html')

# =============================================================================
# DATA LOADING & INITIALIZATION
# =============================================================================

def load_config_data():
    """Load the config.json file with error handling"""
    try:
        with open('config.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print("Warning: config.json not found, using fallback data")
        return None
    except json.JSONDecodeError:
        print("Warning: config.json is invalid, using fallback data")
        return None

config_data = load_config_data()

# Helper to extract user data from config.json (supports both single and multiple users)
def extract_user_data(config, user_index=0):
    if config and "users" in config and isinstance(config["users"], list):
        user_block = config["users"][user_index]
        profile = user_block['metadata']['profile']
        transactions = user_block['financial_statement']['raw_transactions']
    elif config and "metadata" in config and "financial_statement" in config:
        profile = config['metadata']['profile']
        transactions = config['financial_statement']['raw_transactions']
    else:
        return None, None, None

    total_income = sum(t['amount'] for t in transactions if t['type'] == 'credit')
    total_spending = sum(abs(t['amount']) for t in transactions if t['type'] == 'debit')

    user_data = {
        "name": profile.get('name', 'Unknown'),
        "age": profile.get('age', 0),
        "income": int(total_income) if total_income > 0 else 82000,
        "totalEMI": 0,
        "creditUtilization": min(total_spending / total_income if total_income > 0 else 0.3, 1.0),
        "bnplTransactions": len([t for t in transactions if abs(t['amount']) < 5000 and t['type'] == 'debit']),
        "upiFrequency": len([t for t in transactions if t.get('payment_method') == 'UPI']),
        "digitalAdoption": 95.6,
        "incomeStability": 88
    }

    mock_transactions = []
    for i, t in enumerate(transactions[-10:]):  # Last 10 transactions
        mock_transactions.append({
            "id": i + 1,
            "amount": abs(t['amount']),
            "type": "BNPL" if abs(t['amount']) < 5000 and t['type'] == 'debit' else t.get('category', 'Other'),
            "date": t.get('date', ''),
            "merchant": t.get('merchant_name', 'Unknown'),
            "method": t.get('payment_method', 'Unknown'),
            "status": t.get('status', 'completed')
        })
    return profile, user_data, mock_transactions

# Default fallback data
fallback_profile = {
    "name": "Aarav Sharma",
    "age": 26,
    "city": "Bangalore",
    "occupation": "Software Engineer"
}
fallback_user_data = {
    "name": "Aarav Sharma",
    "age": 26,
    "income": 82000,
    "totalEMI": 0,
    "creditUtilization": 0.243,
    "bnplTransactions": 8,
    "upiFrequency": 45,
    "digitalAdoption": 95.6,
    "incomeStability": 88
}
fallback_mock_transactions = [
    {"id": 1, "amount": 2500, "type": "BNPL", "date": "2025-09-20", "merchant": "Myntra", "method": "UPI", "status": "completed"},
    {"id": 2, "amount": 800, "type": "Food", "date": "2025-09-19", "merchant": "Swiggy", "method": "UPI", "status": "completed"},
    {"id": 3, "amount": 1200, "type": "Transport", "date": "2025-09-18", "merchant": "Uber", "method": "UPI", "status": "completed"},
    {"id": 4, "amount": 599, "type": "Entertainment", "date": "2025-09-17", "merchant": "Netflix", "method": "Card", "status": "completed"}
]

def get_current_user_idx():
    try:
        idx = int(request.args.get("user_idx", "0"))
        return max(0, idx)
    except Exception:
        return 0

def get_current_user():
    if config_data:
        idx = get_current_user_idx()
        extracted = extract_user_data(config_data, user_index=idx)
        if extracted and extracted[0]:
            return extracted
    return fallback_profile, fallback_user_data, fallback_mock_transactions

# =============================================================================
# CORE API ENDPOINTS
# =============================================================================

@app.route('/api/user', methods=['GET'])
def get_user():
    profile, user_data, mock_transactions = get_current_user()
    return jsonify({
        "name": user_data["name"],
        "age": user_data["age"],
        "income": user_data["income"],
        "totalEMI": user_data["totalEMI"],
        "profileComplete": 92,
        "memberSince": profile.get("period", {}).get("start_date", "Sep 2025") if config_data else "Sep 2025",
        "city": profile.get("city", "Bangalore"),
        "occupation": profile.get("occupation", "Software Engineer"),
        "creditUtilization": round(user_data["creditUtilization"] * 100, 1),
        "digitalAdoption": user_data["digitalAdoption"],
        "aiEnabled": False
    })

@app.route('/api/risk-analysis', methods=['GET'])
def risk_analysis():
    _, user_data, transactions = get_current_user()
    risk_assessment = calculate_comprehensive_risk(user_data)
    debt_trap_warnings = analyze_debt_trap_risk(user_data, transactions)
    spending_personality = analyze_spending_personality(transactions, user_data)
    behavioral_insights = analyze_behavioral_patterns(transactions, user_data)
    trend_analysis = analyze_financial_trends(transactions, user_data)
    smart_alerts = generate_smart_alerts(user_data, risk_assessment, debt_trap_warnings)
    actionable_recommendations = generate_actionable_recommendations(
        user_data, risk_assessment, spending_personality, behavioral_insights
    )
    return jsonify({
        "riskScore": risk_assessment["overall_score"],
        "riskLevel": risk_assessment["risk_level"],
        "riskColor": risk_assessment["color"],
        "riskCategory": risk_assessment["category"],
        "confidenceLevel": risk_assessment["confidence"],
        "riskFactors": risk_assessment["factors"],
        "debtTrapWarnings": debt_trap_warnings,
        "spendingPersonality": spending_personality,
        "behavioralInsights": behavioral_insights,
        "trendAnalysis": trend_analysis,
        "alerts": smart_alerts,
        "recommendations": actionable_recommendations,
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "analysisMethod": "Enhanced Rule-based with Behavioral Analysis",
        "aiPowered": False,
        "analysisDepth": "comprehensive"
    })

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    _, _, mock_transactions = get_current_user()
    enhanced_transactions = []
    for transaction in mock_transactions:
        enhanced_transaction = transaction.copy()
        enhanced_transaction["category"] = categorize_transaction(transaction)
        enhanced_transaction["riskLevel"] = assess_transaction_risk(transaction)
        enhanced_transactions.append(enhanced_transaction)
    return jsonify({
        "transactions": enhanced_transactions,
        "summary": {
            "totalCount": len(mock_transactions),
            "totalAmount": sum(t["amount"] for t in mock_transactions),
            "averageAmount": round(sum(t["amount"] for t in mock_transactions) / len(mock_transactions), 2) if mock_transactions else 0,
            "uniqueMerchants": len(set(t["merchant"] for t in mock_transactions))
        },
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    import numpy as np
    profile, user_data, mock_transactions = get_current_user()
    risk_score = calculate_risk(user_data)
    monthly_income = user_data.get("income", 0)
    total_emi = user_data.get("totalEMI", 0)
    total_spending = sum(t["amount"] for t in mock_transactions)
    monthly_savings = max(0, monthly_income - total_emi - total_spending)
    savings_rate = (monthly_savings / monthly_income * 100) if monthly_income > 0 else 0
    risk_level = "HIGH" if risk_score > 70 else "MEDIUM" if risk_score > 40 else "LOW"
    risk_color = "#ef4444" if risk_level == "HIGH" else "#f59e0b" if risk_level == "MEDIUM" else "#22c55e"
    active_alerts = generate_alerts(user_data, risk_score)
    recommendations = generate_recommendations(user_data, risk_score)
    spending_by_category = {}
    for t in mock_transactions:
        cat = t.get("type", "Other")
        spending_by_category.setdefault(cat, 0)
        spending_by_category[cat] += t["amount"]
    upi_txn_count = user_data.get("upiFrequency", 0)
    card_txn_count = len([t for t in mock_transactions if t.get("method", "").lower() == "card"])
    bank_transfer_count = len([t for t in mock_transactions if t.get("method", "").lower() == "bank transfer"])
    financial_goals = [
        {"goal": "Emergency Fund", "target": 200000, "current": user_data.get("incomeStability", 0) * 2000, "progress": round(user_data.get("incomeStability", 0) / 100, 2)},
        {"goal": "Vacation", "target": 50000, "current": monthly_savings, "progress": round(monthly_savings/50000, 2) if 50000 else 0},
        {"goal": "Investments", "target": monthly_income*0.2, "current": monthly_income*0.13, "progress": round(0.65, 2)}
    ]
    anomaly_stats = {}
    if config_data:
        if "users" in config_data and isinstance(config_data["users"], list):
            anomalies = config_data["users"][get_current_user_idx()].get("anomaly_analysis", {})
        else:
            anomalies = config_data.get("anomaly_analysis", {})
        anomaly_stats = {
            "count": anomalies.get("anomaly_count", len(anomalies.get("detected_anomalies", []))),
            "details": anomalies.get("detected_anomalies", []),
            "overallRiskScore": anomalies.get("overall_risk_score", None),
            "recommendations": anomalies.get("recommendations", [])
        }
    recent_savings = []
    for i in range(min(3, len(mock_transactions))):
        t = mock_transactions[-(i+1)]
        recent_savings.append(monthly_income - total_emi - t["amount"])
    savings_forecast = round(np.mean(recent_savings), 2) if recent_savings else monthly_savings
    historical_trend = [monthly_savings * (0.95 + 0.01*i) for i in range(6)]
    merchant_spending = {}
    for t in mock_transactions:
        merchant = t.get("merchant", "Unknown")
        merchant_spending.setdefault(merchant, 0)
        merchant_spending[merchant] += t["amount"]
    top_merchants = sorted(merchant_spending.items(), key=lambda x: -x[1])[:3]
    bnpl_monthly = [user_data.get("bnplTransactions", 0) * (0.95 + 0.01*i) for i in range(6)]
    return jsonify({
        "user": {
            "name": user_data["name"],
            "age": user_data["age"],
            "memberSince": profile.get("period", {}).get("start_date", "Sep 2025") if config_data else "Sep 2025",
            "profileComplete": 92,
            "city": profile.get("city", "Bangalore"),
            "occupation": profile.get("occupation", "Software Engineer")
        },
        "financial": {
            "monthlyIncome": monthly_income,
            "totalEMI": total_emi,
            "monthlySpending": total_spending,
            "monthlySavings": monthly_savings,
            "savingsRate": round(savings_rate, 1),
            "creditUtilization": round(user_data.get("creditUtilization", 0) * 100, 1),
            "financialHealth": "Good" if savings_rate > 20 else "Fair" if savings_rate > 10 else "Needs Attention",
            "goals": financial_goals,
            "trend": historical_trend,
            "forecastNextMonthSavings": savings_forecast
        },
        "risk": {
            "score": risk_score,
            "level": risk_level,
            "color": risk_color,
            "alerts": active_alerts[:3],
            "riskTrend": "Improving" if risk_score < 50 else "Stable" if risk_score < 70 else "Concerning",
            "anomalyStats": anomaly_stats
        },
        "transactions": {
            "total": len(mock_transactions),
            "thisMonth": len([t for t in mock_transactions if t.get("date", "").startswith("2025-09")]),
            "totalAmount": sum(t["amount"] for t in mock_transactions),
            "recentTransactions": mock_transactions[:5],
            "categoryBreakdown": spending_by_category,
            "topMerchants": [{"name": name, "amount": amt} for name, amt in top_merchants],
            "bnplMonthlyTrend": bnpl_monthly
        },
        "digital": {
            "adoptionScore": user_data["digitalAdoption"],
            "status": "High" if user_data["digitalAdoption"] >= 80 else "Medium",
            "upiTransactions": upi_txn_count,
            "cardTransactions": card_txn_count,
            "bankTransfers": bank_transfer_count
        },
        "recommendations": {
            "immediate": recommendations[:2],
            "priority": "High" if len(active_alerts) > 2 else "Medium"
        },
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dataSource": "Real transactions from config.json" if config_data else "Demo data"
    })

@app.route('/api/credit-score', methods=['GET'])
def credit_score():
    profile, user_data, mock_transactions = get_current_user()
    base_score = 750
    emi_penalty = int(user_data.get('totalEMI', 0) / max(user_data.get('income', 1), 1) * 80)
    bnpl_penalty = user_data.get('bnplTransactions', 0) * 2
    utilization_penalty = int(user_data.get('creditUtilization', 0) * 50)
    credit_score = base_score - emi_penalty - bnpl_penalty - utilization_penalty
    credit_score = max(300, min(credit_score, 900))
    recommendations = []
    if credit_score < 650:
        recommendations.extend([
            "Reduce the number of BNPL (Buy Now, Pay Later) transactions.",
            "Lower your EMI commitments to improve your credit health.",
            "Maintain credit utilization below 30% of your total available credit.",
            "Pay all credit card bills and loans on time to avoid penalties.",
            "Avoid applying for multiple new loans or credit cards at once."
        ])
    elif credit_score < 750:
        recommendations.extend([
            "Keep your credit utilization low and pay off any outstanding dues promptly.",
            "Monitor BNPL and EMI transactions, and consider consolidating loans.",
            "Increase your credit limit to improve utilization ratio, if possible.",
            "Review your credit report for any errors or discrepancies."
        ])
    else:
        recommendations.extend([
            "Continue your disciplined credit and repayment behavior.",
            "Consider diversifying your credit mix for long-term score improvement.",
            "Check your credit report annually to ensure accuracy."
        ])
    return jsonify({
        "creditScore": credit_score,
        "scoreRange": "300-900",
        "riskLevel": "Low" if credit_score >= 750 else "Medium" if credit_score >= 650 else "High",
        "recommendations": recommendations,
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================
# [Insert all your helper functions here as in the original code]

# Static file routes
@app.route('/app.js')
def serve_app_js():
    return app.send_static_file('js/app.js')

@app.route('/style.css')
def serve_style_css():
    return app.send_static_file('css/style.css')

# =============================================================================
# SERVER STARTUP
# =============================================================================
# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def calculate_risk(user_data):
    """Calculate basic risk score based on user data"""
    risk_score = 0
    
    # Credit utilization impact (0-40 points)
    utilization = user_data.get('creditUtilization', 0)
    risk_score += min(utilization * 40, 40)
    
    # BNPL transactions impact (0-20 points)
    bnpl_count = user_data.get('bnplTransactions', 0)
    risk_score += min(bnpl_count * 2, 20)
    
    # Income stability impact (0-20 points)
    stability = user_data.get('incomeStability', 100)
    risk_score += max(0, (100 - stability) * 0.2)
    
    # Digital adoption (positive impact, -0 to -20 points)
    digital_adoption = user_data.get('digitalAdoption', 0)
    risk_score -= min((digital_adoption / 100) * 20, 20)
    
    return max(0, min(100, risk_score))

def calculate_comprehensive_risk(user_data):
    """Calculate comprehensive risk assessment"""
    base_score = calculate_risk(user_data)
    
    if base_score <= 30:
        level = "Low"
        color = "#22c55e"
        category = "Good"
        confidence = "High"
    elif base_score <= 70:
        level = "Medium"
        color = "#f59e0b"
        category = "Moderate"
        confidence = "Medium"
    else:
        level = "High"
        color = "#ef4444"
        category = "Critical"
        confidence = "High"
    
    factors = []
    if user_data.get('creditUtilization', 0) > 0.3:
        factors.append("High credit utilization")
    if user_data.get('bnplTransactions', 0) > 5:
        factors.append("Multiple BNPL transactions")
    if user_data.get('incomeStability', 100) < 80:
        factors.append("Income instability")
    
    return {
        "overall_score": base_score,
        "risk_level": level,
        "color": color,
        "category": category,
        "confidence": confidence,
        "factors": factors
    }

def analyze_debt_trap_risk(user_data, transactions):
    """Analyze debt trap risk factors"""
    warnings = []
    
    # Check for multiple small transactions (potential BNPL usage)
    small_txns = [t for t in transactions if t.get('amount', 0) < 5000 and t.get('type') != 'credit']
    if len(small_txns) > 10:
        warnings.append("High frequency of small transactions may indicate BNPL overuse")
    
    # Check credit utilization
    if user_data.get('creditUtilization', 0) > 0.5:
        warnings.append("Credit utilization exceeds 50% - consider reducing spending")
    
    # Check for EMI burden
    if user_data.get('totalEMI', 0) > user_data.get('income', 1) * 0.4:
        warnings.append("EMI commitments are high relative to income")
    
    return warnings if warnings else ["No immediate debt trap risks detected"]

def analyze_spending_personality(transactions, user_data):
    """Analyze spending patterns and personality"""
    if not transactions:
        return "Conservative"
    
    total_spending = sum(t.get('amount', 0) for t in transactions if t.get('type') != 'credit')
    avg_transaction = total_spending / len(transactions) if transactions else 0
    
    if avg_transaction < 1000:
        return "Frugal"
    elif avg_transaction < 5000:
        return "Balanced"
    else:
        return "Luxury-oriented"

def analyze_behavioral_patterns(transactions, user_data):
    """Analyze behavioral spending patterns"""
    insights = []
    
    # Check for frequent UPI transactions
    upi_txns = len([t for t in transactions if t.get('method') == 'UPI'])
    if upi_txns > 20:
        insights.append("High digital transaction adoption")
    
    # Check transaction timing patterns
    weekend_txns = len([t for t in transactions if datetime.strptime(t.get('date', '2025-01-01'), '%Y-%m-%d').weekday() >= 5])
    if weekend_txns > len(transactions) * 0.4:
        insights.append("Weekend spending dominance")
    
    return insights if insights else ["Regular spending patterns observed"]

def analyze_financial_trends(transactions, user_data):
    """Analyze financial trends over time"""
    return {
        "spending_trend": "Stable",
        "savings_trend": "Improving",
        "risk_trend": "Decreasing"
    }

def generate_smart_alerts(user_data, risk_assessment, debt_warnings):
    """Generate smart alerts based on risk analysis"""
    alerts = []
    
    if risk_assessment["overall_score"] > 70:
        alerts.append("High financial risk detected - immediate attention recommended")
    
    if user_data.get('creditUtilization', 0) > 0.7:
        alerts.append("Critical credit utilization level")
    
    if user_data.get('bnplTransactions', 0) > 15:
        alerts.append("Excessive BNPL usage detected")
    
    return alerts if alerts else ["No critical alerts at this time"]

def generate_actionable_recommendations(user_data, risk_assessment, spending_personality, behavioral_insights):
    """Generate personalized recommendations"""
    recommendations = []
    
    if risk_assessment["overall_score"] > 50:
        recommendations.append("Consider reducing discretionary spending by 15%")
    
    if user_data.get('creditUtilization', 0) > 0.3:
        recommendations.append("Aim to keep credit utilization below 30%")
    
    if spending_personality == "Luxury-oriented":
        recommendations.append("Review luxury expenses for potential savings opportunities")
    
    recommendations.append("Maintain emergency fund equivalent to 3 months of expenses")
    
    return recommendations

def categorize_transaction(transaction):
    """Categorize transaction based on type and merchant"""
    txn_type = transaction.get('type', '').lower()
    merchant = transaction.get('merchant', '').lower()
    
    if 'bnpl' in txn_type:
        return 'BNPL'
    elif any(keyword in merchant for keyword in ['food', 'restaurant', 'swiggy', 'zomato']):
        return 'Food'
    elif any(keyword in merchant for keyword in ['transport', 'uber', 'ola', 'fuel']):
        return 'Transport'
    elif any(keyword in merchant for keyword in ['shopping', 'amazon', 'flipkart', 'myntra']):
        return 'Shopping'
    elif any(keyword in merchant for keyword in ['entertainment', 'netflix', 'movie', 'streaming']):
        return 'Entertainment'
    else:
        return 'Other'

def assess_transaction_risk(transaction):
    """Assess risk level for individual transaction"""
    amount = transaction.get('amount', 0)
    category = transaction.get('type', '').lower()
    
    if category == 'bnpl' and amount > 3000:
        return 'High'
    elif amount > 10000:
        return 'Medium'
    else:
        return 'Low'

def generate_alerts(user_data, risk_score):
    """Generate alerts for dashboard"""
    alerts = []
    
    if risk_score > 70:
        alerts.append("High risk level detected")
    elif risk_score > 40:
        alerts.append("Medium risk level - monitor closely")
    
    if user_data.get('creditUtilization', 0) > 0.5:
        alerts.append("High credit utilization")
    
    return alerts

def generate_recommendations(user_data, risk_score):
    """Generate recommendations for dashboard"""
    recommendations = []
    
    if risk_score > 60:
        recommendations.append("Review your spending patterns")
    
    if user_data.get('bnplTransactions', 0) > 10:
        recommendations.append("Reduce BNPL transactions")
    
    recommendations.append("Maintain healthy savings rate")
    
    return recommendations
@app.route('/dashboard')
def dashboard_page():
    """Serve the Dashboard HTML page"""
    return render_template('dashboard.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 60)
    print("🚀 FINWISE AI PLATFORM STARTING...")
    print("=" * 60)
    print(f"📊 Data: {'Real from config.json' if config_data else 'Demo data'}")
    print(f"🌐 Frontend: http://localhost:{port}/")
    print(f"🔗 API: http://localhost:{port}/api/")
    print("=" * 60)
    print("🎯 Available Endpoints:")
    print("  • / - FinWise Dashboard (Frontend)")
    print("  • /api/risk-analysis - Traditional Risk Analysis")
    print("  • /api/user - User Profile")
    print("  • /api/transactions - Transaction History")
    print("  • /api/dashboard - Dashboard Data")
    print("  • /api/credit-score - Credit Score and Recommendations")
    print("=" * 60)
    app.run(
        host='0.0.0.0',
        port=port,
        debug=True
    )