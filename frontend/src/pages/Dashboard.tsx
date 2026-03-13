import { useEffect, useState } from "react"

const API =
  import.meta.env.VITE_API_URL ||
  "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com/"

function Dashboard(){

const [stats,setStats]=useState<any>({
total_applications:0,
approved_loans:0,
rejected_loans:0,
average_risk:0
})

useEffect(()=>{

fetch(`${API}/analytics`)
.then(res=>res.json())
.then(data=>{
setStats(data)
})
.catch(err=>{
console.error("Analytics fetch error:",err)
})

},[])


return(

<div className="min-h-screen text-white bg-gradient-to-br from-[#020617] via-[#07122b] to-[#020617]">

<div className="p-10 space-y-10">

{/* HEADER */}

<div className="flex items-center justify-between">

<div>

<h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">

AI Credit Risk Dashboard

</h1>

<p className="text-gray-400 text-sm mt-1">

Real-time insights for loan underwriting decisions

</p>

</div>


<div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">

<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>

<span className="text-sm text-gray-300">

AI Engine Active

</span>

</div>

</div>



{/* STATS */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/40 transition">

<p className="text-gray-400 text-sm">Total Applications</p>

<h2 className="text-3xl font-semibold mt-2 text-purple-400">

{stats.total_applications}

</h2>

</div>


<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-green-500/40 transition">

<p className="text-gray-400 text-sm">Approved Loans</p>

<h2 className="text-3xl font-semibold mt-2 text-green-400">

{stats.approved_loans}

</h2>

</div>


<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-red-500/40 transition">

<p className="text-gray-400 text-sm">Rejected Loans</p>

<h2 className="text-3xl font-semibold mt-2 text-red-400">

{stats.rejected_loans}

</h2>

</div>


<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-yellow-500/40 transition">

<p className="text-gray-400 text-sm">Average Risk</p>

<h2 className="text-3xl font-semibold mt-2 text-yellow-400">

{Math.round(stats.average_risk)}%

</h2>

</div>

</div>



{/* MAIN GRID */}

<div className="grid lg:grid-cols-3 gap-6">


{/* RECENT ACTIVITY */}

<div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">

<h3 className="text-lg font-semibold mb-4 text-purple-400">

Recent Activity

</h3>

<div className="space-y-4 text-sm">

<div className="flex justify-between border-b border-white/5 pb-2">

<span className="text-gray-300">Loan assessed for Sonam Sharma</span>

<span className="text-gray-500">2 min ago</span>

</div>

<div className="flex justify-between border-b border-white/5 pb-2">

<span className="text-gray-300">Risk model evaluated new applicant</span>

<span className="text-gray-500">10 min ago</span>

</div>

<div className="flex justify-between border-b border-white/5 pb-2">

<span className="text-gray-300">AI decision logged in audit system</span>

<span className="text-gray-500">25 min ago</span>

</div>

<div className="flex justify-between">

<span className="text-gray-300">Analytics dashboard updated</span>

<span className="text-gray-500">1 hour ago</span>

</div>

</div>

</div>



{/* QUICK ACTIONS */}

<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">

<h3 className="text-lg font-semibold mb-4 text-blue-400">

Quick Actions

</h3>

<div className="space-y-4 text-sm">

<div className="flex items-start gap-3">

<div className="w-2 h-2 mt-2 bg-green-400 rounded-full"/>

<div>

<p className="text-gray-200">

Assess new loan application

</p>

<p className="text-gray-500 text-xs">

Run AI credit risk model

</p>

</div>

</div>


<div className="flex items-start gap-3">

<div className="w-2 h-2 mt-2 bg-yellow-400 rounded-full"/>

<div>

<p className="text-gray-200">

Review analytics dashboard

</p>

<p className="text-gray-500 text-xs">

Monitor approval trends

</p>

</div>

</div>


<div className="flex items-start gap-3">

<div className="w-2 h-2 mt-2 bg-purple-400 rounded-full"/>

<div>

<p className="text-gray-200">

Audit system activity

</p>

<p className="text-gray-500 text-xs">

Check model decisions

</p>

</div>

</div>

</div>

</div>


</div>


{/* MODEL STATUS */}

<div className="grid md:grid-cols-2 gap-6">

<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">

<h3 className="text-lg font-semibold text-purple-400">

System Status

</h3>

<p className="text-gray-400 text-sm mt-2">

AI underwriting engine is operating normally.

</p>

<div className="mt-4">

<div className="flex justify-between text-xs text-gray-400">

<span>AI Performance</span>

<span>98%</span>

</div>

<div className="w-full bg-white/10 h-2 rounded-full mt-2">

<div className="bg-purple-500 h-2 rounded-full w-[98%]" />

</div>

</div>

</div>


<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">

<h3 className="text-lg font-semibold text-blue-400">

Model Insights

</h3>

<div className="mt-4 space-y-3 text-sm">

<div className="flex justify-between">

<span className="text-gray-400">Low Risk</span>

<span className="text-green-400">72%</span>

</div>

<div className="flex justify-between">

<span className="text-gray-400">Medium Risk</span>

<span className="text-yellow-400">18%</span>

</div>

<div className="flex justify-between">

<span className="text-gray-400">High Risk</span>

<span className="text-red-400">10%</span>

</div>

</div>

</div>

</div>


</div>

</div>

)

}

export default Dashboard