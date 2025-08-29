import React, { useContext } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddEditDoc from "./pages/AddEditDoc";
import Search from "./pages/Search";
import TeamQA from "./pages/TeamQA";
import { AuthContext } from "./context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
      <Link to="/" className="font-bold text-xl text-indigo-600">
        AI Knowledge Hub
      </Link>
      <nav className="flex gap-6 text-gray-600">
        <Link to="/" className="hover:text-indigo-600">Dashboard</Link>
        <Link to="/search" className="hover:text-indigo-600">Search</Link>
        <Link to="/qa" className="hover:text-indigo-600">Team Q&A</Link>
      </nav>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">
              Hi, {user.name} <span className="text-xs">({user.role})</span>
            </span>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-indigo-600">Login</Link>
        )}
      </div>
    </header>
  );
};

const Protected = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/docs/new" element={<Protected><AddEditDoc /></Protected>} />
          <Route path="/docs/:id" element={<Protected><AddEditDoc /></Protected>} />
          <Route path="/search" element={<Protected><Search /></Protected>} />
          <Route path="/qa" element={<Protected><TeamQA /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
