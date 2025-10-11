import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AmbrosiaLogo from "../../../assets/Ambrosia_Logo2.png";

export const AssessmentQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      text: "¿Con qué frecuencia te preocupas por tu peso o forma corporal?",
      options: [
        "Nunca",
        "Raramente",
        "A veces",
        "Frecuentemente",
        "Constantemente",
      ],
    },
    {
      id: 2,
      text: "¿Has experimentado cambios significativos en tus hábitos alimenticios?",
      options: [
        "No, ningún cambio",
        "Cambios menores",
        "Algunos cambios",
        "Cambios significativos",
        "Cambios drásticos",
      ],
    },
    {
      id: 3,
      text: "¿Cómo te sientes después de comer?",
      options: [
        "Satisfecho y bien",
        "Generalmente bien",
        "A veces culpable",
        "Frecuentemente culpable",
        "Muy culpable o ansioso",
      ],
    },
    {
      id: 4,
      text: "¿Con qué frecuencia evitas comer en situaciones sociales?",
      options: ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"],
    },
    {
      id: 5,
      text: "¿Has notado cambios en tu energía o estado de ánimo?",
      options: [
        "No, me siento normal",
        "Cambios leves",
        "Algunos cambios",
        "Cambios notables",
        "Cambios severos",
      ],
    },
    {
      id: 6,
      text: "¿Cuentas calorías o controlas estrictamente lo que comes?",
      options: [
        "Nunca",
        "Raramente",
        "A veces",
        "Frecuentemente",
        "Constantemente",
      ],
    },
    {
      id: 7,
      text: "¿Afecta tu alimentación a tus relaciones personales?",
      options: [
        "Para nada",
        "Muy poco",
        "A veces",
        "Frecuentemente",
        "Significativamente",
      ],
    },
    {
      id: 8,
      text: "¿Te sientes fuera de control cuando comes?",
      options: [
        "Nunca",
        "Raramente",
        "A veces",
        "Frecuentemente",
        "Muy frecuentemente",
      ],
    },
  ];

  const handleSelectAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-2xl mx-auto my-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
              Test Completado
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Gracias por completar nuestra evaluación confidencial
            </p>

            {/* Results Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                Tus Resultados
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Basándonos en tus respuestas, recomendamos que consideres hablar
                con un profesional de la salud. Recuerda que buscar ayuda es un
                acto de valentía y el primer paso hacia la recuperación.
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-emerald-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-emerald-900 mb-4">
                Próximos Pasos Recomendados
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Contacta con un especialista en trastornos alimenticios
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Únete a nuestro grupo de apoyo comunitario
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Explora nuestros recursos y artículos sobre recuperación
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Habla con alguien de confianza sobre tus sentimientos
                  </span>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-orange-900 mb-2">Importante</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Este test es solo una guía orientativa y no reemplaza un
                diagnóstico profesional. Si sientes que estás en crisis, por
                favor contacta inmediatamente los servicios de emergencia o
                nuestra línea de ayuda 24/7.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button className="flex-1 bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-colors duration-200 shadow-md">
                Ver Recursos
              </button>
              <button className="flex-1 border-2 border-emerald-500 text-emerald-600 py-3 px-6 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-200">
                Contactar Especialista
              </button>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4 pt-24 pb-12">
      <div className="w-full max-w-3xl mx-auto my-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img src={AmbrosiaLogo} alt="Ambrosia Vital Logo" className="w-auto h-24 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Evaluación de Bienestar
          </h2>
          <p className="text-gray-600">
            Responde con honestidad. Toda la información es confidencial y
            anónima.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
              {questions[currentQuestion].text}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestion] === option
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1
              ? "Ver Resultados"
              : "Siguiente"}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Privacy Notice */}
        <div className="flex items-center justify-center gap-2 mt-6 text-emerald-600">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            100% Confidencial y Anónimo
          </span>
        </div>
      </div>
    </div>
  );
};
