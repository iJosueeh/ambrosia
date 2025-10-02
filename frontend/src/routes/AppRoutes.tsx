import { Routes, Route } from "react-router-dom"
import { LandingPage } from "../modules/home/pages/LandingPage"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}