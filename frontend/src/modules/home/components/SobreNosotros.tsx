import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Heart, Users, Sparkles } from "lucide-react";

export const SobreNosotros = () => {
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  return (
    <>
      <section id="about" className="py-16 px-4 bg-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4" data-aos="fade-right">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                  <img
                    src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&h=600&fit=crop"
                    alt="Bowl saludable con frutas"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                  <img
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=600&fit=crop"
                    alt="Alimentación consciente"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop"
                    alt="Mujer en campo de flores"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=600&fit=crop"
                    alt="Ejercicio y bienestar"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-6" data-aos="fade-left">
              <h2 className="text-3xl md:text-4xl font-bold text-teal-800">
                Sobre Nosotros
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed">
                En Ambrosia creemos que la recuperación es posible. Somos una
                plataforma dedicada a brindar apoyo integral a personas que
                enfrentan trastornos alimenticios y a sus familias.
              </p>

              <p className="text-gray-600 text-lg leading-relaxed">
                Nuestro enfoque combina recursos profesionales, comunidad de apoyo
                y herramientas prácticas para ayudarte a construir una relación
                saludable con la comida y tu cuerpo. No estás solo en este camino.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setShowMissionModal(true)}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Nuestra Misión
                </button>

                <button
                  onClick={() => setShowTeamModal(true)}
                  className="border-2 border-emerald-500 text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-200"
                >
                  Conoce al Equipo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Nuestra Misión */}
      <AnimatePresence>
        {showMissionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMissionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Nuestra Misión</h3>
                  </div>
                  <button
                    onClick={() => setShowMissionModal(false)}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl">
                  <Heart className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Transformar Vidas
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Nuestra misión es proporcionar un espacio seguro y acogedor donde
                      las personas que enfrentan trastornos alimenticios puedan encontrar
                      apoyo, recursos y esperanza en su camino hacia la recuperación.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-xl">
                  <Users className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Comunidad de Apoyo
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Creemos en el poder de la comunidad. Conectamos a personas con
                      experiencias similares, creando una red de apoyo mutuo donde nadie
                      tiene que enfrentar sus desafíos solo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                  <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Recursos Profesionales
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Ofrecemos acceso a información basada en evidencia, herramientas
                      prácticas y recursos profesionales que empoderan a las personas
                      para construir una relación saludable con la comida y su cuerpo.
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="text-gray-600 text-center italic">
                    "La recuperación es posible, y estamos aquí para acompañarte en cada
                    paso del camino."
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Conoce al Equipo */}
      <AnimatePresence>
        {showTeamModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTeamModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Nuestro Equipo</h3>
                  </div>
                  <button
                    onClick={() => setShowTeamModal(false)}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-center mb-8 text-lg">
                  Conoce a los desarrolladores detrás de Ambrosia, comprometidos con crear
                  una plataforma que marque la diferencia.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  {/* Katherine Salas */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src="https://avatars.githubusercontent.com/u/189315796?v=4"
                          alt="Katherine Salas"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-gray-900 text-xl mb-1">
                        Katherine Patricia Salas Quiroz
                      </h4>
                      <p className="text-purple-600 text-sm font-medium mb-4">
                        Full Stack Developer
                      </p>
                      <a
                        href="https://www.linkedin.com/in/katherine-salas-quiroz-472506337/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </div>

                  {/* Josue Tanta */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src="https://avatars.githubusercontent.com/u/107824312?v=4"
                          alt="Josue Tanta"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-gray-900 text-xl mb-1">
                        Josue Royer Tanta Cieza
                      </h4>
                      <p className="text-emerald-600 text-sm font-medium mb-4">
                        Full Stack Developer
                      </p>
                      <a
                        href="https://www.linkedin.com/in/josue-tanta/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 via-emerald-50 to-teal-50 rounded-xl border-l-4 border-emerald-500">
                  <p className="text-gray-700 leading-relaxed text-center">
                    <span className="font-bold text-emerald-700">
                      Desarrolladores apasionados
                    </span>
                    {" "}por crear tecnología que impacte positivamente en la vida de las personas,
                    combinando innovación técnica con empatía y propósito social.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
