import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function Login(){

const navigate = useNavigate()
const { setToken } = useAuth()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)
const [show,setShow] = useState(false)

const API="https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com/";

const handleLogin = async (e:any) => {

e.preventDefault()

setLoading(true)
setError("")

try{

const res = await fetch(`${API}/login`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({email,password})
})

const data = await res.json()

if(data.success){

setToken(data.token)
navigate("/dashboard")

}else{

setError("Invalid email or password")

}

}catch{

setError("Server error")

}

setLoading(false)

}

return(

<div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">

{/* Animated Background */}

<div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"/>

<div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-30 blur-[180px] -top-40 -left-40 animate-pulse"/>

<div className="absolute w-[500px] h-[500px] bg-indigo-600 opacity-20 blur-[160px] bottom-0 right-0 animate-pulse"/>


{/* Floating Particles */}

<div className="absolute inset-0 pointer-events-none">

{[...Array(25)].map((_,i)=>(
<div
key={i}
className="absolute bg-purple-400 opacity-20 rounded-full animate-ping"
style={{
width: Math.random()*6+3,
height: Math.random()*6+3,
top: Math.random()*100+"%",
left: Math.random()*100+"%",
animationDuration: (Math.random()*4+2)+"s"
}}
/>
))}

</div>


{/* LOGIN CARD */}

<form
onSubmit={handleLogin}
className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl w-[380px] space-y-6 shadow-2xl"
>

{/* TITLE */}

<div className="text-center space-y-2">

<h2 className="text-3xl font-bold text-purple-400">
CreditAI
</h2>

<p className="text-gray-400 text-sm">
AI Powered Credit Risk Platform
</p>

</div>


{/* ERROR */}

{error && (
<p className="text-red-400 text-sm text-center">
{error}
</p>
)}


{/* EMAIL */}

<div className="relative">

<Mail size={18} className="absolute left-3 top-3 text-gray-400"/>

<input
type="email"
placeholder="Email address"
className="w-full pl-10 p-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 outline-none"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

</div>


{/* PASSWORD */}

<div className="relative">

<Lock size={18} className="absolute left-3 top-3 text-gray-400"/>

<input
type={show ? "text":"password"}
placeholder="Password"
className="w-full pl-10 pr-10 p-3 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 outline-none"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<div
onClick={()=>setShow(!show)}
className="absolute right-3 top-3 cursor-pointer text-gray-400"
>

{show ? <EyeOff size={18}/> : <Eye size={18}/>}

</div>

</div>


{/* LOGIN BUTTON */}

<button
type="submit"
className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition p-3 rounded-xl font-semibold flex items-center justify-center"
>

{loading ? (
<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
) : (
"Login"
)}

</button>


{/* DIVIDER */}

<div className="flex items-center gap-3 text-gray-500 text-sm">

<div className="flex-1 h-[1px] bg-white/10"/>

OR

<div className="flex-1 h-[1px] bg-white/10"/>

</div>


{/* GOOGLE BUTTON UI */}

<button
type="button"
className="flex items-center justify-center gap-2 w-full bg-white text-black p-3 rounded-xl font-semibold hover:bg-gray-200 transition"
>

Continue with Google

</button>


{/* REGISTER */}

<p className="text-center text-gray-400 text-sm">

No account ?

<Link
to="/register"
className="text-purple-400 hover:text-purple-300 ml-2"
>

Register

</Link>

</p>

</form>

</div>

)

}