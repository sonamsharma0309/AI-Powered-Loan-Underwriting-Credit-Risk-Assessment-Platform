// 📄 Applications Page - Displays all loan applications
import { useEffect, useState } from "react"
// 🧩 Application data model for table rendering
interface Application {
  name: string
  age: number
  income: number
  loan: number
  decision: string
  risk: number
}
// 🌐 Backend API endpoint
const API = "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"

export default function Applications(){

const [apps,setApps]=useState<Application[]>([])
const [loading,setLoading]=useState(true)
const [search,setSearch]=useState("")

useEffect(()=>{

fetch(`${API}/applications`)
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

const filtered=apps.filter(a=>
a.name.toLowerCase().includes(search.toLowerCase())
)

const totalLoan=apps.reduce((s,a)=>s+a.loan,0)

const avgRisk=apps.length
? (apps.reduce((s,a)=>s+a.risk,0)/apps.length).toFixed(1)
:0

const riskColor=(risk:number)=>{
if(risk<40) return "bg-green-500"
if(risk<70) return "bg-yellow-500"
return "bg-red-500"
}

return(

<div className="p-8 text-white">

<div className="flex justify-between mb-8">

<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
Loan Applications
</h1>

<input
placeholder="Search applicant..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="bg-[#0f172a] border border-gray-700 px-4 py-2 rounded-lg"
/>

</div>


{/* STATS */}

<div className="grid grid-cols-3 gap-6 mb-8">

<div className="bg-[#0f172a] p-6 rounded-xl">
<p className="text-gray-400 text-sm">Total Applications</p>
<h2 className="text-2xl font-bold">{apps.length}</h2>
</div>

<div className="bg-[#0f172a] p-6 rounded-xl">
<p className="text-gray-400 text-sm">Total Loan Amount</p>
<h2 className="text-2xl font-bold">${totalLoan.toLocaleString()}</h2>
</div>

<div className="bg-[#0f172a] p-6 rounded-xl">
<p className="text-gray-400 text-sm">Average Risk</p>
<h2 className="text-2xl font-bold">{avgRisk}%</h2>
</div>

</div>


{/* TABLE */}

<div className="bg-[#020617] rounded-xl border border-gray-800">

{loading ?

<div className="p-10 text-center text-gray-400">
Loading AI Risk Data...
</div>

:

<table className="w-full">

<thead className="text-gray-400 border-b border-gray-800">

<tr>

<th className="px-6 py-4 text-left">Applicant</th>
<th className="px-6 py-4 text-left">Age</th>
<th className="px-6 py-4 text-left">Income</th>
<th className="px-6 py-4 text-left">Loan</th>
<th className="px-6 py-4 text-left">Decision</th>
<th className="px-6 py-4 text-left">Risk</th>

</tr>

</thead>

<tbody>

{filtered.map((a,i)=>(

<tr key={i} className="border-t border-gray-800 hover:bg-[#020617]">

<td className="px-6 py-4">{a.name}</td>
<td className="px-6 py-4">{a.age}</td>
<td className="px-6 py-4">${a.income.toLocaleString()}</td>
<td className="px-6 py-4">${a.loan.toLocaleString()}</td>

<td className="px-6 py-4">

<span className={`px-3 py-1 rounded-full text-xs
${a.decision==="Approved"
?"bg-green-500/20 text-green-400"
:"bg-red-500/20 text-red-400"}
`}>
{a.decision}
</span>

</td>

<td className="px-6 py-4">

<div className="flex items-center gap-3">

<div className="w-full bg-gray-800 h-2 rounded">

<div
className={`${riskColor(a.risk)} h-2 rounded`}
style={{width:`${a.risk}%`}}
/>

</div>

<span>{a.risk}%</span>

</div>

</td>

</tr>

))}

</tbody>

</table>

}

</div>

</div>

)

}