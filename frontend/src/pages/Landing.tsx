import { useNavigate } from "react-router-dom"

export default function Landing(){

const navigate = useNavigate()

return(

<div className="relative min-h-screen text-white overflow-hidden bg-[#020617]">


{/* ===== BACKGROUND ===== */}

<div className="absolute inset-0 -z-10">

{/* base gradient */}

<div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#020617] to-black" />

{/* center radial glow */}

<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.35),transparent_60%)]" />

{/* animated blobs */}

<div className="absolute w-[700px] h-[700px] bg-purple-500/40 blur-[160px] rounded-full animate-pulse top-[-150px] left-[-150px]" />

<div className="absolute w-[700px] h-[700px] bg-blue-500/40 blur-[160px] rounded-full animate-pulse bottom-[-150px] right-[-150px]" />

<div className="absolute w-[600px] h-[600px] bg-pink-500/30 blur-[140px] rounded-full animate-pulse top-[40%] left-[35%]" />

{/* floating particles */}

<div className="absolute inset-0">

{[...Array(40)].map((_,i)=>(
<div
key={i}
className="absolute w-[3px] h-[3px] bg-white/40 rounded-full animate-ping"
style={{
top: `${Math.random()*100}%`,
left: `${Math.random()*100}%`,
animationDuration:`${2+Math.random()*3}s`
}}
/>
))}

</div>

</div>



{/* ===== NAVBAR ===== */}

<div className="flex justify-between items-center px-16 py-6 relative z-10">

<h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
CreditAI
</h1>

<div className="flex gap-6">

<button
onClick={()=>navigate("/login")}
className="px-6 py-2 border border-purple-400 rounded-lg hover:bg-purple-600/20 transition"
>
Login
</button>

<button
onClick={()=>navigate("/register")}
className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-lg shadow-purple-900/40"
>
Register
</button>

</div>

</div>



{/* ===== HERO SECTION ===== */}

<div className="flex flex-col items-center justify-center text-center mt-32 px-6">

<h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl">

AI Powered Loan Underwriting

<br/>

<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
Credit Risk Intelligence
</span>

</h1>

<p className="text-gray-300 mt-6 max-w-xl text-lg">

Automate credit risk assessment using machine learning.
Analyze applicants, predict defaults and make smarter financial decisions.

</p>


<div className="flex gap-6 mt-10">

<button
onClick={()=>navigate("/login")}
className="px-8 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition font-semibold shadow-lg shadow-purple-900/40"
>
Get Started
</button>

<button
onClick={()=>navigate("/register")}
className="px-8 py-3 border border-purple-500 rounded-xl hover:bg-purple-600/20 transition"
>
Create Account
</button>

</div>

</div>



{/* ===== FEATURES ===== */}

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-20 mt-32 pb-20 relative z-10">

{[
"AI Risk Prediction",
"Explainable Decisions",
"Analytics Dashboard",
"Real-Time Monitoring"
].map((f,i)=>(

<div
key={i}
className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-400/40 transition shadow-[0_0_40px_rgba(139,92,246,0.15)]"
>

<h3 className="text-lg font-semibold text-purple-400">
{f}
</h3>

<p className="text-gray-300 mt-2">
Advanced machine learning insights for financial institutions.
</p>

</div>

))}

</div>


</div>

)
}