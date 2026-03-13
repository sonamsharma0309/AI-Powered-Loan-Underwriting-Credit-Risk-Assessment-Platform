import { useState } from "react"
import RiskGauge from "../components/RiskGauge"

export default function LoanAssessment(){

const [form,setForm]=useState({
name:"",
age:"",
income:"",
loanAmount:"",
employmentYears:"",
interestRate:"",
homeOwnership:"",
loanIntent:"",
loanGrade:"",
previousDefault:""
})

const [risk,setRisk]=useState(0)
const [decision,setDecision]=useState("")
const [explanation,setExplanation]=useState<string[]>([])
const [loading,setLoading]=useState(false)
const [error,setError]=useState("")

const API="https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"

const handleChange=(e:any)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const runAssessment=async()=>{

setLoading(true)
setError("")
setExplanation([])
setDecision("")
setRisk(0)

try{

const res=await fetch(`${API}/predict`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
})

if(!res.ok){
throw new Error("Prediction failed")
}

const data=await res.json()

setRisk(Math.round(data.risk_score || 0))
setDecision(data.decision || "Rejected")

const exp=await fetch(`${API}/explain`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
})

if(!exp.ok){
throw new Error("Explain API failed")
}

const expData=await exp.json()

setExplanation(expData.reasons || [])

}catch(e){

console.error(e)
setError("Backend connection failed")

}

setLoading(false)

}

const riskLevel = ()=>{
if(risk<40) return "Low Risk"
if(risk<70) return "Medium Risk"
return "High Risk"
}

const riskColor = ()=>{
if(risk<40) return "text-green-400"
if(risk<70) return "text-yellow-400"
return "text-red-400"
}

return(

<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#07122b] to-[#020617] text-white">

<div className="p-10 space-y-10">

{/* PAGE HEADER */}

<div>

<h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
AI Loan Decision Console
</h1>

<p className="text-gray-400 mt-1 text-sm">
Evaluate borrower profile and generate AI credit risk decision
</p>

</div>


<div className="grid lg:grid-cols-2 gap-8">


{/* FORM PANEL */}

<div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-xl shadow-xl">

<h2 className="text-xl font-semibold mb-6 text-purple-400">
Applicant Details
</h2>

<div className="grid grid-cols-2 gap-4">

<input
name="name"
placeholder="Full Name"
onChange={handleChange}
className="col-span-2 p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-purple-500 outline-none"
/>

<input
name="age"
placeholder="Age"
onChange={handleChange}
className="p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-purple-500 outline-none"
/>

<input
name="income"
placeholder="Annual Income"
onChange={handleChange}
className="p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-purple-500 outline-none"
/>

<input
name="loanAmount"
placeholder="Loan Amount"
onChange={handleChange}
className="p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-purple-500 outline-none"
/>

<input
name="employmentYears"
placeholder="Employment Years"
onChange={handleChange}
className="p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-purple-500 outline-none"
/>

<input
name="interestRate"
placeholder="Interest Rate (%)"
onChange={handleChange}
className="col-span-2 p-3 rounded-lg bg-[#0f172a] border border-white/10 focus:border-purple-500 outline-none"
/>

<select
name="homeOwnership"
onChange={handleChange}
className="p-3 rounded-lg bg-[#0f172a] border border-white/10"
>
<option value="">Home Ownership</option>
<option value="rent">Rent</option>
<option value="own">Own</option>
<option value="mortgage">Mortgage</option>
</select>

<select
name="loanIntent"
onChange={handleChange}
className="p-3 rounded-lg bg-[#0f172a] border border-white/10"
>
<option value="">Loan Intent</option>
<option value="education">Education</option>
<option value="medical">Medical</option>
<option value="personal">Personal</option>
<option value="business">Business</option>
</select>

<select
name="loanGrade"
onChange={handleChange}
className="p-3 rounded-lg bg-[#0f172a] border border-white/10"
>
<option value="">Loan Grade</option>
<option value="A">A</option>
<option value="B">B</option>
<option value="C">C</option>
<option value="D">D</option>
</select>

<select
name="previousDefault"
onChange={handleChange}
className="p-3 rounded-lg bg-[#0f172a] border border-white/10"
>
<option value="">Previous Default</option>
<option value="0">No</option>
<option value="1">Yes</option>
</select>

</div>

<button
onClick={runAssessment}
disabled={loading}
className="mt-6 w-full p-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] transition"
>

{loading ? "Running AI Model..." : "Run AI Assessment"}

</button>

{error && (
<p className="text-red-400 mt-4">{error}</p>
)}

</div>


{/* RESULT PANEL */}

<div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-xl shadow-xl">

<div className="flex items-center justify-between">

<h2 className="text-xl font-semibold text-blue-400">
AI Risk Result
</h2>

<span className="text-xs text-gray-400">
Generated by ML Risk Model
</span>

</div>

<div className="mt-6 flex justify-center">
<RiskGauge score={risk}/>
</div>

<div className="mt-6 text-center">

<div
className={`text-xl font-bold px-6 py-3 rounded-lg inline-block
${decision==="Approved"
? "bg-green-500/20 text-green-400 border border-green-400"
: decision==="Rejected"
? "bg-red-500/20 text-red-400 border border-red-400"
: "bg-yellow-500/20 text-yellow-400 border border-yellow-400"}
`}
>

{decision || "Awaiting Assessment"}

</div>

<p className={`mt-2 text-sm ${riskColor()}`}>
{riskLevel()}
</p>

</div>


{/* RISK BAR */}

<div className="mt-6">

<div className="flex justify-between text-sm text-gray-400">
<span>Risk Score</span>
<span>{risk}%</span>
</div>

<div className="w-full h-3 bg-white/10 rounded-full mt-2 overflow-hidden">

<div
className={`h-3 rounded-full transition-all duration-700
${risk < 40 ? "bg-green-400" : risk < 70 ? "bg-yellow-400" : "bg-red-500"}
`}
style={{width:`${risk}%`}}
/>

</div>

</div>


{/* EXPLAINABILITY */}

<div className="mt-8">

<h3 className="font-semibold mb-4 text-lg text-purple-400">
AI Explainability
</h3>

{explanation.length===0 && (
<p className="text-gray-500">
Run assessment to see AI reasoning
</p>
)}

<div className="space-y-3">

{explanation.map((r,i)=>(

<div
key={i}
className="bg-[#0f172a] border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-purple-500 transition"
>

<span className="text-gray-200">
{r}
</span>

<span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-400">
Factor
</span>

</div>

))}

</div>

</div>

</div>

</div>

</div>

</div>

)
}