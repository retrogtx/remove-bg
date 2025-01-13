"use client"

import SignIn from '@/components/sign-in'

export function HeroSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-16 py-24 container mx-auto px-6">
      <div className="flex-1 max-w-2xl">
        <h1 className="text-5xl font-bold mb-8 text-white">
          Elevate Your Videos with AI-Powered Background Removal
        </h1>
        
        <p className="text-xl text-gray-300 mb-10">
          Ditch IRL green screens, replace backgrounds with green screen / foreground mask / alpha mask. Professional-grade AI model that works with any video, no setup required. All in seconds.
        </p>

        <SignIn />
      </div>

      <div className="flex-1 w-full max-w-2xl">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800 shadow-2xl border border-gray-700">
          {/* Placeholder for image or video */}
        </div>
      </div>
    </div>
  )
} 