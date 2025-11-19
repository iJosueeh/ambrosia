import { useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from "./routes/AppRoutes";
import { Navbar } from "./shared/components/Navbar";
import { Footer } from "./shared/components/Footer";

// AuthProvider and BrowserRouter are no longer needed here as they are in main.tsx

function App() {
  return (
    <AppContent />
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/profesional');

  return (
    <>
      <Toaster />
      {!isDashboardRoute && <Navbar />}
      {/* Main content wrapper with padding to clear the fixed Navbar */}
      <div className={!isDashboardRoute ? "pt-16" : ""}> {/* Adjust pt-XX based on actual Navbar height */}
        <AppRoutes />
      </div>
      {!isDashboardRoute && <Footer />}
    </>
  );
}

export default App;