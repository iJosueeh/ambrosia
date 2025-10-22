import { useEffect } from "react";
import Portada from "../../../assets/portada1.jpg";
import AOS from "aos";

export const Hero = () => {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center px-4 pt-24 sm:pt-16 overflow-x-hidden">
      <div className="max-w-7xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-0">
            {/* Left Content */}
            <div
              className="flex flex-col justify-center p-8 md:p-12 lg:p-16"
              data-aos="fade-right"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-caligrafia text-teal-800 mb-6 leading-tight">
                Un espacio seguro para sanar y compartir
              </h1>

              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                Ambrosia Vital ofrece un espacio seguro y acogedor donde puedes
                encontrar el apoyo que necesitas. Estamos aquí para acompañarte
                en cada paso hacia una relación más saludable con la comida y
                contigo mismo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                  Descubre más
                </button>

                <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-200 transform hover:scale-105">
                  Comunidad
                </button>
              </div>
            </div>

            <div
              className="relative h-64 md:h-auto"
              data-aos="fade-left"
            >
              <div className="absolute inset-0 rounded-3xl md:rounded-none md:rounded-r-3xl overflow-hidden">
               
                <img
                  src={Portada} 
                  alt="Imagen de portada con montañas o paisaje" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};