import React from "react";

export default function DocCard({ doc, onSummarize, onTags, onOpen }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col gap-3 border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{doc.title}</h3>
        <small className="text-sm text-gray-500">
          by {doc.createdBy?.name || "Unknown"}
        </small>
      </div>
      <p className="text-gray-600 text-sm">
        {doc.summary || doc.content.slice(0, 140) + "..."}
      </p>
      <div className="flex flex-wrap gap-2">
        {(doc.tags || []).map((t, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onOpen}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Open
        </button>
        <button
          onClick={onSummarize}
          className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Summarize
        </button>
        <button
          onClick={onTags}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
        >
          Tags
        </button>
      </div>
    </div>
  );
}
