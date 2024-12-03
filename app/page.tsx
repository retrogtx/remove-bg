import SignIn from '@/components/sign-in';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">AI Video Bg Remover</div>
          <div className="space-x-4">
            <SignIn />
          </div>
        </div>
      </nav>


      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Remove Video Backgrounds with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your videos instantly with our AI-powered background removal tool. 
            Perfect for creators, marketers, and professionals.
          </p>
          <div className="px-3 py-1.5 bg-blue-600 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors inline-block">
            <SignIn />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">AI-Powered Precision</h3>
            <p className="text-gray-300">State-of-the-art AI model for accurate background removal in seconds.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Batch Processing</h3>
            <p className="text-gray-300">Process multiple videos at once with our efficient batch processing system.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Custom Backgrounds</h3>
            <p className="text-gray-300">Replace backgrounds with solid colors, images, or make them transparent.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
