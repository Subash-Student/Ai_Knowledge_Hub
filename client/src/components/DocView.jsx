// src/components/DocView.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function DocView() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const response = await api(`/api/docs/${id}`);
        setDoc(response.data);
      } catch (err) {
        setDoc(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!doc) return <div className="p-6 text-center text-red-500">Document not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4">{doc.title}</h1>
      <div className="mb-2 text-sm text-gray-500">
        By {doc.createdBy?.name || "Unknown"} on {new Date(doc.createdAt).toLocaleString()}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Tags:</span>{" "}
        {(doc.tags || []).map((tag, i) => (
          <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full mr-2 text-xs">
            {tag}
          </span>
        ))}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Summary:</span>
        <div className="bg-gray-100 rounded p-2 mt-1 text-sm">{doc.summary}</div>
      </div>
      <div>
        <span className="font-semibold">Content:</span>
        <div className="bg-gray-50 rounded p-2 mt-1 whitespace-pre-line">{doc.content}</div>
      </div>
    </div>
  );
}
