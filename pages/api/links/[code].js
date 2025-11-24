import db from '../../../lib/db';


export default async function handler(req, res) {
const { code } = req.query;


if (req.method === 'GET') {
try {
const { rows } = await db.query('SELECT code, target_url, total_clicks, last_clicked, created_at FROM links WHERE code=$1', [code]);
if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
return res.status(200).json(rows[0]);
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
}


if (req.method === 'DELETE') {
try {
const { rowCount } = await db.query('DELETE FROM links WHERE code=$1', [code]);
if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
return res.status(200).json({ ok: true });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
}


res.setHeader('Allow', ['GET','DELETE']);
res.status(405).end(`Method ${req.method} Not Allowed`);
}