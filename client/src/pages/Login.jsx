import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(res.token, res.user);
      navigate("/");
    } catch (err) {
      setErrorMessage(err?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-20">
      <h2 className="text-xl font-bold text-center mb-4">Login</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          Login
        </button>

        {/* Show single error message */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </form>

      <p className="text-sm mt-3 text-center">
        No account?{" "}
        <Link to="/register" className="text-indigo-600">
          Register
        </Link>
      </p>
    </div>
  );
}