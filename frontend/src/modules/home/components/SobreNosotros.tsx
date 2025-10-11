export const SobreNosotros = () => {
  return (
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
              <button className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200 shadow-md hover:shadow-lg">
                Nuestra Misión
              </button>

              <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors duration-200">
                Conoce al Equipo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
