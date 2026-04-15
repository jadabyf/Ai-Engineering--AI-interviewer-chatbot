import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            AI
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              AI Interview Coach
            </h1>
            <p className="text-xs text-gray-500 leading-tight">
              Practice interviews, get feedback, and improve your answers.
            </p>
          </div>
        </div>
      </header>

      {/* ── Main Chat Area ─────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col overflow-hidden bg-white shadow-sm border-x border-gray-200" style={{ minHeight: "calc(100vh - 120px)" }}>
          <ChatWindow />
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-200 py-3 px-6 text-center flex-shrink-0">
        <p className="text-xs text-gray-400">
          AI Interview Coach · Built with spec-driven development · Next.js + Rule-based AI
        </p>
      </footer>
    </div>
  );
}
