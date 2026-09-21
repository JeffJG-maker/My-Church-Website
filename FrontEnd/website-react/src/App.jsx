import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-[#030e5c] transition-colors duration-500 dark:bg-[#0f1026] dark:text-white">

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;