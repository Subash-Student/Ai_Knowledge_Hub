import React, { useState } from "react";
import { api } from "../api";
import Skeleton from "../components/Skeleton";
import { toast } from "react-toastify";

export default function TeamQA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return toast.warning("Enter a question first");
    setLoading(true);
    setAnswer("");
    setSources([]);
    try {
      const res = await api("/api/qa", {
        method: "POST",
        body: JSON.stringify({ question }),
      });
      setAnswer(res.answer);
      setSources(res.sources || []);
      toast.success("Answer ready!");
    } catch {
      toast.error("Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-center">🤝 Team Q&A</h2>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          placeholder="Ask a question about your docs..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button
          onClick={ask}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-3 rounded hover:bg-indigo-700 transition disabled:opacity-60"
        >
          Ask
        </button>
      </div>

      {/* Loading State */}
      {loading && <Skeleton className="h-32 w-full" />}

      {/* Answer Section */}
      {answer && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2">✅ Answer</h3>
          <p className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
            {answer}
          </p>
        </div>
      )}

      {/* Sources Section */}
      {sources.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h4 className="text-lg font-semibold mb-2">📚 Sources</h4>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            {sources.map((s) => (
              <li key={s.id}>
                {s.title}{" "}
                <span className="text-gray-400">(score {s.score.toFixed(3)})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}