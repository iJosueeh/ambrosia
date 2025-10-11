import { HelpCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TestCTA = () => {
  const navigate = useNavigate();

  const features = [
    "100% confidencial y anónimo",
    "Resultados inmediatos",
    "Recomendaciones personalizadas",
  ];

  return (
    <section id="tests" className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto" data-aos="zoom-in">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-5 gap-8 p-8 md:p-12">
            {/* Icon Section */}
            <div className="md:col-span-2 flex items-center justify-center">
              <div className="relative">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-blue-400 rounded-3xl opacity-30 blur-xl"></div>

                {/* Icon Container */}
                <div className="relative bg-blue-400 bg-opacity-40 backdrop-blur-sm rounded-3xl p-8 md:p-12">
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 md:p-8 animate-pulse">
                    <HelpCircle className="w-16 h-16 md:w-20 md:h-20 text-white stroke-[1.5]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="md:col-span-3 text-white flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                ¿Necesitas ayuda con tu problema?
              </h2>

              <p className="text-blue-50 text-base md:text-lg mb-6 leading-relaxed">
                Realiza nuestro test confidencial de evaluación. Es el primer
                paso para entender tu situación y encontrar el apoyo adecuado.
                Tus respuestas son completamente privadas.
              </p>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-100 flex-shrink-0" />
                    <span className="text-blue-50">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div>
                <button
                  onClick={() => navigate("/quiz")}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Realizar Test Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
