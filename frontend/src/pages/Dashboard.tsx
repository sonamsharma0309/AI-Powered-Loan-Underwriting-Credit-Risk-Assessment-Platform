import { useEffect, useState } from "react"
// API base URL configuration
const API =
  import.meta.env.VITE_API_URL ||
  "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"
// Dashboard component for analytics overview
function Dashboard() {
// State for storing dashboard statistics
  const [stats, setStats] = useState<any>({
    total_applications: 0,
    approved_loans: 0,
    rejected_loans: 0,
    average_risk: 0
  })
// Effect hook to fetch analytics data on load
  useEffect(() => {
// Fetch analytics data from backend API
    fetch(`${API}/analytics`)
    // Convert response to JSON
      .then(res => res.json())
      // Handle API response data
      .then(data => { // Debug log for API response
        console.log("API DATA:", data)

        // 🔥 SAFE HANDLING
        // Safe fallback handling for API data
        const safeData = data?.data || data || {}
// Update stats state with safe data
        setStats({
          total_applications: safeData.total_applications || 0,
          approved_loans: safeData.approved_loans || 0,
          rejected_loans: safeData.rejected_loans || 0,
          average_risk: safeData.average_risk || 0
        })
      })
      // Handle API errors gracefully
      .catch(err => {
        console.error("Analytics fetch error:", err)
      })

  }, [])

  return (
// Root container for dashboard UI
    <div className="min-h-screen text-white bg-gradient-to-br from-[#020617] via-[#07122b] to-[#020617]">
// Main padding and spacing container
      <div className="p-10 space-y-10">
// Header section for dashboard title and status
        {/* HEADER */}
        // Header layout using flexbox
        <div className="flex items-center justify-between">
// Dashboard title text styling
          <div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              AI Credit Risk Dashboard
            </h1>
// Dashboard subtitle description
            <p className="text-gray-400 text-sm mt-1">
              Real-time insights for loan underwriting decisions
            </p>
          </div>
// AI engine status indicator container
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            // AI engine active text display
            <span className="text-sm text-gray-300">
              AI Engine Active
            </span>
          </div>

        </div>
// Live status indicator dot animation
        {/* STATS */}
        // Stats grid layout container
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          // Total applications card UI
            <p className="text-gray-400 text-sm">Total Applications</p>
            <h2 className="text-3xl font-semibold mt-2 text-purple-400">
              {stats.total_applications}
            </h2>
          </div>
// Approved loans card UI
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Approved Loans</p>
            <h2 className="text-3xl font-semibold mt-2 text-green-400">
              {stats.approved_loans}
            </h2>
          </div>
// Rejected loans card UI
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Rejected Loans</p>
            <h2 className="text-3xl font-semibold mt-2 text-red-400">
              {stats.rejected_loans}
            </h2>
          </div>
// Average risk percentage card UI
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Average Risk</p>
            // Card container styling with backdrop blur
            <h2 className="text-3xl font-semibold mt-2 text-yellow-400">
              // Card title text styling
              {(stats.average_risk * 100).toFixed(2)}%
            </h2>
          </div>

        </div>

      </div>

    </div>

  )
}

export default Dashboard