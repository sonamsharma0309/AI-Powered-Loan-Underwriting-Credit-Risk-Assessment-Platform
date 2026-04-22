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
    previousDefault: "",
  })

  const [risk, setRisk] = useState(0)
  const [decision, setDecision] = useState("")
  const [explanation, setExplanation] = useState<string[]>([])
  const [overrideReason, setOverrideReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasAssessed, setHasAssessed] = useState(false)

  const API =
    import.meta.env.VITE_API_URL ||
    "https://ai-powered-loan-underwriting-credit-risk-3at2.onrender.com"

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const runAssessment = async () => {
    if (
      !form.name ||
      !form.age ||
      !form.income ||
      !form.loanAmount ||
      !form.employmentYears ||
      !form.interestRate ||
      !form.creditHistory ||
      !form.homeOwnership ||
      !form.loanIntent ||
      !form.loanGrade ||
      !form.previousDefault
    ) {
      setError("Please fill all fields.")
      return
    }

    setLoading(true)
    setError("")
    setExplanation([])
    setDecision("")
    setOverrideReason("")
    setRisk(0)
    setHasAssessed(false)

    try {
      const payload = {
        name: form.name,
        age: Number(form.age),
        income: Number(form.income),
        loanAmount: Number(form.loanAmount),
        employmentYears: Number(form.employmentYears),
        interestRate: Number(form.interestRate),
        creditHistory: Number(form.creditHistory),
        homeOwnership: form.homeOwnership,
        loanIntent: form.loanIntent,
        loanGrade: form.loanGrade,
        previousDefault: form.previousDefault,
      }

      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Prediction failed")
      }

      setRisk(Math.round(data.risk_score || 0))
      setDecision(data.decision || "Rejected")
      setOverrideReason(data.override_reason || "")
      setHasAssessed(true)

      const exp = await fetch(`${API}/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (exp.ok) {
        const expData = await exp.json()
        setExplanation(expData.reasons || [])
      }
    } catch (err: any) {
      console.error("Assessment error:", err)
      setError(err.message || "Something went wrong while assessing the loan.")
      setHasAssessed(false)
    } finally {
      setLoading(false)
    }
  }

  const riskColor = () => {
    if (!hasAssessed) return "text-gray-400"
    if (risk < 40) return "text-green-400"
    if (risk < 70) return "text-yellow-400"
    return "text-red-400"
  }

  const riskLevel = () => {
    if (!hasAssessed) return "Awaiting Assessment"
    if (risk < 40) return "Low Risk"
    if (risk < 70) return "Medium Risk"
    return "High Risk"
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#111827] rounded-2xl shadow-xl border border-white/10 p-8">
          <h1 className="text-3xl font-bold mb-2">Loan Assessment</h1>
          <p className="text-gray-400 mb-8">
            Fill in applicant details to predict risk and decision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10 outline-none"
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10 outline-none"
            />

            <input
              type="number"
              name="income"
              placeholder="Income"
              value={form.income}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10 outline-none"
            />

            <input
              type="number"
              name="loanAmount"
              placeholder="Loan Amount"
              value={form.loanAmount}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10 outline-none"
            />

            <input
              type="number"
              name="employmentYears"
              placeholder="Employment Years"
              value={form.employmentYears}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10 outline-none"
            />

            <input
              type="number"
              step="0.01"
              name="interestRate"
              placeholder="Interest Rate"
              value={form.interestRate}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10 outline-none"
            />

            <input
              type="number"
              name="creditHistory"
              placeholder="Credit History"
              value={form.creditHistory}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10 outline-none"
            />

            <select
              name="homeOwnership"
              value={form.homeOwnership}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10"
            >
              <option value="">Home Ownership</option>
              <option value="rent">Rent</option>
              <option value="own">Own</option>
              <option value="mortgage">Mortgage</option>
              <option value="other">Other</option>
            </select>

            <select
              name="loanIntent"
              value={form.loanIntent}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10"
            >
              <option value="">Loan Intent</option>
              <option value="education">Education</option>
              <option value="medical">Medical</option>
              <option value="personal">Personal</option>
              <option value="venture">Venture</option>
              <option value="homeimprovement">Home Improvement</option>
              <option value="debtconsolidation">Debt Consolidation</option>
            </select>

            <select
              name="loanGrade"
              value={form.loanGrade}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#0f172a] border border-white/10"
            >
              <option value="">Loan Grade</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
            </select>

            <select
              name="previousDefault"
              value={form.previousDefault}
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
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 transition rounded-lg py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Assessing..." : "Run Assessment"}
          </button>

          {error && <p className="mt-4 text-red-400">{error}</p>}
        </div>

        <div className="bg-[#111827] rounded-2xl shadow-xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-6">Assessment Result</h2>

          <div className="bg-[#0f172a] rounded-2xl p-8 border border-white/10">
            <div className="flex justify-center mb-8">
              <RiskGauge score={hasAssessed ? risk : 0} />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Decision</h3>

              <span
                className={`px-5 py-2 rounded-full text-sm font-medium border ${
                  !hasAssessed
                    ? "bg-gray-500/15 text-gray-300 border-gray-400/30"
                    : decision === "Approved"
                    ? "bg-green-500/15 text-green-400 border-green-400/40"
                    : "bg-red-500/15 text-red-400 border-red-400/40"
                }`}
              >
                {hasAssessed ? decision : "Pending"}
              </span>
            </div>

            {hasAssessed && overrideReason && (
              <p className="mt-5 text-orange-400 text-sm font-medium">
                ⚠ Rule Override: {overrideReason}
              </p>
            )}

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Risk Score</h3>
                <span className="text-2xl font-bold text-white">
                  {hasAssessed ? `${risk}%` : "--"}
                </span>
              </div>

              <p className={`mt-2 text-lg font-medium ${riskColor()}`}>
                {riskLevel()}
              </p>

              <div className="mt-5 w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${
                    !hasAssessed
                      ? "bg-gray-500"
                      : risk < 40
                      ? "bg-green-400"
                      : risk < 70
                      ? "bg-yellow-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${hasAssessed ? risk : 0}%` }}
                />
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-bold mb-5 text-2xl text-purple-400">
                AI Explainability
              </h3>

              {!hasAssessed ? (
                <p className="text-gray-500">
                  Run assessment to see AI reasoning
                </p>
              ) : explanation.length === 0 ? (
                <p className="text-gray-500">
                  No explanation available for this assessment
                </p>
              ) : (
                <div className="space-y-4">
                  {explanation.map((reason, index) => (
                    <div
                      key={index}
                      className="bg-[#0b1220] border border-white/10 rounded-xl px-5 py-4 flex justify-between items-center gap-4"
                    >
                      <span className="text-gray-100">{reason}</span>

                      <span className="shrink-0 text-xs px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30">
                        Factor
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}