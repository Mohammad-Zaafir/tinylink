import useSWR from 'swr';
import { useRouter } from 'next/router';


const fetcher = (url) => fetch(url).then(r => r.json());


export default function CodeStats() {
const router = useRouter();
const { code } = router.query;
const { data, error } = useSWR(code ? `/api/links/${code}` : null, fetcher);


if (error) return <div className="p-6">Error loading</div>;
if (!data) return <div className="p-6">Loading…</div>;
if (data.error) return <div className="p-6">{data.error}</div>;


return (
<div className="p-6 max-w-3xl mx-auto">
<h1 className="text-2xl font-semibold mb-4">Stats for {data.code}</h1>
<div className="mb-2">Target URL: <a className="text-blue-600 underline" href={data.target_url} target="_blank" rel="noreferrer">{data.target_url}</a></div>
<div className="mb-2">Total Clicks: <strong>{data.total_clicks}</strong></div>
<div className="mb-2">Last Clicked: <strong>{data.last_clicked ? new Date(data.last_clicked).toLocaleString() : 'Never'}</strong></div>
<div className="mb-2">Created At: <strong>{new Date(data.created_at).toLocaleString()}</strong></div>
</div>
)
}