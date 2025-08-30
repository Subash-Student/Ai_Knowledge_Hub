import React, { useEffect, useState } from "react";
import { api } from "../api";
import Skeleton from "../components/Skeleton";
import { toast } from "react-toastify";

function DocCard({ doc, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-xl p-4 shadow-sm hover:shadow-md transition ${
        selected ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"
      }`}
    >
      <h3 className="font-semibold text-lg mb-1">{doc.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">
        {doc.summary || doc.content.slice(0, 140) + "..."}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {(doc.tags || []).map((t, i) => (
          <span
            key={i}
            className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TeamQA() {
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loadingQA, setLoadingQA] = useState(false);

  // Load docs on mount
  useEffect(() => {
    const loadDocs = async () => {
      setLoadingDocs(true);
      try {
        const list = await api("/api/docs");
        setDocs(list.data);
      } catch (err) {
        toast.error(err.message || "Failed to load documents");
      } finally {
        setLoadingDocs(false);
      }
    };
    loadDocs();
  }, []);

  // Ask question with selected doc
  const ask = async () => {
    if (!selectedDoc) return toast.warning("Please select a document first");
    if (!question.trim()) return toast.warning("Enter a question first");

    setLoadingQA(true);
    setAnswer("");
    setSources([]);

    try {
      const res = await api("/api/qa", {
        method: "POST",
        body: JSON.stringify({ question, docId: selectedDoc._id }),
      });
      setAnswer(res.answer);
      setSources(res.sources || []);
      toast.success("Answer ready!");
    } catch {
      toast.error("Failed to get answer");
    } finally {
      setLoadingQA(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-center">🤝 Team Q&A</h2>

      {/* Documents list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto border rounded p-4 bg-white shadow scrollbar-hide">
        {loadingDocs ? (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </>
        ) : docs.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">No documents found.</div>
        ) : (
          docs.map((doc) => (
            <DocCard
              key={doc._id}
              doc={doc}
              selected={selectedDoc?._id === doc._id}
              onClick={() => setSelectedDoc(doc)}
            />
          ))
        )}
      </div>

      {/* Question input and ask button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          placeholder={
            selectedDoc
              ? `Ask a question about "${selectedDoc.title}"`
              : "Select a document to start asking..."
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          disabled={!selectedDoc || loadingQA}
        />
        <button
          onClick={ask}
          disabled={!selectedDoc || loadingQA || !question.trim()}
          className="bg-indigo-600 text-white px-5 py-3 rounded hover:bg-indigo-700 transition disabled:opacity-60"
        >
          Ask
        </button>
      </div>

      {/* Answer modal popup */}
      {answer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full p-6 relative">
            <button
              onClick={() => {
                setAnswer("");
                setSources([]);
                setQuestion("");
              }}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-2">✅ Answer</h3>
            <p className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
              {answer}
            </p>

            {sources.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-1">📚 Sources</h4>
                <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700 max-h-40 overflow-y-auto">
                  {sources.map((s, i) => (
                    <li key={i}>
                      {s.title}{" "}
                      <span className="text-gray-400">(score {s.score.toFixed(3)})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
