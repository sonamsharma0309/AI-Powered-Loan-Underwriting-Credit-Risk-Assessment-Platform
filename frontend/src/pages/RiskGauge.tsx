import React from "react"

export default function RiskGauge({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, score))

  const getColor = () => {
    if (safeScore < 40) return "#22c55e"
    if (safeScore < 70) return "#facc15"
    return "#ef4444"
  }

  const getLabel = () => {
    if (safeScore < 40) return "LOW RISK"
    if (safeScore < 70) return "MEDIUM RISK"
    return "HIGH RISK"
  }

  const radius = 95
  const stroke = 18
  const normalizedRadius = radius
  const circumference = Math.PI * normalizedRadius
  const progress = circumference * (1 - safeScore / 100)

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[260px] h-[170px] flex items-center justify-center">
        <svg
          width="260"
          height="170"
          viewBox="0 0 260 170"
          className="overflow-visible"
        >
          <defs>
            <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background arc */}
          <path
            d="M 35 130 A 95 95 0 0 1 225 130"
            fill="none"
            stroke="#1e293b"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <path
            d="M 35 130 A 95 95 0 0 1 225 130"
            fill="none"
            stroke={getColor()}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            filter="url(#gaugeGlow)"
            className="transition-all duration-700"
          />
        </svg>

        {/* Center content */}
        <div className="absolute top-[58px] flex flex-col items-center">
          <div className="text-5xl font-bold text-white leading-none">
            {safeScore}
            <span className="text-lg text-gray-400 ml-1">%</span>
          </div>

          <div
            className="mt-3 text-xs font-semibold tracking-[0.18em] px-3 py-1 rounded-full"
            style={{
              color: getColor(),
              backgroundColor: `${getColor()}20`,
              border: `1px solid ${getColor()}55`,
            }}
          >
            {getLabel()}
          </div>
        </div>

        {/* Soft glow bg */}
        <div
          className="absolute top-[18px] w-[180px] h-[90px] blur-3xl opacity-20 rounded-full"
          style={{ backgroundColor: getColor() }}
        />
      </div>

      <div className="w-[210px] flex justify-between text-xs text-gray-500 -mt-1">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>

      <p className="mt-3 text-sm text-gray-400">AI Credit Risk Score</p>
    </div>
  )
}