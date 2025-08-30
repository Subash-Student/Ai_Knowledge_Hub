import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import DocCard from "../components/DocCard";
import ActivityFeed from "../components/ActivityFeed";
import Skeleton from "../components/Skeleton";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext"; // Adjust path if needed

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState(""); // input value
  const [tag, setTag] = useState("");     // actual filter
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const list = await api("/api/docs" + (tag ? `?tag=${encodeURIComponent(tag)}` : ""));
      setDocs(list.data);
      const act = await api("/api/docs/activity/feed/latest");
      setActivity(act.data);
    } catch (err) {
      toast.error(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tag]);

  const getId = (idOrObj) => {
    if (!idOrObj) return null;
    if (typeof idOrObj === "string") return idOrObj;
    if (typeof idOrObj === "object" && idOrObj._id) return idOrObj._id.toString();
    if (typeof idOrObj === "object" && idOrObj.toString) return idOrObj.toString();
    return null;
  };
  
  const handleOpen = (doc) => {
    const myId = getId(user?.id);
    const isAdmin = user?.role === "admin";
    const createdById = getId(doc.createdBy);
  
    console.log("Comparing userId and createdById:", myId, createdById);
  
    const isOwner = myId && createdById && myId === createdById;
  
    if (isAdmin || isOwner) {
      navigate(`/docs/${doc._id}`); // editable page
    } else {
      navigate(`/docs/${doc._id}/view`); // read-only page
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mt-10">
      {/* Left Panel */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📄 Documents</h2>
          <Link
            to="/docs/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + New Doc
          </Link>
        </div>

        {/* Search Filter */}
        <div className="flex gap-3 mb-6">
          <input
            className="border p-2 rounded w-full max-w-xs"
            placeholder="Filter by tag (exact)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => setTag(query)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Search
          </button>
          <button
            onClick={() => {
              setQuery("");
              setTag("");
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Clear
          </button>
        </div>

        {/* Document List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-6 text-gray-600 text-center">
            No documents yet. Create your first one!
          </div>
        ) : (
          <div className="grid gap-4">
            {docs.map((d) => (
              <DocCard
                key={d._id}
                doc={d}
                onOpen={() => handleOpen(d)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div>
        <h3 className="text-lg font-semibold mb-4">🕒 Recent Activity</h3>
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <ActivityFeed items={activity} />
        )}
      </div>
    </div>
  );
}
