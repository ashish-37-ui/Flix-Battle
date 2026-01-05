import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Battle from "./pages/Battle/Battle";
import Trends from "./pages/Trends";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import CreateBattle from "./pages/CreateBattle";


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/create" element={<CreateBattle />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
