import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from "./routes/AppRoutes";
import { Navbar } from "./shared/components/Navbar";
import { Footer } from "./shared/components/Footer";
import { useEffect } from "react";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <Toaster />
      <Navbar />
      {/* Main content wrapper with padding to clear the fixed Navbar */}
      <div className="pt-16"> {/* Adjust pt-XX based on actual Navbar height */}
        <AppRoutes />
      </div>
      <Footer />
    </>
  );
}

export default App;