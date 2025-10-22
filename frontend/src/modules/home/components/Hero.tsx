import { useEffect } from "react";
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-teal-800 mb-6 leading-tight">
                Un camino seguro para salud y confianza
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

            {/* Right Image */}
            <div
              className="relative h-64 md:h-auto"
              data-aos="fade-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-300 to-yellow-200 rounded-3xl md:rounded-none md:rounded-r-3xl overflow-hidden">
                {/* Mountain Layers */}
                <div className="absolute inset-0">
                  {/* Sky gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-200 via-orange-200 to-yellow-300"></div>

                  {/* Back mountains */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 300"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <path
                      d="M0,180 L100,120 L200,150 L300,100 L400,140 L400,300 L0,300 Z"
                      fill="rgba(0,0,0,0.15)"
                    />
                  </svg>

                  {/* Middle mountains */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 300"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <path
                      d="M0,200 L80,150 L160,180 L240,140 L320,170 L400,150 L400,300 L0,300 Z"
                      fill="rgba(0,0,0,0.25)"
                    />
                  </svg>

                  {/* Front mountains */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 300"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <path
                      d="M0,220 L60,180 L120,200 L180,170 L240,190 L300,180 L360,200 L400,190 L400,300 L0,300 Z"
                      fill="rgba(0,0,0,0.4)"
                    />
                  </svg>

                  {/* Trees silhouette */}
                  <svg
                    className="absolute bottom-0 w-full h-32"
                    viewBox="0 0 400 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,60 L20,40 L25,60 L30,35 L35,60 L45,45 L50,60 L60,50 L65,60 L75,45 L80,60 L90,50 L95,60 L105,55 L110,60 L120,50 L125,60 L400,60 L400,100 L0,100 Z"
                      fill="rgba(0,0,0,0.6)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};