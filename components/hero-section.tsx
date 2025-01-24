"use client";

import SignIn from '@/components/sign-in';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-16 py-24 container mx-auto px-6">
      <motion.div
        className="flex-1 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold mb-8 text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI-Powered Background Removal
          </span>
          {" "}for Your Videos
        </h1>

        <p className="text-xl text-gray-300 mb-10">
          Replace backgrounds instantly with green screen / foreground mask / alpha mask. 
          Professional-grade AI model that works with any video, no setup required.
        </p>

        <div className="flex gap-4 items-center">
          <SignIn />
          <span className="text-gray-400">No credit card required</span>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-2xl border border-gray-800">
          {/* Replace the video element with the Vimeo embed */}
          <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
            <iframe
              src="https://player.vimeo.com/video/1049911658?badge=0&autopause=0&player_id=0&app_id=58479"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              title="Scene AI"
            ></iframe>
          </div>
          <script src="https://player.vimeo.com/api/player.js"></script>
        </div>
      </motion.div>
    </div>
  );
}