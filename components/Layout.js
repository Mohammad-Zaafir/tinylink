// components/Layout.js
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">TL</div>
            <h2 className="text-lg font-semibold">TinyLink</h2>
          </div>
          <nav className="text-sm text-slate-600">
            <a className="mr-4" href="/">Dashboard</a>
            <a href="/api/links" target="_blank" rel="noreferrer">API</a>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-12 py-6 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 text-sm text-slate-500">
          © {new Date().getFullYear()} TinyLink — built by Mohammad Zaafir
        </div>
      </footer>
    </div>
  );
}
