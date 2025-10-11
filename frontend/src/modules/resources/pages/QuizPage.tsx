import { useEffect } from "react";
import { AssessmentQuiz } from "../components/AssessmentQuiz";

export const QuizPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <AssessmentQuiz />
    </div>
  );
};
