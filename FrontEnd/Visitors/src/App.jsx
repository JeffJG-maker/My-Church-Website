import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header/Header";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import AllSermons from "./pages/AllSermons/AllSermons";
import Events from "./pages/Events/Events";
import EventDetails from "./pages/EventDetails/EventDetails";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function AppContent() {
  const location = useLocation();

  const exactPublicPaths = ["/login", "/sermons"];

  const isLoginPage =
    exactPublicPaths.includes(location.pathname) 
    // location.pathname.startsWith("/events/");

  return (
    <>
      {!isLoginPage && <Header />}

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/events"
          element={<Events />}
        />


        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        <Route
          path="/sermons"
          element={
            <ProtectedRoute>
              <AllSermons />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />
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