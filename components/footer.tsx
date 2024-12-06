import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AI Video Bg Remover. All rights reserved.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/refund" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 