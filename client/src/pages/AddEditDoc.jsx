import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";

export default function AddEditDoc() {
  const { id } = useParams();
  const isNew = !id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");
  const [versions, setVersions] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!isNew) {
        const d = await api(`/api/docs/${id}`);
        setTitle(d.data.title);
        setContent(d.data.content);
        setTags((d.data.tags || []).join(", "));
        setSummary(d.data.summary || "");
        const v = await api(`/api/docs/${id}/versions`);
        setVersions(v.data);
      }
    };
    load();
  }, [id, isNew]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      title,
      content,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      summary,
    };
    try {
      if (isNew) {
        await api("/api/docs", { method: "POST", body: JSON.stringify(body) });
      } else {
        await api(`/api/docs/${id}`, { method: "PUT", body: JSON.stringify(body) });
      }
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  // ...

  const summarizeDoc = async () => {
    try {
      const res = await api(`/api/docs/${id}/summarize`, { method: "POST" });
      setSummary(res.summary || "");
      toast.success("Summary generated!");
    } catch (err) {
      toast.info(err.message || "Failed to summarize");
    }
  };
  
  const tagsGen = async () => {
    try {
      const res = await api(`/api/docs/${id}/tags`, { method: "POST" });
      setTags((res.tags || []).join(", "));
      toast.success("Tags generated!");
    } catch (err) {
      toast.info(err.message || "Failed to generate tags");
    }
  };

// ...


  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 mt-10">
      <form onSubmit={save} className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center mb-2">
          {isNew ? "New Document" : "Edit Document"}
        </h2>
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          rows={14}
          className="border p-2 rounded min-h-[280px]"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div>
          {/* Tags Field */}
          <input
            className="border p-2 rounded w-full"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isNew}
          />
          <button
            type="button"
            onClick={tagsGen}
            disabled={isNew}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
          >
            Generate Tags
          </button>
        </div>

        <div>
          {/* Summarize Field */}
          <textarea
          rows={8}
            className="border p-2 rounded w-full"
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            disabled={isNew}
          />
          <button
            type="button"
            onClick={summarizeDoc}
            disabled={isNew}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 mt-2"
          >
            Generate Summary
          </button>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : isNew ? "Create" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>

      {!isNew && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-lg">Version History</h3>
          <ul className="space-y-3">
            {versions.map((v) => (
              <li key={v._id} className="border-b last:border-none pb-2">
                <div className="font-medium">{v.title}</div>
                <div className="text-xs text-gray-500">
                  Edited by {v.editedBy?.name || "Unknown"} on{" "}
                  {new Date(v.editedAt).toLocaleString()}
                </div>
              </li>
            ))}
            {versions.length === 0 && (
              <li className="text-gray-500 text-sm">No previous versions.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
