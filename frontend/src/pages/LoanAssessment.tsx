import { useState } from "react"
import RiskGauge from "../components/RiskGauge"

export default function LoanAssessment() {

  const [form, setForm] = useState({
    name: "",
    age: "",
    income: "",
    loanAmount: "",
    employmentYears: "",
    interestRate: "",
    creditHistory: "",
    homeOwnership: "",
    loanIntent: "",
    loanGrade: "",
    previousDefault: ""
  })

  const [risk, setRisk] = useState(0)
  const [decision, setDecision] = useState("")
  const [explanation, setExplanation] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const API = "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const runAssessment = async () => {

    setLoading(true)
    setError("")
    setExplanation([])
    setDecision("")
    setRisk(0)

    try {

      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        throw new Error("Prediction failed")
      }

      const data = await res.json()

      setRisk(Math.round(data.risk_score || 0))
      setDecision(data.decision || "Rejected")

      // 🔥 FIXED HERE
      const exp = await fetch(`${API}/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      if (!exp.ok) {
        throw new Error("Explain API failed")
      }

      const expData = await exp.json()
      setExplanation(expData.reasons || [])

    } catch (e) {
      console.error(e)
      setError("Backend connection failed")
    }

    setLoading(false)
  }

  const riskLevel = () => {
    if (risk < 40) return "Low Risk"
    if (risk < 70) return "Medium Risk"
    return "High Risk"
  }

  const riskColor = () => {
    if (risk < 40) return "text-green-400"
    if (risk < 70) return "text-yellow-400"
    return "text-red-400"
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#07122b] to-[#020617] text-white">

      <div className="p-10 space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            AI Loan Decision Console
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            Evaluate borrower profile and generate AI credit risk decision
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-xl">

            <h2 className="text-xl font-semibold mb-6 text-purple-400">
              Applicant Details
            </h2>

            <div className="grid grid-cols-2 gap-4">

              <input name="name" placeholder="Full Name" onChange={handleChange} className="col-span-2 p-3 rounded-lg bg-[#0f172a]" />
              <input name="age" placeholder="Age" onChange={handleChange} className="p-3 rounded-lg bg-[#0f172a]" />
              <input name="income" placeholder="Income" onChange={handleChange} className="p-3 rounded-lg bg-[#0f172a]" />
              <input name="loanAmount" placeholder="Loan Amount" onChange={handleChange} className="p-3 rounded-lg bg-[#0f172a]" />
              <input name="employmentYears" placeholder="Employment Years" onChange={handleChange} className="p-3 rounded-lg bg-[#0f172a]" />

              <select name="homeOwnership" onChange={handleChange} className="p-3 bg-[#0f172a]">
                <option value="">Home Ownership</option>
                <option value="rent">Rent</option>
                <option value="own">Own</option>
              </select>

              <select name="loanIntent" onChange={handleChange} className="p-3 bg-[#0f172a]">
                <option value="">Loan Intent</option>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
              </select>

            </div>

            <button
              onClick={runAssessment}
              className="mt-6 w-full p-3 bg-purple-600 rounded-lg"
            >
              {loading ? "Running..." : "Run AI Assessment"}
            </button>

            {error && <p className="text-red-400 mt-4">{error}</p>}

          </div>

          {/* RESULT */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-xl">

            <h2 className="text-xl text-blue-400">Result</h2>

            <div className="mt-6 flex justify-center">
              <RiskGauge score={risk} />
            </div>

            <div className="text-center mt-4">
              <h3 className="text-xl">{decision}</h3>

              <p className={`mt-2 text-sm ${riskColor()}`}>
                {riskLevel()}
              </p>

              <p className="mt-2">{risk}%</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}