import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import TestCasePage from "./pages/TestCasePage";
import RepositoryPage
  from "./pages/RepositoryPage";
import ExecutionHistoryPage
  from "./pages/ExecutionHistoryPage";

function App() {

  return (

    <BrowserRouter>

      <div className="top-navbar">

        <h2>
          🤖 AI Testing System
        </h2>

        <div className="nav-links">

          <Link to="/">
            📝 Test Cases
          </Link>

          <Link to="/dashboard">
            📊 Dashboard
          </Link>

          <Link to="/repository">
            📋 Repository
          </Link>

          <Link to="/history">
            📜 Execution History
          </Link>

        </div>

      </div>

      <Routes>

        <Route
          path="/"
          element={<TestCasePage />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/repository"
          element={<RepositoryPage />}
        />

        <Route
          path="/history"
          element={<ExecutionHistoryPage />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;