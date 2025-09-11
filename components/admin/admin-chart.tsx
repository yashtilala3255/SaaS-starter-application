"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { date: "Jan 1", users: 12 },
  { date: "Jan 8", users: 19 },
  { date: "Jan 15", users: 25 },
  { date: "Jan 22", users: 32 },
  { date: "Jan 29", users: 28 },
  { date: "Feb 5", users: 35 },
  { date: "Feb 12", users: 42 },
]

export function AdminChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="users"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
