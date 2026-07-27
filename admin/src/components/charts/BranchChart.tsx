import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { T } from '../../constants/theme'
import { branchSales, BRANCH_KEYS, BRANCH_COLORS } from '../../constants/mockData'
import { Tip } from './Tip'

export function BranchChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={branchSales} barCategoryGap="28%" barGap={4} margin={{ top: 10, right: 4, bottom: 0, left: -18 }}>
        <defs>
          {BRANCH_COLORS.map((c, i) => (
            <linearGradient key={i} id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={1}/>
              <stop offset="100%" stopColor={c} stopOpacity={0.28}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke={T.border} strokeDasharray="3 3"/>
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: T.muted, fontWeight: 500 }} axisLine={false} tickLine={false}/>
        <YAxis tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}/>
        <Tooltip content={<Tip/>} cursor={{ fill: 'rgba(0,114,206,0.04)', radius: 6 }}/>
        {BRANCH_KEYS.map((k, i) => (
          /* Đặt barSize={12} giúp cột thon nhỏ và cân đối */
          <Bar key={k} dataKey={k} fill={`url(#bg${i})`} barSize={12} radius={[6, 6, 2, 2]}/>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}