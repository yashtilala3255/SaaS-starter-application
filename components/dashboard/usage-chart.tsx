"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { UsageLog } from "@/lib/types"

interface UsageChartProps {
  data: UsageLog[]
}

export function UsageChart({ data }: UsageChartProps) {
  // Process data for chart - group by date
  const chartData = data.reduce(
    (acc, log) => {
      const date = new Date(log.created_at).toLocaleDateString()
      const existing = acc.find((item) => item.date === date)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({ date, count: 1 })
      }
      return acc
    },
    [] as { date: string; count: number }[],
  )

  // Sort by date and take last 7 days
  const sortedData = chartData.slice(-7)

  if (sortedData.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No usage data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={sortedData}>
        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
