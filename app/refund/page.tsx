export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">No-Refund Policy</h2>
          <p className="text-gray-300 mb-4">
            Due to the immediate processing nature of our AI video background removal service, we maintain a strict no-refund policy. Once a video has been processed, the computational resources have been consumed and cannot be recovered.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Why We Don't Offer Refunds</h2>
          <ul className="text-gray-300 mb-4 list-disc pl-6 space-y-2">
            <li>Our service provides immediate, real-time processing of your videos</li>
            <li>Computing resources are allocated and consumed instantly</li>
            <li>Each video processing operation utilizes significant AI computational power</li>
            <li>The service is delivered immediately upon processing</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Quality Assurance</h2>
          <p className="text-gray-300 mb-4">
            To ensure your satisfaction, we offer:
          </p>
          <ul className="text-gray-300 mb-4 list-disc pl-6 space-y-2">
            <li>Preview functionality before full processing</li>
            <li>Detailed documentation on optimal video requirements</li>
            <li>24/7 customer support for technical issues</li>
            <li>Multiple retry attempts for failed processing due to technical errors</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Issues</h2>
          <p className="text-gray-300 mb-4">
            In cases where videos fail to process due to technical issues on our end, we will provide additional processing credits for future use. Please contact our support team if you experience any technical difficulties.
          </p>

          <div className="bg-gray-800 p-4 rounded-lg mt-8">
            <p className="text-amber-400 font-semibold">Important Note:</p>
            <p className="text-gray-300 mt-2">
              By purchasing our service, you acknowledge and agree to this no-refund policy. We encourage users to carefully review our video requirements and test with a small video first before processing larger projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 