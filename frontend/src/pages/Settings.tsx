import { useState } from "react"
import { Moon, Sun, Bell, Mail, Save } from "lucide-react"
import { useAuth } from "../context/AuthContext"
// Settings page component for user preferences
function Settings(){
// Get theme and toggle function from AuthContext
const { theme, toggleTheme } = useAuth()
// State for system notifications toggle
const [notifications,setNotifications]=useState(true)
// State for email alerts toggle
const [emailAlerts,setEmailAlerts]=useState(true)
// Function to save user settings
const saveSettings=()=>{
alert("Settings saved")
}

return(
// Root container for settings page
// App container wrapper for settings layout
<div className="min-h-screen text-white">
// Max width container for centered layout
<div className="max-w-4xl">
// Page heading title
<h1 className="text-3xl font-semibold mb-8">
Settings
</h1>
// Settings card main container
<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 space-y-8">
// Theme settings section container
{/* THEME */}
// Theme toggle row layout
<div className="flex items-center justify-between">
// Theme description text block
<div>
<p className="font-semibold">Theme</p>
<p className="text-sm text-gray-400">
Switch between dark and light mode
</p>
</div>
// Theme toggle button UI
<button
onClick={toggleTheme}
className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
>// Dynamic icon rendering based on theme
{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
Toggle Theme
</button>

</div>
// System notifications section container
{/* SYSTEM NOTIFICATIONS */}
// Notifications row layout
<div className="flex items-center justify-between">
// Notifications description text
<div>
<p className="font-semibold">System Notifications</p>
<p className="text-sm text-gray-400">
AI alerts and system activity updates
</p>
</div>
// Notifications toggle button
<button // Notifications state toggle logic
onClick={()=>setNotifications(!notifications)}
className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
notifications ? "bg-green-600" : "bg-white/10"
}`}
>
<Bell size={18}/>
{notifications ? "Enabled" : "Disabled"}
</button>

</div>
// Email alerts section container
{/* EMAIL ALERTS */}
// Email alerts row layout
<div className="flex items-center justify-between">
// Email alerts description text
<div>
<p className="font-semibold">Email Alerts</p>
<p className="text-sm text-gray-400">
Receive important alerts via email
</p>
</div>
// Email alerts toggle button
<button // Email alerts state toggle logic
onClick={()=>setEmailAlerts(!emailAlerts)}
className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
emailAlerts ? "bg-green-600" : "bg-white/10"
}`}
>
<Mail size={18}/>
{emailAlerts ? "Enabled" : "Disabled"}
</button>

</div>
// Save settings section container
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