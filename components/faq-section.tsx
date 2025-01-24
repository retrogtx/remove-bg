"use client"

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the AI background removal work?",
    answer: "The AI model from replicate analyzes each frame of your video to precisely separate the foreground from the background. It uses deep learning to understand complex scenes and maintain high quality output."
  },
  {
    question: "Is sound included?",
    answer: "We do not include the sound in the video. Coming soon!"
  },
  {
    question: "How long does processing take?",
    answer: "Most videos are processed within 30 seconds. Processing time may vary based on video length and complexity. You'll get the videos back in your dashboard."
  },
  {
    question: "What happens to my uploaded videos?",
    answer: "Your videos are processed securely and can be deleted by you. We prioritize your privacy and data security throughout the process."
  },
  {
    question: "I have more questions?",
    answer: "You can drop a message to me @amritwt on X (formerly known as Twitter)!"
  }
]

export function FaqSection() {
  return (
    <div className="container mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Frequently Asked Questions
        </h2>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-white hover:text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.div>
    </div>
  )
} 