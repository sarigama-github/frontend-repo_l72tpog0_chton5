import { useEffect, useRef } from 'react'

export default function Editor({ html, onChange }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.value = html || ''
  }, [html])

  return (
    <div className="h-full flex flex-col">
      <textarea
        ref={ref}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full bg-black text-green-200 font-mono text-sm p-4 outline-none"
        spellCheck={false}
      />
    </div>
  )
}
