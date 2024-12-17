import SignIn from '@/components/sign-in';
import { Footer } from '@/components/footer';
import { Zap, Shield, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Base dark gradient layer */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black" />
      
      {/* Grid pattern with optimized rendering */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] will-change-transform" />
      
      {/* Animated gradient with performance optimizations */}
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-gradient-slow will-change-transform" />
      
      {/* Content container */}
      <div className="relative z-10">
        <nav className="container mx-auto px-6 py-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
              Scene AI
            </div>
            <div className="space-x-4">
              <SignIn />
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-16">
          {/* Enhanced Hero Section */}
          <div className="text-center max-w-4xl mx-auto relative">
            {/* Improved blur effects */}
            <div className="absolute top-[-120px] -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse-slow" />
            <div className="absolute top-[-120px] -right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse-slow" />
            
            <Button 
              variant="ghost" 
              className="bg-blue-500/10 rounded-full mb-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 hover:scale-105 transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Instant Background Removal
              <ArrowRight className="w-4 h-4 ml-2 opacity-100 translate-x-1 transition-all" />
            </Button>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-blue-600 animate-gradient leading-tight">
              Replace Any Video Background
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Ditch IRL green screens, replace backgrounds, make them transparent. 
              Professional-grade AI that works with any video, no setup required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <div>
                <SignIn />
              </div>
              <span className="text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Cost effective!
              </span>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="flex flex-wrap justify-center gap-8 my-20 text-gray-400 text-sm">
            <div className="backdrop-blur-sm bg-gray-900/30 py-4 px-6 rounded-2xl hover:bg-gray-800/40 transition-colors hover:text-blue-400 cursor-default group">
              <span className="text-blue-400 mr-2">★★★★★</span>
              <span className="group-hover:underline">4.9/5 Creator Rating</span>
            </div>
            <div className="backdrop-blur-sm bg-gray-900/30 py-4 px-6 rounded-2xl hover:bg-gray-800/40 transition-colors hover:text-blue-400 cursor-default">
              500,000+ Backgrounds Removed
            </div>
            <div className="backdrop-blur-sm bg-gray-900/30 py-4 px-6 rounded-2xl hover:bg-gray-800/40 transition-colors hover:text-blue-400 cursor-default">
              Trusted by Pro Creators
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32">
            {[
              { icon: Zap, title: "Ditch Green Screens", desc: "No more green screens, replace backgrounds with any image, video, or make them transparent." },
              { icon: Shield, title: "Smart Human Tracking", desc: "Track humans and replace backgrounds with images, videos, or make them transparent with our model." },
              { icon: Clock, title: "Batch Processing", desc: "Process multiple videos at once. Perfect for content series and bulk editing." }
            ].map((feature, i) => (
              <div key={i} 
                className="group p-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-blue-500/20 transition-colors relative">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="mt-48 mb-32 relative">
            <h2 className="text-3xl font-medium text-center mb-24 tracking-tight">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-24 relative max-w-5xl mx-auto px-6">
              {[
                {
                  num: "01",
                  title: "Upload Video",
                  desc: "Drop your video with any background",
                },
                {
                  num: "02",
                  title: "AI Processing",
                  desc: "Our AI removes the background instantly",
                },
                {
                  num: "03",
                  title: "Download",
                  desc: "Get your video with a new background",
                }
              ].map((step, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-start"
                >
                  {/* Step number with gradient */}
                  <div className="text-sm font-light mb-8 bg-gradient-to-r from-blue-400/40 to-purple-400/40 bg-clip-text text-transparent tracking-wider">
                    {step.num}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-medium mb-3 text-white/90 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Subtle hover effect with gradient border */}
                  <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" />
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-40 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent rounded-3xl" />
            <div className="relative bg-gradient-to-b from-gray-900/50 to-transparent p-16 rounded-3xl border border-blue-500/20 hover:border-blue-500/30 transition-colors backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Start Removing Video Backgrounds
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join creators who trust Scene AI for professional background removal.
              </p>
              <div>
                <SignIn />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
