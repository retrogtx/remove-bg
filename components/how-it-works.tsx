"use client"

import { motion } from 'framer-motion'

const steps = [
  { number: "01", title: "Upload Video", desc: "Drop your video with any background" },
  { number: "02", title: "AI Processing", desc: "Our AI removes the background instantly" },
  { number: "03", title: "Download", desc: "Get your video with a new background" }
]

export function HowItWorks() {
  return (
    <div className="container mx-auto px-6 py-24">
      <h2 className="text-4xl font-bold text-center text-white mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform"
          >
            <div className="text-6xl font-bold text-blue-400 mb-4">{step.number}</div>
            <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-gray-400">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 