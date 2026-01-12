import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { getCurrentUser } from "./utils/auth";

import Home from "./pages/Home";
import Battle from "./pages/Battle/Battle";
import Trends from "./pages/Trends";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import CreateBattle from "./pages/CreateBattle";
import Login from "./pages/Login";

function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/create" element={<CreateBattle />} />
        <Route
          path="/login"
          element={
            <Login currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
