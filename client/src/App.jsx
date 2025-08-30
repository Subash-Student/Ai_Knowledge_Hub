import React, { useContext, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddEditDoc from "./pages/AddEditDoc";
import Search from "./pages/Search";
import TeamQA from "./pages/TeamQA";
import { AuthContext } from "./context/AuthContext";
import DocView from "./components/DocView";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          className="font-bold text-indigo-600 text-xl truncate"
          onClick={() => setMobileMenuOpen(false)}
        >
          AI Knowledge Hub
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 text-gray-600">
          <Link to="/" className="hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/search" className="hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
            Search
          </Link>
          <Link to="/qa" className="hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
            Team Q&A
          </Link>
        </nav>

        {/* User and Logout buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Hi, {user.name} <span className="text-xs">({user.role})</span>
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-indigo-600 hover:underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2">
          <Link
            to="/"
            className="block text-gray-700 hover:text-indigo-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/search"
            className="block text-gray-700 hover:text-indigo-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Search
          </Link>
          <Link
            to="/qa"
            className="block text-gray-700 hover:text-indigo-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Team Q&A
          </Link>
          <div className="border-t border-gray-200 pt-3">
            {user ? (
              <>
                <span className="block text-gray-700 mb-2">
                  Hi, {user.name} <span className="text-xs">({user.role})</span>
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-indigo-600 hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
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
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <Routes>
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/docs/new" element={<Protected><AddEditDoc /></Protected>} />
          <Route path="/docs/:id/view" element={<Protected><DocView /></Protected>} />
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
