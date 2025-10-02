import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-purple-700">
          Ambrosia
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex space-x-6">
          <a href="#hero" className="hover:text-purple-600 transition">
            Inicio
          </a>
          <a href="#about" className="hover:text-purple-600 transition">
            Sobre Nosotros
          </a>
          <a href="#resources" className="hover:text-purple-600 transition">
            Recursos
          </a>
          <a href="#contact" className="hover:text-purple-600 transition">
            Contacto
          </a>
        </div>

        {/* Botón CTA desktop */}
        <div className="hidden md:block">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Botón hamburguesa (mobile) */}
        <button
          className="md:hidden text-purple-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="text-3xl">&times;</span> // X
          ) : (
            <span className="text-3xl">&#9776;</span> // ☰
          )}
        </button>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-white shadow-lg pb-4">
          <a
            href="#hero"
            className="py-2 w-full text-center hover:bg-purple-100"
          >
            Inicio
          </a>
          <a
            href="#about"
            className="py-2 w-full text-center hover:bg-purple-100"
          >
            Sobre Nosotros
          </a>
          <a
            href="#resources"
            className="py-2 w-full text-center hover:bg-purple-100"
          >
            Recursos
          </a>
          <a
            href="#contact"
            className="py-2 w-full text-center hover:bg-purple-100"
          >
            Contacto
          </a>
          <Link
            to="/login"
            className="mt-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}
    </nav>
  );
};