"use client"

import { motion } from 'framer-motion'
import SignIn from './sign-in'

export function PricingSection() {
  return (
    <div className="container mx-auto px-6 py-24">
      <motion.div 
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-4xl font-bold mb-6">
            Start Creating Now
          </h2>
          <div className="text-6xl font-bold mb-6">
            <span className="text-yellow-400">25 credits</span>
            <span className="text-2xl text-gray-400"> for </span>
            <span className="text-yellow-400">$7</span>
          </div>
          <p className="text-gray-300 mb-8 text-lg">
            Sign in with Google to get started. Early users get special perks!
          </p>
          <div className="flex justify-center">
            <SignIn />
          </div>
        </div>
      </motion.div>
    </div>
  )
} 