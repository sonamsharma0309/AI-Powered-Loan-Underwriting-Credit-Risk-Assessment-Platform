// 🔥 Analytics Page - Fetching and Visualizing Loan Data
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"
// 📊 Application data structure for analytics charts
interface Application {
  name: string
  age: number
  income: number
  loan: number
  decision: string
  risk: number
}
// 🌐 Backend API base URL for analytics
const API = "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"
// 🚀 Main Analytics Component
export default function Analytics() {
// 📦 State for storing applications data

const [apps,setApps] = useState<Application[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

fetch(`${API}/analytics`)
.then(res=>res.json())
.then(data=>{
setApps(data)
setLoading(false)
})
.catch(err=>{
console.error(err)
setLoading(false)
})

},[])

if(loading){
return(
<div className="p-10 text-center text-gray-400">
Loading Analytics...
</div>
)
}

const totalLoans = apps.reduce((s,a)=>s+a.loan,0)

const approved = apps.filter(a=>a.decision==="Approved").length

const approvalRate = apps.length
? ((approved/apps.length)*100).toFixed(1)
:0

const avgRisk = apps.length
? (apps.reduce((s,a)=>s+a.risk,0)/apps.length).toFixed(1)
:0

// chart data
const chartData = apps.map((a,i)=>({
name:a.name,
loan:a.loan,
risk:a.risk
}))

return (

<div className="p-8 space-y-8">

<div>
<h1 className="text-3xl font-bold">Advanced Analytics</h1>
<p className="text-gray-500">
Credit risk insights and loan performance overview
</p>
</div>

{/* KPI CARDS */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

<div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
<p className="text-gray-500 text-sm">Total Loans</p>
<h2 className="text-3xl font-bold mt-2">${totalLoans.toLocaleString()}</h2>
</div>

<div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
<p className="text-gray-500 text-sm">Approval Rate</p>
<h2 className="text-3xl font-bold mt-2 text-green-500">{approvalRate}%</h2>
</div>

<div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
<p className="text-gray-500 text-sm">Risk Score Avg</p>
<h2 className="text-3xl font-bold mt-2 text-red-500">{avgRisk}</h2>
</div>

<div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
<p className="text-gray-500 text-sm">Applications</p>
<h2 className="text-3xl font-bold mt-2">{apps.length}</h2>
</div>

</div>

{/* CHARTS */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

<div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6">
<h2 className="mb-4 font-semibold text-lg">Loan Amounts</h2>

<ResponsiveContainer width="100%" height={300}>
<BarChart data={chartData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Legend/>

<Bar dataKey="loan" fill="#6366f1"/>
</BarChart>
</ResponsiveContainer>

</div>

<div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6">
<h2 className="mb-4 font-semibold text-lg">Risk Distribution</h2>

<ResponsiveContainer width="100%" height={300}>
<PieChart>
<Pie
data={chartData}
dataKey="risk"
nameKey="name"
outerRadius={120}
fill="#22c55e"
label
/>
<Tooltip/>
</PieChart>
</ResponsiveContainer>

</div>

</div>

<div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6">
<h2 className="mb-4 font-semibold text-lg">Risk Trend</h2>

<ResponsiveContainer width="100%" height={320}>
<AreaChart data={chartData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Area
type="monotone"
dataKey="risk"
stroke="#ef4444"
fill="#fecaca"
/>

</AreaChart>
</ResponsiveContainer>

</div>

</div>

)

}
