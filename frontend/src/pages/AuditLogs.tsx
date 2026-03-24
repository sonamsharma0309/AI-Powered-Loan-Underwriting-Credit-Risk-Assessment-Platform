// 📄 Audit Logs Page - Tracks all system activities
import { useEffect, useState } from "react"
// 🧩 Log data structure
interface Log{
event:string
details:string
time:string
}
// 🌐 Backend API endpoint for audit logs
const API="https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"
// 🚀 AuditLogs main component
export default function AuditLogs(){
// 📦 Stores audit logs data
const [logs,setLogs]=useState<Log[]>([])
// 🔄 Fetch audit logs on component mount
useEffect(()=>{
// 📡 API call to get audit logs
fetch(`${API}/audit`)
// 🔄 Convert response to JSON
.then(res=>res.json())
// 📥 Save logs into state
.then(data=>setLogs(data))

},[])
// 🎨 Render audit logs UI
return(
// 📦 Main container
<div className="p-8 text-white">
// 🏷️ Page title
<h1 className="text-4xl font-bold mb-8">

Audit Logs

</h1>

<div className="bg-[#020617] border border-gray-800 rounded-xl overflow-hidden">
// 📋 Table wrapper container
<table className="w-full">

<thead className="border-b border-gray-800 text-gray-400">

<tr>
// 📊 Audit logs table
<th className="px-6 py-4 text-left">Event</th>
// 📌 Event column
<th className="px-6 py-4 text-left">Details</th>
// 📝 Details column
<th className="px-6 py-4 text-left">Time</th>
// ⏱️ Time column
</tr>
// 🧠 Table header section
</thead>
// 🔠 Header row
<tbody>

{logs.map((log,i)=>(

<tr key={i} className="border-t border-gray-800">

<td className="px-6 py-4 font-semibold">

{log.event}

</td>

<td className="px-6 py-4 text-gray-300">

{log.details}

</td>

<td className="px-6 py-4 text-gray-400 text-sm">

{log.time}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}