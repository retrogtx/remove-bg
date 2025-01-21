"use client"

import { motion } from 'framer-motion'

const stats = [
  { 
    label: "Processing Time", 
    value: "30 seconds", 
    description: "Average processing time per video",
    icon: "⚡"
  },
  { 
    label: "Success Rate", 
    value: "99.9%", 
    description: "Videos processed successfully",
    icon: "✨"
  },
  { 
    label: "Video Quality", 
    value: "HD Ready", 
    description: "Up to 1080p resolution supported",
    icon: "🎥"
  },
  { 
    label: "File Support", 
    value: "100MB", 
    description: "Maximum file size per video",
    icon: "📁"
  }
]

export function StatsSection() {
  return (
    <div className="py-20 container mx-auto px-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative p-6 backdrop-blur-sm bg-black/40 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="text-3xl mb-4">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-400 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500">
                {stat.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 