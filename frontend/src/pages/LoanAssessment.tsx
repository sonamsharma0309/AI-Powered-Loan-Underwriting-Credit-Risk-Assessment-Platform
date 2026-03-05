import { useState } from "react"
import RiskGauge from "../components/RiskGauge"

export default function LoanAssessment(){

const [form,setForm]=useState({
name:"",
age:"",
income:"",
loanAmount:"",
creditHistory:"",
employmentYears:"",
interestRate:"",
loanPercentIncome:"",
homeOwnership:"",
loanIntent:"",
loanGrade:"",
previousDefault:""
})

const [risk,setRisk]=useState(0)
const [decision,setDecision]=useState("")
const [explanation,setExplanation]=useState<string[]>([])

const API = "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com/";

const handleChange=(e:any)=>{
setForm({...form,[e.target.name]:e.target.value})
}

const runAssessment=async()=>{

const res=await fetch(`${API}/predict`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(form)
})

const data=await res.json()

setRisk(data.risk_score)
setDecision(data.decision)

const exp=await fetch(`${API}/explain`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(form)
})

const expData=await exp.json()

setExplanation(expData.reasons)

}

return(

<div className="grid grid-cols-2 gap-8 p-8 text-white">

{/* LEFT PANEL */}

<div className="bg-slate-900 p-6 rounded-xl border border-slate-700">

<h2 className="text-2xl font-semibold mb-6">
Applicant Details
</h2>

<input
name="name"
placeholder="Full Name"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-500 outline-none"
/>

<input
name="age"
placeholder="Age"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-500 outline-none"
/>

<input
name="income"
placeholder="Income"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-500 outline-none"
/>

<input
name="loanAmount"
placeholder="Loan Amount"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-500 outline-none"
/>

<input
name="employmentYears"
placeholder="Employment Years"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-500 outline-none"
/>

<input
name="interestRate"
placeholder="Interest Rate (%)"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-500 outline-none"
/>

<input
name="loanPercentIncome"
placeholder="Loan % of Income"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-500 outline-none"
/>

<input
name="creditHistory"
placeholder="Credit History (years)"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-purple-500 outline-none"
/>

<select
name="homeOwnership"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600"
>
<option value="">Home Ownership</option>
<option value="rent">Rent</option>
<option value="own">Own</option>
<option value="mortgage">Mortgage</option>
</select>

<select
name="loanIntent"
onChange={handleChange}
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600"
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
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600"
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
className="w-full mb-4 p-3 rounded-lg bg-slate-800 text-white border border-slate-600"
>
<option value="">Previous Default</option>
<option value="0">No</option>
<option value="1">Yes</option>
</select>

<button
onClick={runAssessment}
className="bg-purple-600 hover:bg-purple-700 transition w-full p-3 rounded-lg mt-2 font-semibold"
>
Run AI Assessment
</button>

</div>


{/* RIGHT PANEL */}

<div className="bg-slate-900 p-6 rounded-xl border border-slate-700">

<h2 className="text-2xl font-semibold mb-6">
AI Risk Result
</h2>

<RiskGauge score={risk}/>

<p className="mt-6 text-lg">
Decision : <span className="font-semibold">{decision}</span>
</p>

<div className="mt-6">

<h3 className="font-semibold mb-2">
AI Explanation
</h3>

<ul className="list-disc ml-6 text-gray-300">

{explanation.map((r,i)=>(
<li key={i}>{r}</li>
))}

</ul>

</div>

</div>

</div>

)
}