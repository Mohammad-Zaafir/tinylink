import db from '../lib/db';


export async function getServerSideProps({ params, res }) {
const code = params.code;
try {
const r = await db.query('SELECT target_url FROM links WHERE code=$1', [code]);
if (r.rowCount === 0) {
res.statusCode = 404;
return { notFound: true };
}
const target = r.rows[0].target_url;


await db.query('UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code=$1', [code]);


res.writeHead(302, { Location: target });
res.end();
return { props: {} };
} catch (err) {
console.error(err);
res.statusCode = 500;
return { props: {} };
}
}


export default function RedirectPage() {
return <div>Redirecting…</div>;
}