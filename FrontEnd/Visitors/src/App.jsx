
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header/Header";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

import AllSermons from "./pages/AllSermons/AllSermons";
import Events from "./pages/Events/Events";
import EventDetails from "./pages/EventDetails/EventDetails";

import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();


  const isLoginPage = location.pathname === "/sermons";

  return (
    <>
      {!isLoginPage && <Header />}

      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* About Page */}
        <Route path="/about" element={<About />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />

        {/* Events Page */}
        <Route path="/events" element={<Events />} />

        {/* Event Details Page */}
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Public Sermons Page */}
        <Route path="/sermons" element={<AllSermons />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
