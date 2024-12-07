import SignIn from '@/components/sign-in';
import { Footer } from '@/components/footer';
import { Zap, Shield, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Scene AI</div>
          <div className="space-x-4">
            <SignIn />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="bg-blue-500/10 rounded-full mb-6 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Instant Background Removal
          </Button>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-500">
            Replace Any Video Background
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Ditch IRL green screens, replace backgrounds, make them transparent. 
            Professional-grade AI that works with any video, no setup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className={cn(
                "text-lg relative overflow-hidden group",
                "bg-gradient-to-r from-blue-600 to-blue-500",
                "hover:from-blue-500 hover:to-blue-600",
                "border border-blue-500/20 hover:border-blue-500/50",
                "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
                "hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]",
                "transition-all duration-300"
              )}
              asChild
            >
              <SignIn />
            </Button>
            <span className="text-gray-400">Free credits to get started</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 my-16 text-gray-400 text-sm">
          <div>★★★★★ 4.9/5 Creator Rating</div>
          <div>500,000+ Backgrounds Removed</div>
          <div>Trusted by Pro Creators</div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Ditch Green Screens</h3>
            <p className="text-gray-400">
              No more green screens, replace backgrounds with any image, video, or make them transparent.
            </p>
          </div>
          <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Smart Human Tracking</h3>
            <p className="text-gray-400">
              Track humans and replace backgrounds with images, videos, or make them transparent with our model.
            </p>
          </div>
          <div className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Batch Processing</h3>
            <p className="text-gray-400">
              Process multiple videos at once. Perfect for content series and bulk editing.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold mb-16">Remove Backgrounds in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Upload Video</h3>
              <p className="text-gray-400">Drop your video with any background - green screen or natural</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p className="text-gray-400">Our AI precisely removes the background frame by frame</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Download</h3>
              <p className="text-gray-400">Get your video with transparent or custom background</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center bg-gradient-to-b from-blue-500/10 to-transparent p-12 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Removing Video Backgrounds
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join creators who trust Scene AI for professional background removal.
          </p>
          <Button 
            size="lg" 
            className={cn(
              "text-lg relative overflow-hidden group",
              "bg-gradient-to-r from-blue-600 to-blue-500",
              "hover:from-blue-500 hover:to-blue-600",
              "border border-blue-500/20 hover:border-blue-500/50",
              "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
              "hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]",
              "transition-all duration-300"
            )}
            asChild
          >
            <SignIn />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
