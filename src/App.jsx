import { useEffect, useState } from 'react'
import { Menu, Rocket, LogIn } from 'lucide-react'
import Chat from './components/Chat'
import Preview from './components/Preview'
import Editor from './components/Editor'
import Spline from '@splinetool/react-spline'

function App() {
  const [projectId, setProjectId] = useState(null)
  const [html, setHtml] = useState('')
  const [showAuth, setShowAuth] = useState(true)

  const handleGenerate = (id, generatedHtml) => {
    setProjectId(id)
    setHtml(generatedHtml)
  }

  const deploy = async () => {
    if (!projectId) return alert('Generate a project first')
    const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const res = await fetch(`${backend}/projects/${projectId}/deploy`, { method: 'POST', headers: { 'X-User-Id': 'guest' } })
    const data = await res.json()
    alert(`Deployed to: ${data.url}`)
  }

  return (
    <div className="min-h-screen bg-[#0b0b10] text-white relative">
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <header className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 font-extrabold tracking-tight text-xl">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-crimson-500 to-pink-500" />
            CriM🔥Son
          </div>
          <div className="flex items-center gap-2">
            <button onClick={deploy} className="hidden md:flex items-center gap-2 bg-[#DC143C] px-3 py-2 rounded-lg font-semibold"><Rocket size={16}/> Deploy</button>
            <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg"><LogIn size={16}/> Login</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[calc(100vh-56px)]">
        <section className="lg:col-span-3 rounded-xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur">
          <Chat projectId={projectId} onGenerate={handleGenerate} onApplyChange={setHtml} />
        </section>
        <section className="lg:col-span-5 rounded-xl overflow-hidden border border-white/10 bg-black/60">
          <Preview html={html} />
        </section>
        <section className="lg:col-span-4 rounded-xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur">
          <Editor html={html} onChange={setHtml} />
        </section>
      </main>

      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur animate-[fadeIn_.2s_ease]">
            <h3 className="text-2xl font-bold">Welcome to CriM🔥Son</h3>
            <p className="text-white/70 mt-1">Sign in to unlock cloud saves and deployment.</p>
            <div className="mt-6 space-y-3">
              <button className="w-full bg-white text-gray-900 font-semibold py-2 rounded-lg">Continue with Google</button>
              <button className="w-full bg-black text-white font-semibold py-2 rounded-lg border border-white/20">Continue with Apple</button>
              <button onClick={() => setShowAuth(false)} className="w-full bg-[#DC143C] text-white font-semibold py-2 rounded-lg">Continue as Guest</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
