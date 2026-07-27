import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import { T } from '../../constants/theme'
import { ordersWave } from '../../constants/mockData'

export function OrdersWave() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={ordersWave} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.green} stopOpacity={0.22}/>
            <stop offset="100%" stopColor={T.green} stopOpacity={0}/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <Area type="monotone" dataKey="v" stroke={T.green} strokeWidth={2.8}
          fill="url(#wg)" dot={false}
          activeDot={{ r: 4, fill: T.green, strokeWidth: 0 }}
          style={{ filter: 'url(#glow)' }}/>
      </AreaChart>
    </ResponsiveContainer>
  )
}