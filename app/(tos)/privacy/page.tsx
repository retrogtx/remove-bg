export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information Collection</h2>
          <p className="text-gray-300 mb-4">
            We collect information that you provide directly to us, including when you create an account, upload videos, or contact us for support.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Storage</h2>
          <p className="text-gray-300 mb-4">
            Your videos are stored securely and temporarily while being processed. We automatically delete uploaded content after processing is complete and the download period has expired.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Usage</h2>
          <p className="text-gray-300 mb-4">
            We use your information solely for providing and improving our service. We do not sell or share your personal data with third parties.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
          <p className="text-gray-300 mb-4">
            We use cookies to enhance your experience and analyze our traffic. You can control cookies through your browser settings.
          </p>
        </div>
      </div>
    </div>
  )
} 