import { Hero } from "../components/Hero"
import { Fortalezas } from "../components/Fortalezas"
import { SobreNosotros } from "../components/SobreNosotros"
import { Articulos } from "../components/Articulos"
import { TestCTA } from "../components/TestCTA"

export const LandingPage = () => {
  return (
    <>
      <Hero />
      <Fortalezas />
      <SobreNosotros />
      <Articulos />
      <TestCTA />
    </>
  )
}