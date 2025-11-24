// pages/index.js
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LinkRow from "../components/LinkRow";

export default function Home() {
  const [links, setLinks] = useState([]);
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function fetchLinks() {
    setLoading(true);
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load links", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!targetUrl) return showToast("Enter a URL", "error");
    setSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl, customCode }),
      });
      if (!res.ok) throw new Error("Failed to create");
      showToast("Link created", "success");
      setTargetUrl("");
      setCustomCode("");
      await fetchLinks();
    } catch (err) {
      console.error(err);
      showToast("Error creating link", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(code) {
    if (!confirm(`Delete link "${code}" ?`)) return;
    try {
      const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Deleted", "success");
      await fetchLinks();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete", "error");
    }
  }

  const filtered = links.filter((l) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (l.code && l.code.toLowerCase().includes(q)) ||
      (l.target_url && l.target_url.toLowerCase().includes(q))
    );
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">TinyLink Dashboard</h1>

        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-[1fr,240px,120px] gap-3 mb-4"
        >
          <input
            className="p-2 border rounded-md focus:outline-none focus:ring"
            placeholder="https://example.com/..."
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />
          <input
            className="p-2 border rounded-md focus:outline-none focus:ring"
            placeholder="Custom code (optional)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-4 rounded-md disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              className="border px-3 rounded-md"
              onClick={() => {
                setTargetUrl("");
                setCustomCode("");
              }}
            >
              Clear
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between mb-4 gap-3">
          <input
            className="p-2 border rounded-md w-full md:w-1/2"
            placeholder="Search by code or URL"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded-md"
              onClick={() => {
                setQuery("");
                fetchLinks();
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Target URL</th>
                <th className="text-left p-3">Clicks</th>
                <th className="text-left p-3">Last Clicked</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    No links found
                  </td>
                </tr>
              ) : (
                filtered.map((link) => (
                  <LinkRow
                    key={link.code}
                    link={link}
                    onDelete={() => handleDelete(link.code)}
                    onCopied={() => showToast("Copied to clipboard")}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* toast */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 px-4 py-2 rounded-md shadow-md text-white ${
              toast.type === "error"
                ? "bg-red-600"
                : toast.type === "success"
                ? "bg-green-600"
                : "bg-gray-800"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </Layout>
  );
}
