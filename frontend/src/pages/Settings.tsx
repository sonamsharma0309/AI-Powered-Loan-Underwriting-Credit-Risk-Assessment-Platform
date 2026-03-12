import { useState } from "react"
import { Moon, Sun, Bell, Mail, Save } from "lucide-react"
import { useAuth } from "../context/AuthContext"

function Settings(){

const { theme, toggleTheme } = useAuth()

const [notifications,setNotifications]=useState(true)
const [emailAlerts,setEmailAlerts]=useState(true)

const saveSettings=()=>{
alert("Settings saved")
}

return(

<div className="min-h-screen text-white">

<div className="max-w-4xl">

<h1 className="text-3xl font-semibold mb-8">
Settings
</h1>

<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 space-y-8">

{/* THEME */}

<div className="flex items-center justify-between">

<div>
<p className="font-semibold">Theme</p>
<p className="text-sm text-gray-400">
Switch between dark and light mode
</p>
</div>

<button
onClick={toggleTheme}
className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
>
{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
Toggle Theme
</button>

</div>

{/* SYSTEM NOTIFICATIONS */}

<div className="flex items-center justify-between">

<div>
<p className="font-semibold">System Notifications</p>
<p className="text-sm text-gray-400">
AI alerts and system activity updates
</p>
</div>

<button
onClick={()=>setNotifications(!notifications)}
className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
notifications ? "bg-green-600" : "bg-white/10"
}`}
>
<Bell size={18}/>
{notifications ? "Enabled" : "Disabled"}
</button>

</div>

{/* EMAIL ALERTS */}

<div className="flex items-center justify-between">

<div>
<p className="font-semibold">Email Alerts</p>
<p className="text-sm text-gray-400">
Receive important alerts via email
</p>
</div>

<button
onClick={()=>setEmailAlerts(!emailAlerts)}
className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
emailAlerts ? "bg-green-600" : "bg-white/10"
}`}
>
<Mail size={18}/>
{emailAlerts ? "Enabled" : "Disabled"}
</button>

</div>

{/* SAVE */}

<div className="pt-6 border-t border-white/10">

<button
onClick={saveSettings}
className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg"
>
<Save size={18}/>
Save Settings
</button>

</div>

{/* VERSION */}

<div className="text-sm text-gray-500 pt-4 border-t border-white/10">
CreditAI Platform v1.0
</div>

</div>

</div>

</div>

)

}

export default Settings