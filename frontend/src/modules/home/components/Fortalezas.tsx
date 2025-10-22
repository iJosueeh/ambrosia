
import book from "../../../assets/book.png";
import cora from "../../../assets/cora.png";
import start from "../../../assets/start.png";

export const Fortalezas = () => {
  const features = [
    {
      icon: cora, 
      title: "Apoyo",
      description:
        "Te damos una ventana, compartiendo tú historia, ayudas a otros también.",
      bgColor: "bg-pink-500",
      lightBg: "bg-pink-50",
    },
    {
      icon: book,
      title: "Recursos",
      description:
        "Especialistas, guías y herramientas prácticas para tu bienestar.",
      bgColor: "bg-orange-500",
      lightBg: "bg-orange-50",
    },
    {
      icon: start,
      title: "Familia",
      description:
        "Orientación y recursos para seres queridos que desean ayudar.",
      bgColor: "bg-emerald-500",
      lightBg: "bg-emerald-50",
    },
  ];

  return (
    <section id="resources" className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-teal-800 mb-12">
          Nuestras Fortalezas
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
           
              <div
                className={`${feature.lightBg} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto`}
              >
               
                <img 
                  src={feature.icon} 
                  alt={feature.title} 
                  className="w-100 h-100 object-contain" 
                />
              </div>

              <h3 className="text-xl font-semibold text-teal-800 text-center mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};