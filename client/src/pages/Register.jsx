import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Register failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-20">
  <h2 className="text-xl font-bold text-center mb-4">Create an account</h2>
  <form onSubmit={submit} className="flex flex-col gap-3">
    <input
      className="border p-2 rounded"
      placeholder="Full name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <input
      className="border p-2 rounded"
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      className="border p-2 rounded"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <select
      className="border p-2 rounded"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    >
      <option value="user">user</option>
      <option value="admin">admin</option>
    </select>
    <button className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
      Register
    </button>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </form>
  <p className="text-sm mt-3 text-center">
    Already have an account?{" "}
    <Link to="/login" className="text-indigo-600">
      Login
    </Link>
  </p>
</div>
  );
}
