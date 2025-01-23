export function Navbar() {
  return (
    <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
      <div className="text-2xl font-bold text-white cursor-pointer">
        Scene AI
      </div>
      <div className="flex items-center space-x-8">
        <span className="text-white/80 hover:text-white transition-colors">
          25 Credits for just $7!
        </span>
      </div>
    </nav>
  )
} 