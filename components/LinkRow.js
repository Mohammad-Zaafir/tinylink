// components/LinkRow.js
import { useState } from "react";

export default function LinkRow({ link, onDelete, onCopied }) {
  const [copying, setCopying] = useState(false);

  async function handleCopy() {
    const full = `${window.location.origin}/${link.code}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopying(true);
      onCopied?.();
      setTimeout(() => setCopying(false), 1200);
    } catch (err) {
      console.error(err);
      alert("Copy failed");
    }
  }

  const lastClicked = link.last_clicked
    ? new Date(link.last_clicked).toLocaleString()
    : "-";

  return (
    <tr className="odd:bg-white even:bg-slate-50">
      <td className="p-3 align-top font-mono">{link.code}</td>
      <td className="p-3 align-top break-words">
        <a
          className="text-blue-600 underline"
          href={link.target_url}
          target="_blank"
          rel="noreferrer"
        >
          {link.target_url}
        </a>
      </td>
      <td className="p-3 align-top">{link.total_clicks ?? 0}</td>
      <td className="p-3 align-top">{lastClicked}</td>
      <td className="p-3 align-top">
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-2 py-1 border rounded text-sm"
            aria-label={`Copy ${link.code}`}
          >
            {copying ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => {
              if (confirm("Open link in new tab?")) {
                window.open(`/${link.code}`, "_blank");
              }
            }}
            className="px-2 py-1 border rounded text-sm"
          >
            Open
          </button>
          <button
            onClick={() => onDelete?.()}
            className="px-2 py-1 bg-red-600 text-white rounded text-sm"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
