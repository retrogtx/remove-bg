"use client"

import { motion } from 'framer-motion'

const stats = [
  { label: "Creator Rating", value: "4.9/5", prefix: "★★★★★" },
  { label: "Backgrounds Removed", value: "500,000+" },
  { label: "Pro Creators", value: "Trusted by" }
]

export function StatsSection() {
  return (
    <div className="flex flex-wrap justify-center gap-8 my-20 container mx-auto px-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="backdrop-blur-sm bg-gradient-to-br from-gray-900/90 to-gray-900/50 py-4 px-8 rounded-2xl border border-gray-800 hover:border-blue-500 transition-all"
        >
          {stat.prefix && (
            <span className="text-blue-400 mr-2">{stat.prefix}</span>
          )}
          <span className="text-gray-300 font-medium">{stat.value}</span>
        </motion.div>
      ))}
    </div>
  )
} 