import React from "react";

export default function ActivityFeed({ items }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 border border-gray-100">
      <h4 className="font-semibold text-gray-700 mb-2">Team Activity Feed</h4>
      <ul className="space-y-3">
        {items.map((a) => (
          <li key={a._id} className="text-sm text-gray-600">
            <strong className="text-indigo-600">{a.userName}</strong>{" "}
            {a.action} <em>{a.docTitle}</em> —{" "}
            <span className="text-gray-400">
              {new Date(a.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
