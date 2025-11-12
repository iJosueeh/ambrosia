import { Search, Bell, UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-10 pr-4 py-2 w-64 bg-gray-100 rounded-lg border border-transparent focus:bg-white focus:border-gray-300 focus:outline-none transition-all"
        />
      </div>

      {/* Right-side icons */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <Bell className="h-6 w-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <UserCircle className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
