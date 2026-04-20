import React from "react";
import { Link } from "react-router-dom";

import { useState } from "react";

import SubscriptionModal from "../modal/SubscriptionModal";


const Hero = ({ openAuthModal }) => {
  const [showSubscription, setShowSubscription] = useState(false);

  return (
    
    <section className="relative bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center">
      <SubscriptionModal
  isOpen={showSubscription}
  onClose={() => setShowSubscription(false)}
  openAuthModal={openAuthModal}
/>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <div className="inline-block px-4 py-2 mb-6 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              Smart Clinic Queue System
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Modern Queue Management
              <span className="block text-blue-600">
                for Growing Clinics
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Manage patients, reduce waiting time, and improve clinic efficiency
              with real-time queue tracking and intelligent scheduling.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              
              {/* PRIMARY CTA */}
              <button
                onClick={() => openAuthModal("register")}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
              >
                Use Free Plan
              </button>

              {/* SECONDARY CTA */}
              <button
                onClick={() => setShowSubscription(true)}
                className="flex-1 py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white font-bold rounded-xl hover:from-blue-900 hover:to-blue-950 transition-all duration-300 shadow-lg"
              >
                View Subscription
              </button>


            </div>

          </div>

          {/* RIGHT SIDE - CLEAN VISUAL */}
{/* RIGHT SIDE - ENHANCED VISUAL */}
<div className="relative">

  <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 space-y-6">

    {/* Header */}
    <div>
      <h3 className="text-xl font-semibold text-gray-800">
        Live Clinic Activity
      </h3>
      <p className="text-sm text-gray-500">
        Appointments & Queue status in real-time
      </p>
    </div>

    {/* Appointment Summary */}
    <div className="grid grid-cols-2 gap-4">

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-blue-600">12</p>
        <p className="text-sm text-gray-600">Today's Appointments</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-indigo-600">23</p>
        <p className="text-sm text-gray-600">Total Scheduled</p>
      </div>

    </div>

    {/* Divider */}
    <div className="border-t border-blue-100"></div>

    {/* Queue Overview */}
    <div className="space-y-4">

      {/* Normal Queue */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-800">
            Normal Queue
          </span>
          <span className="text-blue-600 font-bold">
            8 waiting
          </span>
        </div>

        <div className="h-2 bg-blue-200 rounded-full">
          <div className="h-full bg-blue-600 rounded-full w-2/3"></div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          2 In Progress • Avg wait: 10 mins
        </div>
      </div>

      {/* Priority Queue */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-800">
            Priority Queue
          </span>
          <span className="text-blue-600 font-bold">
            3 waiting
          </span>
        </div>

        <div className="h-2 bg-blue-200 rounded-full">
          <div className="h-full bg-blue-600 rounded-full w-1/3"></div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          1 In Progress • Avg wait: 5 mins
        </div>
      </div>

    </div>

    {/* Current Serving */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-5 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">Now Serving</p>
          <p className="text-xl font-bold">Queue #142</p>
          <p className="text-xs opacity-80">Dr. Carlo Bilbao</p>
        </div>

        <div className="text-right">
          <p className="text-sm opacity-80">Estimated Next</p>
          <p className="font-semibold">5 mins</p>
        </div>
      </div>
    </div>

  </div>

  {/* Floating Trial Badge */}
  <div className="absolute -top-6 -right-6 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl text-center">
    <p className="text-sm">7 Days</p>
    <p className="text-xl font-bold">FREE</p>
  </div>

</div>


        </div>
      </div>
    </section>
  );
};

export default Hero;
