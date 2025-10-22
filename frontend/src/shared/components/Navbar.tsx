import { useState } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logotipo from "../../assets/Ambrosia_Logo2.png";
import { UserIcon } from "./icons/UserIcon";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const firstName = user ? user.name.split(' ')[0] : '';

  console.log("Navbar render - user:", user, "isAuthenticated:", isAuthenticated);

  const navItems = [
    { name: "Inicio", href: "/#home" },
    { name: "Sobre Nosotros", href: "/#about" },
    { name: "Recursos", href: "/#resources" },
    { name: "Artículos", href: "/#articles" },
    { name: "Tests", href: "/#tests" },
  ];

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate("/auth");
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold text-purple-700">
              <img className="w-40" src={Logotipo} alt="Ambrosia Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative group text-gray-600 hover:text-emerald-500 transition-colors duration-200 text-sm font-medium"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              </a>
            ))}
            <a
              href="/#contact"
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm font-medium"
            >
              Contacto
            </a>
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-emerald-300">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-600 text-sm font-medium">Hola, {firstName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 invisible border border-gray-200">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    Ver perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-emerald-500 focus:outline-none"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute transition-all duration-300 ease-in-out ${isOpen ? "transform rotate-90 opacity-0" : "transform rotate-0 opacity-100"}`}
                  size={24}
                />
                <X
                  className={`absolute transition-all duration-300 ease-in-out ${isOpen ? "transform rotate-0 opacity-100" : "transform -rotate-90 opacity-0"}`}
                  size={24}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-screen" : "max-h-0"}`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200 text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a
            href="/#contact"
            className="block w-full text-center bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm font-medium mt-4"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </a>
          {isAuthenticated && user ? (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-emerald-300">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-600 text-sm font-medium">Hola, {firstName}</span>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2 py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200 text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="w-4 h-4" />
                Ver perfil
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left py-2 text-gray-600 hover:text-emerald-500 transition-colors duration-200 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuthClick}
              className="block w-full text-center bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium mt-4"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};