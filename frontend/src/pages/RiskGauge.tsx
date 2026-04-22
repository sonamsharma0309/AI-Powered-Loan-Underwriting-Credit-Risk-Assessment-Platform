import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"

export default function RiskGauge({ score }: { score: number }) {
  const data = [{ name: "risk", value: score }]

  const getColor = () => {
    if (score < 40) return "#22c55e"
    if (score < 70) return "#facc15"
    return "#ef4444"
  }

  const getLabel = () => {
    if (score < 40) return "LOW RISK"
    if (score < 70) return "MEDIUM RISK"
    return "HIGH RISK"
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div
        className="absolute w-[260px] h-[260px] rounded-full blur-[60px] opacity-40"
        style={{ background: getColor() }}
      />

      <RadialBarChart
        width={280}
        height={280}
        cx="50%"
        cy="55%"
        innerRadius="70%"
        outerRadius="100%"
        barSize={18}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

        <RadialBar
          background={{ fill: "#1e293b" }}
          dataKey="value"
          cornerRadius={30}
          fill={getColor()}
          animationDuration={1500}
        />
      </RadialBarChart>

      <div className="absolute flex flex-col items-center">
        <div className="text-5xl font-bold tracking-tight text-white">
          {score}
          <span className="text-lg ml-1 text-gray-400">%</span>
        </div>

        <div
          className="mt-2 text-xs font-semibold tracking-widest px-3 py-1 rounded-full"
          style={{
            background: getColor() + "20",
            color: getColor(),
            border: `1px solid ${getColor()}`,
          }}
        >
          {getLabel()}
        </div>
      </div>

      <div className="absolute bottom-6 flex justify-between w-[200px] text-xs text-gray-500">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>

      <div className="mt-4 text-sm text-gray-400">AI Credit Risk Score</div>
    </div>
  )
}