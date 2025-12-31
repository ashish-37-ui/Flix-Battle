import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Battle from "./pages/battle";
import Navbar from "./components/Navbar";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </Router>
  )
}

export default App;

