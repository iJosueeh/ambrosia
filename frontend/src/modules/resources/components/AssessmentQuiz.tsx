import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AmbrosiaLogo from "../../../assets/Ambrosia_Logo2.png";
import { useMutation } from "@tanstack/react-query";
import { guardarResultado } from "../services/test.service";
import * as TestServiceTypes from "../services/test.service";
import { toast } from 'react-hot-toast';
import { useAuth } from "../../../shared/hooks/useAuth";

const staticTest: TestServiceTypes.TestDTO = {
  id: 1,
  titulo: "Evaluación de Bienestar Integral",
  descripcion: "Este test evalúa aspectos psicológicos y nutricionales para un bienestar completo.",
  preguntas: [
    {
      id: 101,
      texto: "¿Con qué frecuencia sientes estrés o ansiedad en tu día a día?",
      opciones: [
        { id: 1001, texto: "Nunca o casi nunca" },
        { id: 1002, texto: "Raramente" },
        { id: 1003, texto: "A veces" },
        { id: 1004, texto: "Frecuentemente" },
        { id: 1005, texto: "Constantemente" },
      ],
    },
    {
      id: 102,
      texto: "¿Cómo describirías la calidad de tu sueño?",
      opciones: [
        { id: 1006, texto: "Muy buena, duermo profundamente" },
        { id: 1007, texto: "Buena, me siento descansado/a" },
        { id: 1008, texto: "Regular, a veces me cuesta dormir" },
        { id: 1009, texto: "Mala, me despierto varias veces" },
        { id: 1010, texto: "Muy mala, casi no duermo" },
      ],
    },
    {
      id: 103,
      texto: "¿Con qué frecuencia consumes frutas y verduras?",
      opciones: [
        { id: 1011, texto: "Varias veces al día" },
        { id: 1012, texto: "Una vez al día" },
        { id: 1013, texto: "Algunos días a la semana" },
        { id: 1014, texto: "Raramente" },
        { id: 1015, texto: "Nunca o casi nunca" },
      ],
    },
    {
      id: 104,
      texto: "¿Cuántos vasos de agua bebes al día en promedio?",
      opciones: [
        { id: 1016, texto: "8 o más" },
        { id: 1017, texto: "Entre 5 y 7" },
        { id: 1018, texto: "Entre 2 y 4" },
        { id: 1019, texto: "Menos de 2" },
        { id: 1020, texto: "Casi ninguno" },
      ],
    },
  ],
};

export const AssessmentQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // Stores questionId -> optionId
  const [showResults, setShowResults] = useState(false);
  const [currentTest, setCurrentTest] = useState<TestServiceTypes.TestDTO | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentTest(staticTest);
  }, []);

  const submitResultMutation = useMutation<void, Error, TestServiceTypes.ResultadoDTO>({
    mutationFn: guardarResultado,
    onSuccess: () => {
      console.log("Resultados guardados exitosamente!");
      toast.success("Resultados guardados exitosamente!");
      setTimeout(() => {
        navigate('/');
      }, 2000); // 2-second delay before redirecting
    },
    onError: (err) => {
      console.error("Error al guardar resultados:", err);
      toast.error("Error al guardar resultados: " + err.message);
      setIsSubmitting(false); // Reset on error
    },
  });

  if (!currentTest) return <div className="min-h-screen flex items-center justify-center">Cargando test...</div>;

  const questions = currentTest.preguntas;

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">No hay preguntas para este test.</div>;
  }

  const currentQuestion: TestServiceTypes.Pregunta = questions[currentQuestionIndex];

  const handleSelectAnswer = (questionId: number, optionId: number) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(question => {
      const selectedOptionId = answers[question.id];
      if (selectedOptionId) {

        score += selectedOptionId % 1000;
      }
    });
    return score;
  };

  const handleSaveResults = () => {
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);
    if (user && currentTest) {
      const puntajeTotal = calculateScore();
      const resultado: TestServiceTypes.ResultadoDTO = {
        usuarioId: user.id,
        testId: currentTest.id,
        respuestas: Object.entries(answers).map(([preguntaId, opcionId]) => ({
          preguntaId: parseInt(preguntaId),
          opcionId: opcionId,
        })),
        puntajeTotal: puntajeTotal,
      };
      submitResultMutation.mutate(resultado);
    } else {
      // This case should ideally not be reached if the button is conditionally rendered
      toast.error("Debes iniciar sesión para guardar tus resultados.");
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
                Basándonos en tus respuestas, tu puntaje total es: <strong>{calculateScore()}</strong>.
                Recomendamos que consideres hablar con un profesional de la salud. Recuerda que buscar ayuda es un
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
              {user ? (
                <motion.button
                  onClick={handleSaveResults}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitResultMutation.isPending || isSubmitting}
                >
                  {submitResultMutation.isPending || isSubmitting ? "Guardando..." : "Guardar Resultados"}
                </motion.button>
              ) : (
                <button className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold cursor-not-allowed">
                  Inicia sesión para guardar resultados
                </button>
              )}
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
              Pregunta {currentQuestionIndex + 1} de {questions.length}
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
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">
              {currentTest.titulo} - {currentQuestion.texto}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.opciones.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestion.id] === option.id
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {option.texto}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === questions.length - 1
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
