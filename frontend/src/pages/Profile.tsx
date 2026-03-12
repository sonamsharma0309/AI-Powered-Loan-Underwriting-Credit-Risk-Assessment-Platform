import { useAuth } from "../context/AuthContext"
import { User, Mail, Shield } from "lucide-react"

function Profile(){

const { user } = useAuth()

if(!user){
return <div className="text-white">Loading profile...</div>
}

return(

<div className="min-h-screen text-white">

<div className="max-w-4xl">

<h1 className="text-3xl font-semibold mb-8">
User Profile
</h1>

<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">

<div className="flex items-center gap-5">

<div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-bold">
{user.name.charAt(0)}
</div>

<div>
<p className="text-lg font-semibold">
{user.name}
</p>

<p className="text-gray-400 text-sm">
{user.email}
</p>
</div>

</div>

<div className="grid grid-cols-2 gap-6 mt-8">

<div className="bg-white/5 border border-white/10 rounded-lg p-4">

<div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
<User size={16}/>
Name
</div>

<p className="font-semibold">
{user.name}
</p>

</div>

<div className="bg-white/5 border border-white/10 rounded-lg p-4">

<div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
<Mail size={16}/>
Email
</div>

<p className="font-semibold">
{user.email}
</p>

</div>

<div className="bg-white/5 border border-white/10 rounded-lg p-4">

<div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
<Shield size={16}/>
Role
</div>

<p className="font-semibold">
{user.role || "User"}
</p>

</div>

<div className="bg-white/5 border border-white/10 rounded-lg p-4">

<div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
Account
</div>

<p className="font-semibold text-green-400">
Active
</p>

</div>

</div>

</div>

</div>

</div>

)

}

export default Profile