export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          ProductIQ
        </h1>

        <div className="hidden md:flex gap-8 text-gray-300 text-sm">
          <span className="hover:text-white cursor-pointer">Products</span>
          <span className="hover:text-white cursor-pointer">Compare</span>
          <span className="hover:text-white cursor-pointer">Insights</span>
        </div>

        <button className="px-5 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition text-sm">
          Get Started
        </button>
      </div>
    </nav>
  );
}