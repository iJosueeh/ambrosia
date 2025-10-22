import { Routes, Route } from "react-router-dom"
import { LandingPage } from "../modules/home/pages/LandingPage"
import { AuthUser } from "../modules/auth/pages/AuthUser"
import { QuizPage } from "../modules/resources/pages/QuizPage"
import { ListadoArticulosPage } from "../modules/resources/pages/ListadoArticulosPage"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthUser />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/articulos" element={<ListadoArticulosPage />} />
    </Routes>
  )
}