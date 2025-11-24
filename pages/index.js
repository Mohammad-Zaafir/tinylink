import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(r => r.json());

function LinkRow({ link, base, onDelete }) {
  return (
    <tr className="border-b">
      <td className="p-3 font-mono">{link.code}</td>
      <td className="p-3 truncate max-w-md" title={link.target_url}>
        <a
          className="text-blue-600 underline"
          href={link.target_url}
          target="_blank"
          rel="noreferrer"
        >
          {link.target_url}
        </a>
      </td>
      <td className="p-3">{link.total_clicks ?? 0}</td>
      <td className="p-3">{link.last_clicked ? new Date(link.last_clicked).toLocaleString() : '—'}</td>
      <td className="p-3">
        <button
          className="mr-2 px-3 py-1 rounded border"
          onClick={() => navigator.clipboard.writeText(`${base}/${link.code}`)}
        >
          Copy
        </button>
        <button
          className="px-3 py-1 rounded bg-red-500 text-white"
          onClick={() => onDelete(link.code)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const { data, mutate } = useSWR('/api/links', fetcher);
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [q, setQ] = useState('');

  const base = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

  useEffect(() => { setMsg(null); }, [targetUrl, customCode]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl, customCode: customCode || undefined })
      });
      const j = await res.json();
      if (!res.ok) throw j;
      setTargetUrl('');
      setCustomCode('');
      setMsg({ type: 'success', text: `Created ${j.code}` });
      mutate();
    } catch (err) {
      setMsg({ type: 'error', text: err?.error || err?.message || 'Error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!confirm('Delete this link?')) return;
    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw j;
      }
      mutate();
      setMsg({ type: 'success', text: `Deleted ${code}` });
    } catch (err) {
      setMsg({ type: 'error', text: err?.error || 'Delete failed' });
    }
  };

  const list = (data || []).filter(l => {
    if (!q) return true;
    const qc = q.toLowerCase();
    return (l.code && l.code.toLowerCase().includes(qc)) || (l.target_url && l.target_url.toLowerCase().includes(qc));
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">TinyLink Dashboard</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          required
          className="flex-1 border p-2 rounded"
          placeholder="https://example.com/..."
          value={targetUrl}
          onChange={e => setTargetUrl(e.target.value)}
        />
        <input
          className="w-72 border p-2 rounded"
          placeholder="custom code (6-8 chars) optional"
          value={customCode}
          onChange={e => setCustomCode(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Create'}
        </button>
      </form>

      <div className="flex items-center justify-between mb-4 gap-4">
        <input
          className="border p-2 rounded w-72"
          placeholder="Search by code or URL"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <div>
          <button
            className="px-3 py-1 mr-2 border rounded"
            onClick={() => { setTargetUrl(''); setCustomCode(''); setQ(''); setMsg(null); }}
          >
            Clear
          </button>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => mutate()}
          >
            Refresh
          </button>
        </div>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded ${msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {msg.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-3">Code</th>
              <th className="p-3">Target URL</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Last Clicked</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-600">No links yet.</td>
              </tr>
            )}
            {list.map(link => (
              <LinkRow key={link.code} link={link} base={base} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
