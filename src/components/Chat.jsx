import { useEffect, useRef, useState } from 'react'

export default function Chat({ projectId, onGenerate, onApplyChange }) {
  const [input, setInput] = useState('Build me a modern fitness app landing page')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Describe the site you want and I will generate it instantly.' }
  ])
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const createProject = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backend}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'guest' },
        body: JSON.stringify({ prompt: input })
      })
      const data = await res.json()
      if (data.project_id) {
        onGenerate(data.project_id, data.html)
        setMessages(m => [...m, { role: 'user', content: input }, { role: 'assistant', content: 'Generated your site.' }])
      }
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  const sendEdit = async () => {
    if (!projectId) return createProject()
    setLoading(true)
    try {
      const res = await fetch(`${backend}/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'guest' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      if (data.html) onApplyChange(data.html)
      setMessages(m => [...m, { role: 'user', content: input }, { role: 'assistant', content: data.note || 'Updated.' }])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl ${m.role === 'assistant' ? 'bg-white/5 text-white/90' : 'bg-white text-gray-900'}`}>
            {m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-white/10 bg-black/30 backdrop-blur flex gap-2">
        <input
          className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none text-white placeholder-white/50"
          placeholder="Describe your site or ask for a change..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendEdit() }}
        />
        <button onClick={sendEdit} disabled={loading} className="px-4 py-2 rounded-lg font-semibold text-white bg-[#DC143C] disabled:opacity-50">{projectId ? 'Apply' : 'Generate'}</button>
      </div>
    </div>
  )
}
