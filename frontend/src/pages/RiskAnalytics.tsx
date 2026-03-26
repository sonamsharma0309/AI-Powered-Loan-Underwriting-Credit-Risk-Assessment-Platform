import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

interface Application {
  name: string
  age: number
  income: number
  loan: number
  decision: string
  risk: number
}

const API =
  import.meta.env.VITE_API_URL ||
  "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"

export default function RiskAnalytics() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API}/analytics`)

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }

        const data = await res.json()
        console.log("Analytics API response:", data)

        if (Array.isArray(data)) {
          setApps(data)
        } else {
          throw new Error("API did not return an array")
        }
      } catch (err: any) {
        console.error("Analytics fetch error:", err)
        setError(err.message || "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const approved = apps.filter((a) => a.decision === "Approved").length
  const rejected = apps.filter((a) => a.decision === "Rejected").length

  const approvalRate =
    apps.length > 0 ? ((approved / apps.length) * 100).toFixed(1) : "0"

  const avgRisk =
    apps.length > 0
      ? (apps.reduce((sum, a) => sum + Number(a.risk || 0), 0) / apps.length).toFixed(1)
      : "0"

  const totalLoans = apps.reduce((sum, a) => sum + Number(a.loan || 0), 0)

  const decisionData = [
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected }
  ]

  const riskBuckets = [
    { name: "Low Risk", value: apps.filter((a) => a.risk < 40).length },
    { name: "Medium Risk", value: apps.filter((a) => a.risk >= 40 && a.risk < 70).length },
    { name: "High Risk", value: apps.filter((a) => a.risk >= 70).length }
  ]

  const COLORS = ["#22c55e", "#facc15", "#ef4444"]

  if (loading) {
    return <div className="p-8 text-gray-400">Loading Analytics...</div>
  }

  if (error) {
    return <div className="p-8 text-red-400">Error: {error}</div>
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Advanced Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#1e293b] rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Loan Amount</p>
          <h2 className="text-3xl font-bold">${totalLoans.toLocaleString()}</h2>
        </div>

        <div className="bg-green-700 rounded-xl p-6">
          <p className="text-sm">Approval Rate</p>
          <h2 className="text-3xl font-bold">{approvalRate}%</h2>
        </div>

        <div className="bg-red-700 rounded-xl p-6">
          <p className="text-sm">Avg Risk Score</p>
          <h2 className="text-3xl font-bold">{avgRisk}%</h2>
        </div>

        <div className="bg-purple-700 rounded-xl p-6">
          <p className="text-sm">Active Clients</p>
          <h2 className="text-3xl font-bold">{apps.length}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-6">Loan Decisions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={decisionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#020617] p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-6">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskBuckets}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {riskBuckets.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}