import React, { useState } from "react";
import { api } from "../api";
import Skeleton from "../components/Skeleton";
import { toast } from "react-toastify";

export default function Search() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("text");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const go = async () => {
    if (!q.trim()) return toast.warning("Enter a query first");
    setLoading(true);
    setSubmitted(true);
    const path = tab === "text" ? "/api/search/text" : "/api/search/semantic";
    try {
      const res = await api(`${path}?q=${encodeURIComponent(q)}`);
      setResults(res.data);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-center">🔍 Search Documents</h2>

   
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type your query..."
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          onClick={go}
          className="bg-indigo-600 text-white px-5 py-3 rounded hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </div>

     
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setTab("text")}
          className={`px-4 py-2 rounded font-medium transition ${
            tab === "text"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setTab("semantic")}
          className={`px-4 py-2 rounded font-medium transition ${
            tab === "semantic"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Semantic
        </button>
      </div>

     
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {results.map((r) => (
            <li
              key={r._id}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{r.title}</h3>
                {r.semanticScore !== undefined && (
                  <span className="text-sm text-gray-500">
                    Score: {r.semanticScore.toFixed(3)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {r.summary || (r.content?.slice(0, 160) + "...")}
              </p>
            </li>
          ))}
          {submitted && results.length === 0 && (
            <li className="text-center text-gray-500 text-sm">
              No results found for "<strong>{q}</strong>"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}