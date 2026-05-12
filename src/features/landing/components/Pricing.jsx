import React from "react";

const Pricing = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <i className="fas fa-tags text-blue-600 dark:text-blue-400"></i>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Flexible Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Select the plan that fits your clinic's needs best
          </p>
          
          {/* Toggle for Monthly/Yearly */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">Monthly</span>
            <div className="relative">
              <div className="w-14 h-8 flex items-center bg-blue-300 dark:bg-blue-700 rounded-full p-1 cursor-pointer">
                <div className="bg-white dark:bg-gray-800 w-6 h-6 rounded-full shadow-md transform translate-x-6"></div>
              </div>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              Annual <span className="text-green-600 dark:text-green-400 font-semibold">(Save 17%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Trial Plan */}
            <div className="group">
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-100 dark:border-gray-700 p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-600">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                    <i className="fas fa-gem text-blue-500 dark:text-blue-400"></i>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Starter</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Free Trial</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">₱0</span>
                    <span className="text-blue-500 dark:text-blue-400">/forever</span>
                  </div>
                  <p className="text-blue-500 dark:text-blue-400 text-sm">Card only - No commitment</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300">Card only</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-70">
                    <i className="fas fa-times-circle text-red-400 dark:text-red-500"></i>
                    <span className="text-blue-500 dark:text-blue-400">Cannot change profile</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-70">
                    <i className="fas fa-times-circle text-red-400 dark:text-red-500"></i>
                    <span className="text-blue-500 dark:text-blue-400">Cannot add doctors</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-70">
                    <i className="fas fa-times-circle text-red-400 dark:text-red-500"></i>
                    <span className="text-blue-500 dark:text-blue-400">Cannot add clinics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300">Manage Dx/Tx: cannot add diagnosis/treatment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300">Can add: fee, lab result, prescription, certificate</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-70">
                    <i className="fas fa-times-circle text-red-400 dark:text-red-500"></i>
                    <span className="text-blue-500 dark:text-blue-400">No dashboard access</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-70">
                    <i className="fas fa-times-circle text-red-400 dark:text-red-500"></i>
                    <span className="text-blue-500 dark:text-blue-400">Cannot add appointments</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button className="w-full py-3 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800 dark:hover:to-blue-700 transition-all duration-300">
                  <i className="fas fa-rocket mr-2"></i>
                  Start Free Trial
                </button>

                {/* Note */}
                <p className="text-center text-blue-500 dark:text-blue-400 text-sm mt-4">
                  Card Only
                </p>
              </div>
            </div>

            {/* Monthly Plan (Most Popular) */}
            <div className="group relative">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-sm font-semibold rounded-full shadow-lg">
                  <i className="fas fa-crown mr-2"></i>
                  Most Popular
                </div>
              </div>
              
              <div className="h-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-blue-300 dark:border-blue-600 p-8 shadow-xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full opacity-20"></div>
                <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-blue-200 dark:bg-blue-900/30 rounded-full opacity-20"></div>

                {/* Plan Header */}
                <div className="text-center mb-8 relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                    <i className="fas fa-bolt text-blue-600 dark:text-blue-400"></i>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Professional</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Monthly Plan</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">₱499</span>
                    <span className="text-blue-500 dark:text-blue-400">/month</span>
                  </div>
                  <p className="text-blue-500 dark:text-blue-400 text-sm">Ideal for growing clinics</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 relative z-10">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Access dashboard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Access & change profile info</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Can add doctors & clinics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">See patient records</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Manage Dx/Tx: can add everything</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Can add appointments (with limitations)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">5 user access</span>
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
                </ul>

                {/* CTA Button */}
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-300 shadow-md relative z-10">
                  <i className="fas fa-play-circle mr-2"></i>
                  Subscribe Now
                </button>

                {/* Note */}
                <p className="text-center text-blue-500 dark:text-blue-400 text-sm mt-4">
                  Billed monthly, cancel anytime
                </p>
              </div>
            </div>

            {/* Annual Plan */}
            <div className="group">
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-100 dark:border-gray-700 p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-600">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                    <i className="fas fa-award text-blue-500 dark:text-blue-400"></i>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Enterprise</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Annual Plan</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">₱4,999</span>
                    <span className="text-blue-500 dark:text-blue-400">/year</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                    <i className="fas fa-gift text-green-600 dark:text-green-400"></i>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">Save 17%</span>
                  </div>
                  <p className="text-blue-500 dark:text-blue-400 text-sm">Best value for established clinics</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Everything from Monthly Plan</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">No limitations on appointments</span>
                  </li>
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
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-blue-500 dark:text-blue-400"></i>
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Up to 10 users</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-300 shadow-md">
                  <i className="fas fa-calendar-check mr-2"></i>
                  Subscribe Now
                </button>

                {/* Note */}
                <p className="text-center text-blue-500 dark:text-blue-400 text-sm mt-4">
                  Equivalent to ₱416/month
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <i className="fas fa-shield-alt text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-300">Secure Payment</p>
                <p className="text-sm text-blue-500 dark:text-blue-400">256-bit encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <i className="fas fa-headset text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-300">24/7 Support</p>
                <p className="text-sm text-blue-500 dark:text-blue-400">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <i className="fas fa-sync-alt text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-300">30-day Refund</p>
                <p className="text-sm text-blue-500 dark:text-blue-400">Money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;