import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, UserPlus } from "lucide-react"

import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"

function Register(){

const navigate = useNavigate()

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [message,setMessage]=useState("")
const [loading,setLoading]=useState(false)

const getStrength = ()=>{

if(password.length > 10) return "Strong"
if(password.length > 6) return "Medium"
if(password.length > 0) return "Weak"
return ""

}

const API = "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"


const handleRegister = async (e: React.FormEvent) => {

e.preventDefault()

console.log("REGISTER CLICKED")

setLoading(true)
setMessage("")

try{

const res = await fetch(`${API}/register`,{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})

})

console.log("STATUS:",res.status)

const data = await res.json()

console.log("DATA:",data)

if(data.success){

setMessage("Account created!")

setTimeout(()=>navigate("/"),1500)

}else{

setMessage(data.message || "Registration failed")

}

}catch(err){

console.error("ERROR:",err)

setMessage("Server error")

}

setLoading(false)

}


const handleGoogleRegister = async () => {

try{

await signInWithPopup(auth,provider)

navigate("/dashboard")

}catch{

setMessage("Google login failed")

}

}


return(

<div className="min-h-screen flex items-center justify-center relative overflow-hidden text-white">


{/* BACKGROUND */}

<div className="absolute inset-0 -z-10 bg-[#020617]" />


{/* gradient blobs */}

<div className="absolute w-[700px] h-[700px] bg-purple-500/40 blur-[160px] rounded-full animate-pulse top-[-120px] left-[-120px]" />

<div className="absolute w-[700px] h-[700px] bg-blue-500/40 blur-[160px] rounded-full animate-pulse bottom-[-120px] right-[-120px]" />

<div className="absolute w-[600px] h-[600px] bg-pink-500/30 blur-[140px] rounded-full animate-pulse top-[40%] left-[35%]" />


{/* floating particles */}

<div className="absolute inset-0">

{[...Array(35)].map((_,i)=>(
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



{/* REGISTER CARD */}

<form
onSubmit={handleRegister}
className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl w-[380px] space-y-6 shadow-[0_0_80px_rgba(139,92,246,0.35)]"
>


{/* TITLE */}

<div className="text-center">

<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
Create Account
</h2>

<p className="text-gray-400 text-sm mt-2">
Start using CreditAI
</p>

</div>


{/* MESSAGE */}

{message && (

<div className="bg-purple-500/20 p-3 rounded text-center text-sm">
{message}
</div>

)}



{/* EMAIL */}

<div className="relative">

<Mail className="absolute left-3 top-3 text-gray-400"/>

<input
type="email"
placeholder="Email address"
className="w-full pl-10 p-3 bg-black/40 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

</div>



{/* PASSWORD */}

<div className="relative">

<Lock className="absolute left-3 top-3 text-gray-400"/>

<input
type="password"
placeholder="Password"
className="w-full pl-10 p-3 bg-black/40 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

</div>



{/* PASSWORD STRENGTH */}

{password && (

<p className="text-sm text-gray-400">

Password Strength :

<span className="text-purple-400 ml-1">

{getStrength()}

</span>

</p>

)}



{/* REGISTER BUTTON */}

<button
type="submit"
disabled={loading}
className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition p-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
>

<UserPlus size={18}/>

{loading ? "Creating..." : "Create Account"}

</button>



{/* DIVIDER */}

<div className="flex items-center gap-3 text-gray-500 text-sm">

<div className="flex-1 h-[1px] bg-white/10"/>

OR

<div className="flex-1 h-[1px] bg-white/10"/>

</div>



{/* GOOGLE REGISTER */}

<button
type="button"
onClick={handleGoogleRegister}
className="flex items-center justify-center gap-2 w-full bg-white text-black p-3 rounded-xl font-semibold hover:bg-gray-200 transition"
>

<img
src="https://www.svgrepo.com/show/475656/google-color.svg"
className="w-5"
/>

Continue with Google

</button>



{/* LOGIN LINK */}

<p className="text-gray-400 text-center text-sm">

Already have account?

<Link
to="/"
className="text-purple-400 hover:text-purple-300 ml-2"
>

Login

</Link>

</p>


</form>

</div>

)

}

export default Register