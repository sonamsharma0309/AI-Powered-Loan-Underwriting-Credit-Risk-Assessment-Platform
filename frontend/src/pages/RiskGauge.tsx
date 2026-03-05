import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"

export default function RiskGauge({score}:{score:number}){

const data=[{name:"risk",value:score}]

return(

<div className="flex justify-center relative">

<RadialBarChart
width={250}
height={250}
cx="50%"
cy="50%"
innerRadius="70%"
outerRadius="100%"
barSize={20}
data={data}
startAngle={180}
endAngle={0}
>

<PolarAngleAxis
type="number"
domain={[0,100]}
tick={false}
/>

<RadialBar
background
dataKey="value"
fill="#a855f7"
/>

</RadialBarChart>

<div className="absolute text-3xl font-bold top-24">
{score}
</div>

</div>

)
}