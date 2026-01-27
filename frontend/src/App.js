import { BrowserRouter, Routes, Route,Navigate,
  useLocation, } from "react-router-dom";
import { useState } from "react";
import { getCurrentUser } from "./utils/auth";

import Home from "./pages/Home";
import Battle from "./pages/Battle/Battle";
import Trends from "./pages/Trends";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import CreateBattle from "./pages/CreateBattle";
import Login from "./pages/Login";
import CategoryBattles from "./pages/CategoryBattles";
import Profile from "./pages/Profile";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const RequireAuth = ({ children }) => {
    const user = getCurrentUser();
    const location = useLocation();

    if (!user) {
      return (
        <Navigate
          to="/login"
          state={{ from: location.pathname + location.search }}
          replace
        />
      );
    }

    return children;
  };

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/battle" element={<Battle />} />

          {/* ❌ NO generic /battle route */}
          {/* Battle page is accessed only via /battle?battleId= */}

          <Route path="/trends" element={<Trends />} />
          <Route
            path="/create"
            element={
              <RequireAuth>
                <CreateBattle />
              </RequireAuth>
            }
          />
          <Route path="/category/:type" element={<CategoryBattles />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route
            path="/login"
            element={
              <Login
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
