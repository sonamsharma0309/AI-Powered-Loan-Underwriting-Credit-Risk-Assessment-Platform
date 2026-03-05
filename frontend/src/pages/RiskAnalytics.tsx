import { useEffect, useState } from "react"
import {
BarChart,
Bar,
PieChart,
Pie,
ResponsiveContainer,
XAxis,
YAxis,
Tooltip,
Cell
} from "recharts"
const API="https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com/";

export default function RiskAnalytics(){

const [stats,setStats] = useState<any>(null)
const [apps,setApps] = useState<any[]>([])

useEffect(()=>{

fetch(`${API}/analytics`)
.then(res=>res.json())
.then(data=>setStats(data))

fetch(`${API}/applications`)
.then(res=>res.json())
.then(data=>setApps(data))

},[])

if(!stats) return <div className="p-8 text-white">Loading...</div>


// ---------- RISK BUCKETS ----------

let low = 0
let medium = 0
let high = 0

apps.forEach(a=>{

if(a.risk < 30) low++
else if(a.risk < 60) medium++
else high++

})


const pieData = [
{ name:"Low Risk", value:low },
{ name:"Medium Risk", value:medium },
{ name:"High Risk", value:high }
]

const barData = [
{ name:"Approved", value:stats.approved },
{ name:"Rejected", value:stats.rejected }
]


return(

<div className="space-y-10 text-white">

<h1 className="text-3xl font-bold">
Advanced Analytics
</h1>


{/* KPI CARDS */}

<div className="grid grid-cols-4 gap-6">

<div className="bg-slate-800 p-6 rounded-xl">
<h2>Total Loans</h2>
<p className="text-3xl">{stats.total}</p>
</div>

<div className="bg-green-700 p-6 rounded-xl">
<h2>Approval Rate</h2>
<p className="text-3xl">
{stats.total ? Math.round((stats.approved / stats.total)*100) : 0}%
</p>
</div>

<div className="bg-red-700 p-6 rounded-xl">
<h2>Avg Risk Score</h2>
<p className="text-3xl">
{Math.round(stats.avg_risk || 0)}
</p>
</div>

<div className="bg-purple-700 p-6 rounded-xl">
<h2>Active Clients</h2>
<p className="text-3xl">
{stats.total}
</p>
</div>

</div>


{/* CHARTS */}

<div className="grid grid-cols-2 gap-8">


{/* BAR CHART */}

<div className="bg-slate-900 p-6 rounded-xl">

<h2 className="mb-4">Loan Decisions</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={barData}>

<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="value" fill="#8b5cf6"/>

</BarChart>

</ResponsiveContainer>

</div>


{/* PIE CHART */}

<div className="bg-slate-900 p-6 rounded-xl">

<h2 className="mb-4">Risk Distribution</h2>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={pieData}
dataKey="value"
nameKey="name"
outerRadius={120}
label
>

<Cell fill="#22c55e"/>
<Cell fill="#eab308"/>
<Cell fill="#ef4444"/>

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>


</div>

</div>

)

}