import db from '../../lib/db';


export default async function handler(req, res) {
if (req.method === 'GET') {
try {
const { rows } = await db.query('SELECT code, target_url, total_clicks, last_clicked, created_at FROM links ORDER BY created_at DESC');
return res.status(200).json(rows);
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
}


if (req.method === 'POST') {
const { targetUrl, customCode } = req.body || {};


if (!targetUrl || !isValidUrl(targetUrl)) {
return res.status(400).json({ error: 'Invalid target URL' });
}


let code = customCode && String(customCode).trim();
if (code) {
if (!isValidCode(code)) {
return res.status(400).json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
}
} else {
// generate and ensure uniqueness
let attempts = 0;
do {
code = generateCode();
const r = await db.query('SELECT 1 FROM links WHERE code=$1', [code]);
if (r.rowCount === 0) break;
attempts++;
} while (attempts < 5);
}


try {
await db.query(
`INSERT INTO links (code, target_url, total_clicks, created_at) VALUES ($1, $2, 0, NOW())`,
[code, targetUrl]
);
const base = process.env.BASE_URL || '';
return res.status(201).json({ code, shortUrl: `${base}/${code}`, targetUrl });
} catch (err) {
if (err.code === '23505') {
return res.status(409).json({ error: 'Code already exists' });
}
console.error('Insert error', err);
return res.status(500).json({ error: 'Server error' });
}
}


res.setHeader('Allow', ['GET','POST']);
res.status(405).end(`Method ${req.method} Not Allowed`);
}