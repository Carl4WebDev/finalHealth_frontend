import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PrintButtonPdf from "../../../../components/PrintButtonPdf.jsx";
import StripeCardPayment from "./components/StripeCardPayment.jsx";
import { useSubscription } from "../../context/subscriptions/useSubscription.js";

const SubscriptionView = () => {
  const {
    plans,
    subscription,
    plan,
    loadPlans,
    loadMySubscription,
    cancelSubscription,
  } = useSubscription();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  // Load subscription status from localStorage on mount
  useEffect(() => {
    loadPlans();
    loadMySubscription();
    
    // Check if user just completed subscription
    const justSubscribed = localStorage.getItem('justSubscribed');
    const savedStatus = localStorage.getItem('subscriptionStatus');
    
    if (justSubscribed === 'true') {
      setSubscriptionStatus('active');
      localStorage.removeItem('justSubscribed');
    } else if (savedStatus) {
      setSubscriptionStatus(savedStatus);
    }
  }, []);

  // Save subscription status whenever it changes
  useEffect(() => {
    if (subscriptionStatus) {
      localStorage.setItem('subscriptionStatus', subscriptionStatus);
    }
  }, [subscriptionStatus]);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentStep(plan.planType === "free" ? 4 : 3);
  };

  const resetToStart = () => {
    setCurrentStep(1);
    setSelectedPlan(null);
    setShowModal(false);
    setShowReceipt(false);
  };

  const handlePaymentSuccess = (transactionData) => {
    setTransactionData({
      transactionId: `TXN-${Date.now()}`,
      paymentMethod: "Credit Card",
      timestamp: new Date().toISOString(),
      ...transactionData
    });
    
    // Set subscription as active
    setSubscriptionStatus('active');
    localStorage.setItem('justSubscribed', 'true');
    
    setModalContent({
      title: "🎉 Subscription Activated!",
      message: "Your subscription is now active. Welcome to premium features!",
      showReceiptButton: true,
      icon: "party"
    });
    setShowModal(true);
    
    loadMySubscription();
  };

  const showReceiptView = () => {
    setShowReceipt(true);
    setShowModal(false);
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription?",
    );
    if (!confirmed) return;

    await cancelSubscription();

    setSubscriptionStatus('cancelled');
    setModalContent({
      title: "Subscription Cancelled",
      message: "Your subscription has been cancelled. You can still use your plan until the end of the billing period.",
      icon: "info"
    });
    setShowModal(true);
  };

  const handleUpgradePlan = (planType) => {
    const upgradePlan = plans.find(p => p.planType === planType);
    if (upgradePlan) {
      setSelectedPlan(upgradePlan);
      setCurrentStep(3);
      setShowUpgradeOptions(false);
    }
  };

  // Receipt Component
  const ReceiptComponent = ({ subscription, plan, transactionData }) => {
    const receiptData = {
      receiptId: `SUB${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      transactionId: transactionData?.transactionId || `TXN-${Date.now()}`,
      paymentMethod: transactionData?.paymentMethod || "Credit Card",
      status: "Completed"
    };

    const calculateVAT = (amount) => {
      const vatRate = 0.12;
      return (amount * vatRate).toFixed(2);
    };

    const totalAmount = plan?.price || 0;
    const vatAmount = calculateVAT(totalAmount);
    const subtotal = (totalAmount - parseFloat(vatAmount)).toFixed(2);
    const formattedTotal = parseFloat(totalAmount).toFixed(2);

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border-2 border-blue-100 dark:border-gray-700">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="inline-flex items-center bg-blue-500/20 px-3 py-1 rounded-full text-sm font-semibold">
                  <i className="fas fa-circle text-xs mr-2"></i> Active
                </span>
              </div>
              <div className="text-right">
                <span className="text-blue-200 text-sm">Receipt</span>
                <div className="text-lg font-semibold">#{receiptData.receiptId}</div>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{plan?.planName || "Annual Plan"}</h1>
            <p className="text-blue-100">
              ₱{plan?.price || "4,999"} · {plan?.maxNumberUsers || "5"} user(s) · {plan?.maxNumberPatient || "100"} patients
            </p>
            <p className="text-blue-200 text-sm italic mt-1">
              {plan?.description || "Annual subscription plan"}
            </p>
          </div>

          <div className="p-6">
            {/* Company Info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Acme Solutions Inc.</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Main Street, 10115 Metro Manila • PH123456789
                </p>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="mb-8">
              <div className="text-center bg-blue-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  Subscription Payment Receipt
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <i className="far fa-calendar-alt mr-2"></i>
                  {receiptData.date}
                </p>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <i className="fas fa-file-invoice-dollar text-blue-500 mr-2"></i>
                  Subscription Items
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="text-left p-3 text-gray-700 dark:text-gray-300 font-semibold">Description</th>
                        <th className="text-left p-3 text-gray-700 dark:text-gray-300 font-semibold">Quantity</th>
                        <th className="text-left p-3 text-gray-700 dark:text-gray-300 font-semibold">Unit Price</th>
                        <th className="text-left p-3 text-gray-700 dark:text-gray-300 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-3">
                          <div className="flex items-center">
                            <i className="fas fa-crown text-blue-500 mr-2"></i>
                            <span className="font-medium">{plan?.planName || "Annual Plan Subscription"}</span>
                          </div>
                        </td>
                        <td className="p-3">1</td>
                        <td className="p-3">₱{plan?.price || "4,999.00"}</td>
                        <td className="p-3 font-semibold">₱{plan?.price || "4,999.00"}</td>
                      </tr>
                      
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td colSpan="3" className="p-3 text-right font-semibold">Subtotal:</td>
                        <td className="p-3 font-semibold">₱{subtotal}</td>
                      </tr>
                      
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td colSpan="3" className="p-3 text-right font-semibold">VAT (12%):</td>
                        <td className="p-3 font-semibold">₱{vatAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 font-semibold">Total Payment</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Including all taxes</p>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ₱{formattedTotal}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                <p>This receipt was generated with the help of our partner, SecurePay Solutions</p>
                <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <div className="flex items-center justify-center mb-2">
                    <i className="fas fa-leaf text-green-500 text-xl mr-2"></i>
                    <span className="font-semibold text-green-700 dark:text-green-300">Eco-friendly digital receipt</span>
                  </div>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    By using this digital receipt, you are saving paper and reducing CO₂ emissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Button */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setShowReceipt(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center transition-all hover:scale-105"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  };

  // If receipt should be shown, display the receipt component
  if (showReceipt) {
    return (
      <Layout>
        <ReceiptComponent 
          subscription={subscription}
          plan={selectedPlan || plan}
          transactionData={transactionData}
        />
      </Layout>
    );
  }

  // User has an active subscription - Show Subscription Status Card
  if (subscription || subscriptionStatus === 'active') {
    const today = new Date().toISOString().slice(0, 10);
    const isExpired = subscription?.endDate < today;

    const planType = plan?.planType;
    const planBadgeClass =
      planType === "free"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
        : planType === "monthly"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        : planType === "yearly"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";

    // Get plan benefits based on plan type
    const getPlanBenefits = () => {
      switch(planType) {
        case "monthly":
          return [
            "Full feature access",
            "Priority support",
            "Cancel anytime",
            "Data backup",
            "5 users included"
          ];
        case "yearly":
          return [
            "Full feature access + analytics",
            "24/7 priority support",
            "2 months free",
            "Custom integrations",
            "Dedicated account manager",
            "Up to 10 users"
          ];
        case "free":
          return [
            "Basic clinic tools",
            "Limited support",
            "No commitment",
            "1 user access"
          ];
        default:
          return ["Premium features", "Priority support"];
      }
    };

    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
          {/* Subscription Status Header */}
          <div className="max-w-6xl mx-auto">
            {/* Celebration Banner (shown for 7 days after subscription) */}
            {subscriptionStatus === 'active' && Date.now() - new Date(subscription?.startDate || Date.now()).getTime() < 7 * 24 * 60 * 60 * 1000 && (
              <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-3 rounded-full mr-4">
                      <i className="fas fa-trophy text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">🎉 Welcome to Premium!</h3>
                      <p className="opacity-90">Your subscription is now active. Enjoy exclusive features!</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowReceipt(true)}
                    className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Subscription Card */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-blue-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <i className="fas fa-crown text-blue-600 dark:text-blue-400"></i>
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          {planType === 'yearly' ? 'Premium Annual' : planType === 'monthly' ? 'Premium Monthly' : 'Free Plan'}
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">
                        You're Subscribed! 🎉
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Welcome to your {plan?.planName || 'Premium'} plan
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                          isExpired
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {isExpired ? "Expired" : "Active"}
                      </span>
                      <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ₱{plan?.price}/<span className="text-lg">{planType === 'yearly' ? 'year' : 'month'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan Benefits */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                      Your Plan Includes:
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {getPlanBenefits().map((benefit, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <i className="fas fa-check-circle text-green-500 mr-3"></i>
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subscription Details */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      Subscription Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                          <span className="font-semibold">{plan?.planName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {subscription?.status || 'Active'}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-400">Users:</span>
                          <span className="font-semibold">{plan?.maxNumberUsers} users</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                          <span className="font-semibold">{subscription?.startDate || '2026-01-22'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                          <span className="font-semibold">{subscription?.endDate || '2027-01-22'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600 dark:text-gray-400">Auto-renew:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {subscription?.autoRenew ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setShowReceipt(true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      <i className="fas fa-receipt mr-2"></i>
                      View Receipt
                    </button>
                    <button
                      onClick={() => setShowUpgradeOptions(true)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      <i className="fas fa-sync-alt mr-2"></i>
                      Change Plan
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      <i className="fas fa-times-circle mr-2"></i>
                      Cancel Subscription
                    </button>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-blue-100 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                    Your Usage
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {Math.floor(plan?.maxNumberUsers / 2)}/{plan?.maxNumberUsers}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">Active Users</p>
                      <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full w-1/2"></div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        45/{plan?.maxNumberPatient}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">Patients</p>
                      <div className="mt-2 h-2 bg-green-200 dark:bg-green-800 rounded-full">
                        <div className="h-full bg-green-500 rounded-full w-1/3"></div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {planType === 'yearly' ? '12' : '1'}/12
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">Months Remaining</p>
                      <div className="mt-2 h-2 bg-purple-200 dark:bg-purple-800 rounded-full">
                        <div className="h-full bg-purple-500 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade Options Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-b from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-2xl shadow-xl p-6 mb-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                      <i className="fas fa-rocket text-xl"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Upgrade & Save!</h3>
                    <p className="text-blue-100">Get more features for your growing clinic</p>
                  </div>
                  
                  <button
                    onClick={() => handleUpgradePlan('yearly')}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-semibold transition-colors mb-4 flex items-center justify-center"
                  >
                    <i className="fas fa-calendar-star mr-2"></i>
                    Switch to Annual
                  </button>
                  
                  <div className="text-center text-blue-200 text-sm">
                    <i className="fas fa-gift mr-1"></i>
                    Save 17% with annual billing
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-blue-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <i className="fas fa-user-plus text-blue-500 mr-3"></i>
                      <span className="text-gray-700 dark:text-gray-300">Add Team Member</span>
                    </button>
                    <button className="w-full flex items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <i className="fas fa-chart-line text-green-500 mr-3"></i>
                      <span className="text-gray-700 dark:text-gray-300">View Analytics</span>
                    </button>
                    <button 
                      onClick={() => setShowReceipt(true)}
                      className="w-full flex items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <i className="fas fa-file-invoice text-purple-500 mr-3"></i>
                      <span className="text-gray-700 dark:text-gray-300">Billing History</span>
                    </button>
                    <button className="w-full flex items-center p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <i className="fas fa-cog text-gray-500 mr-3"></i>
                      <span className="text-gray-700 dark:text-gray-300">Subscription Settings</span>
                    </button>
                  </div>
                </div>

                {/* Next Billing */}
                <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-calendar-check text-2xl mr-3"></i>
                    <div>
                      <h4 className="font-semibold">Next Billing Date</h4>
                      <p className="text-sm opacity-90">{subscription?.endDate || '2027-01-22'}</p>
                    </div>
                  </div>
                  <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg font-medium transition-colors">
                    Update Payment Method
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Options Modal */}
          {showUpgradeOptions && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-xl border-2 border-blue-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Upgrade Your Plan</h3>
                  <button
                    onClick={() => setShowUpgradeOptions(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Choose a plan that better fits your needs. Upgrading is instant!
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {plans.filter(p => p.planType !== planType).map((upgradePlan) => (
                    <div
                      key={upgradePlan.planId}
                      className={`border-2 rounded-xl p-6 transition-all hover:scale-[1.02] ${
                        upgradePlan.planType === 'yearly'
                          ? 'border-yellow-300 dark:border-yellow-500 bg-gradient-to-b from-yellow-50 to-white dark:from-gray-800 dark:to-gray-900'
                          : 'border-blue-200 dark:border-blue-600 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-sm font-semibold ${
                          upgradePlan.planType === 'yearly'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }">
                          {upgradePlan.planType === 'yearly' ? 'Annual' : 'Monthly'}
                        </div>
                        <div className="text-3xl font-bold text-gray-800 dark:text-white">
                          ₱{upgradePlan.price}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          per {upgradePlan.planType === 'yearly' ? 'year' : 'month'}
                        </div>
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <i className="fas fa-check text-green-500 mr-2"></i>
                          <span>{upgradePlan.maxNumberUsers} users</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-check text-green-500 mr-2"></i>
                          <span>{upgradePlan.maxNumberPatient} patients</span>
                        </li>
                        {upgradePlan.planType === 'yearly' && (
                          <li className="flex items-center">
                            <i className="fas fa-gift text-yellow-500 mr-2"></i>
                            <span>Save 17% annually</span>
                          </li>
                        )}
                      </ul>
                      
                      <button
                        onClick={() => handleUpgradePlan(upgradePlan.planType)}
                        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                          upgradePlan.planType === 'yearly'
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        Switch to {upgradePlan.planType === 'yearly' ? 'Annual' : 'Monthly'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showModal && <Modal {...modalContent} onClose={resetToStart} showReceiptView={showReceiptView} />}
        </div>
      </Layout>
    );
  }

  // Original subscription selection view (for new users)
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {currentStep === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 text-center mb-3">
                Choose Your Plan
              </h1>

              <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                Select the plan that fits your clinic's needs best
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((p) => {
                  const isPopular = p.planType === "monthly";
                  
                  return (
                    <div
                      key={p.planId}
                      className={`group ${isPopular ? 'relative' : ''}`}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm font-semibold rounded-full shadow-lg">
                            <i className="fas fa-crown mr-2"></i>
                            Most Popular
                          </div>
                        </div>
                      )}
                      
                      <div className={`h-full rounded-2xl border-2 p-8 transition-all duration-300 ${
                        isPopular 
                          ? "bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-blue-300 dark:border-blue-600 shadow-xl transform hover:scale-[1.02] relative overflow-hidden" 
                          : "bg-white dark:bg-gray-800 border-blue-100 dark:border-gray-700 shadow-lg hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-600"
                      }`}>
                        
                        {isPopular && (
                          <>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full opacity-20"></div>
                            <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-blue-200 dark:bg-blue-900/30 rounded-full opacity-20"></div>
                          </>
                        )}

                        <div className="text-center mb-8 relative z-10">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                            <i className={`fas ${
                              p.planType === "free" ? "fa-gem" :
                              p.planType === "monthly" ? "fa-bolt" :
                              "fa-award"
                            } text-blue-500 dark:text-blue-400`}></i>
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                              {p.planType === "free" ? "Starter" : 
                               p.planType === "monthly" ? "Professional" : 
                               "Enterprise"}
                            </span>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            {p.planType === "free" ? "Free Trial" : 
                             p.planType === "monthly" ? "Monthly Plan" : 
                             "Annual Plan"}
                          </h3>
                          
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">₱{p.price}</span>
                            <span className="text-blue-500 dark:text-blue-400">
                              {p.planType === "yearly" ? "/year" : 
                               p.planType === "monthly" ? "/month" : 
                               "/forever"}
                            </span>
                          </div>

                          {p.planType === "yearly" && (
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                              <i className="fas fa-gift text-green-600 dark:text-green-400"></i>
                              <span className="text-sm font-semibold text-green-700 dark:text-green-300">Save 17%</span>
                            </div>
                          )}

                          <p className="text-blue-500 dark:text-blue-400 text-sm">
                            {p.planType === "free" ? "Perfect for trying out our platform" : 
                             p.planType === "monthly" ? "Ideal for growing clinics" : 
                             "Best value for established clinics"}
                          </p>
                        </div>

                        <ul className="space-y-4 mb-8 relative z-10">
                          <li className="flex items-center gap-3">
                            <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                            <span className="text-blue-700 dark:text-blue-300">{p.maxNumberUsers} user access</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                            <span className="text-blue-700 dark:text-blue-300">Up to {p.maxNumberPatient} patients</span>
                          </li>
                          
                          {p.planType === "free" ? (
                            <>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300">Basic clinic tools</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300">Limited support</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300">No commitment</span>
                              </li>
                              <li className="flex items-center gap-3 opacity-50">
                                <i className="fas fa-times-circle text-blue-300 dark:text-blue-700"></i>
                                <span className="text-blue-400 dark:text-blue-500">Advanced analytics</span>
                              </li>
                              <li className="flex items-center gap-3 opacity-50">
                                <i className="fas fa-times-circle text-blue-300 dark:text-blue-700"></i>
                                <span className="text-blue-400 dark:text-blue-500">Priority support</span>
                              </li>
                            </>
                          ) : p.planType === "monthly" ? (
                            <>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Full feature access</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Priority support</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Cancel anytime</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Data backup</span>
                              </li>
                              <li className="flex items-center gap-3 opacity-50">
                                <i className="fas fa-times-circle text-blue-300 dark:text-blue-700"></i>
                                <span className="text-blue-400 dark:text-blue-500">Advanced analytics</span>
                              </li>
                            </>
                          ) : (
                            <>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Full feature access + analytics</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">24/7 priority support</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">2 months free</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Custom integrations</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                                <span className="text-blue-700 dark:text-blue-300 font-medium">Dedicated account manager</span>
                              </li>
                            </>
                          )}
                        </ul>

                        <button
                          onClick={() => handleSelectPlan(p)}
                          disabled={p.planType === "free"}
                          className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 relative z-10 ${
                            p.planType === "free"
                              ? "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 cursor-not-allowed"
                              : isPopular
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 shadow-md"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 shadow-md"
                          }`}
                        >
                          <i className={`fas ${
                            p.planType === "free" ? "fa-rocket" :
                            p.planType === "monthly" ? "fa-play-circle" :
                            "fa-calendar-check"
                          } mr-2`}></i>
                          {p.planType === "free" ? "Current Plan" : "Subscribe Now"}
                        </button>

                        <p className="text-center text-blue-500 dark:text-blue-400 text-sm mt-4">
                          {p.planType === "free" ? "No credit card required" :
                           p.planType === "monthly" ? "Billed monthly, cancel anytime" :
                           `Equivalent to ₱${Math.round(p.price / 12)}/month`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && selectedPlan && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border-2 border-blue-100 dark:border-gray-700">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  <i className="fas fa-credit-card text-blue-600 dark:text-blue-400"></i>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Secure Payment</span>
                </div>
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Complete Your Subscription
                </h1>
                <p className="text-blue-500 dark:text-blue-400">
                  You're subscribing to: <strong>{selectedPlan.planName}</strong>
                </p>
              </div>

              <StripeCardPayment
                planId={selectedPlan.planId}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          )}
        </div>
      </div>

      {showModal && <Modal {...modalContent} onClose={resetToStart} showReceiptView={showReceiptView} />}
    </Layout>
  );
};

// Updated Modal Component
const Modal = ({ title, message, onClose, showReceiptButton, showReceiptView, icon }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-xl text-center border-2 border-blue-100 dark:border-gray-700">
      {icon === "party" ? (
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-party-horn text-white text-2xl"></i>
        </div>
      ) : (
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check-circle text-blue-500 dark:text-blue-400 text-2xl"></i>
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      
      <div className="flex flex-col gap-3">
        {showReceiptButton && (
          <button
            onClick={showReceiptView}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            <i className="fas fa-receipt mr-2"></i>
            View Receipt
          </button>
        )}
        
        <button
          onClick={onClose}
          className={`w-full ${
            showReceiptButton 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          } text-white py-3 rounded-lg font-semibold transition-colors`}
        >
          {showReceiptButton ? "Continue to Dashboard" : "Done"}
        </button>
      </div>
    </div>
  </div>
);

export default SubscriptionView;