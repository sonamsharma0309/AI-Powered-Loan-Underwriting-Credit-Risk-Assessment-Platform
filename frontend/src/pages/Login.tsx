import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"

export default function Login(){

const navigate = useNavigate()
const { setToken } = useAuth()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)
const [show,setShow] = useState(false)

const API="https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"


/* EMAIL LOGIN */

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


/* GOOGLE LOGIN */

const handleGoogleLogin = async () => {

setError("")

try{

const result = await signInWithPopup(auth,provider)

const user = result.user

const token = await user.getIdToken()

setToken(token)

navigate("/dashboard")

}catch(err){

console.log(err)
setError("Google login failed")

}

}


return(

<div className="min-h-screen flex items-center justify-center relative overflow-hidden text-white">

{/* BACKGROUND */}

<div className="absolute inset-0 -z-10 bg-[#020617]" />

{/* Gradient blobs */}

<div className="absolute w-[700px] h-[700px] bg-blue-500/40 blur-[160px] rounded-full animate-pulse top-[-100px] left-[-100px]" />

<div className="absolute w-[700px] h-[700px] bg-purple-500/40 blur-[160px] rounded-full animate-pulse bottom-[-100px] right-[-100px]" />

<div className="absolute w-[600px] h-[600px] bg-pink-500/30 blur-[140px] rounded-full animate-pulse top-[40%] left-[35%]" />


{/* Floating particles */}

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


{/* LOGIN CARD */}

<form
onSubmit={handleLogin}
className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl w-[380px] space-y-6 shadow-[0_0_80px_rgba(139,92,246,0.35)]"
>


{/* TITLE */}

<div className="text-center">

<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
CreditAI
</h2>

<p className="text-gray-400 text-sm mt-2">
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
required
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
required
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
className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition p-3 rounded-xl font-semibold"
>

{loading ? "Loading..." : "Login"}

</button>


{/* DIVIDER */}

<div className="flex items-center gap-3 text-gray-500 text-sm">

<div className="flex-1 h-[1px] bg-white/10"/>

OR

<div className="flex-1 h-[1px] bg-white/10"/>

</div>


{/* GOOGLE LOGIN */}

<button
type="button"
onClick={handleGoogleLogin}
className="flex items-center justify-center gap-2 w-full bg-white text-black p-3 rounded-xl font-semibold hover:bg-gray-200 transition"
>

<img
src="https://www.svgrepo.com/show/475656/google-color.svg"
className="w-5"
/>

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