import { useEffect, useState } from "react"

interface Log {
  event: string
  details: string
  time: string
}

const API =
  import.meta.env.VITE_API_URL ||
  "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"

export default function AuditLogs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${API}/audit`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data)
        } else {
          setLogs([])
        }
      })
      .catch((err) => {
        console.error("Audit fetch error:", err)
        setError(err.message || "Failed to load audit logs")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8 text-gray-400">Loading Audit Logs...</div>
  }

  if (error) {
    return <div className="p-8 text-red-400">Error: {error}</div>
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Audit Logs</h1>

      <div className="bg-[#020617] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-4 text-left">Event</th>
              <th className="px-6 py-4 text-left">Details</th>
              <th className="px-6 py-4 text-left">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <tr key={i} className="border-t border-gray-800">
                  <td className="px-6 py-4 font-semibold">{log.event}</td>

                  <td className="px-6 py-4 text-gray-300">{log.details}</td>

                  <td className="px-6 py-4 text-gray-400 text-sm">{log.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-gray-400">
                  No audit logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}