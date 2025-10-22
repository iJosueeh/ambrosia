import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Logotipo from "../../assets/Ambrosia_Logo2.png";
import { FacebookIcon } from "./icons/FacebookIcon";
import { InstagramIcon } from "./icons/InstagramIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { YoutubeIcon } from "./icons/YoutubeIcon";

export const Footer = () => {
  const footerSections = [
    {
      title: "Producto",
      links: [
        { name: "Inicio", to: "/" },
        { name: "Sobre Nosotros", to: "/about" },
        { name: "Recursos", to: "/resources" },
        { name: "Artículos", to: "/articles" },
      ],
    },
    {
      title: "Compañía",
      links: [
        { name: "Blog", to: "/blog" },
        { name: "Testimonios", to: "/testimonials" },
        { name: "Preguntas Frecuentes", to: "/faq" },
        { name: "Contacto", to: "/contact" },
      ],
    },
    {
      title: "Soporte",
      links: [
        { name: "Centro de Ayuda", to: "/help" },
        { name: "Línea de Crisis", to: "/crisis" },
        { name: "Política de Privacidad", to: "/privacy" },
        { name: "Términos de Uso", to: "/terms" },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-gradient-to-br from-teal-50 to-emerald-50 pt-16 pb-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <div className="flex items-center gap-2 mb-4">
              <img src={Logotipo} alt="Ambrosia Logo" className="w-24" />
            </div>

            <p className="text-gray-600 mb-6 max-w-sm leading-relaxed">
              Un espacio seguro y de apoyo para personas que enfrentan
              trastornos alimenticios y sus familias. Juntos construimos un
              camino hacia la recuperación.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-200 shadow-sm transform hover:scale-110"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-200 shadow-sm transform hover:scale-110"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-200 shadow-sm transform hover:scale-110"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-200 shadow-sm transform hover:scale-110"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              <h3 className="text-teal-800 font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.to}
                      className="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div
          className="border-t border-teal-200 pt-8 mb-8"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <h3 className="text-teal-800 font-semibold mb-6">Contáctanos</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Email */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-sm">
                <a
                  href="mailto:soporte@ambrosia.com"
                  className="text-gray-700 hover:text-emerald-600 block"
                >
                  soporte@ambrosia.com
                </a>
                <a
                  href="mailto:info@ambrosia.com"
                  className="text-gray-700 hover:text-emerald-600 block"
                >
                  info@ambrosia.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-sm">
                <a
                  href="tel:+34800123456"
                  className="text-gray-700 hover:text-emerald-600 block"
                >
                  +51 945 915 296
                </a>
                <span className="text-gray-600">Lun - Vie, 9:00 - 18:00</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-sm">
                <p className="text-gray-700">Calle Marielena Moyano </p>
                <p className="text-gray-600">Lima, Perú</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-teal-200 pt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">
            © 2025 Ambrosia. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-xs">
            Si estás en crisis, por favor contacta los servicios de emergencia o
            llama a la línea de ayuda 24/7
          </p>
        </div>
      </div>
    </footer>
  );
};