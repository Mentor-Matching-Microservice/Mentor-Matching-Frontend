import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'

type DailyTrendChartPoint = {
  date: string
  value: number
}

type DailyTrendChartProps = {
  title: string
  description?: string
  data: DailyTrendChartPoint[]
  color: string
  valueFormatter?: (value: number) => string
}

function formatShortDate(value: string) {
  const [, month, day] = value.split('-')
  return `${day}/${month}`
}

export function DailyTrendChart({
  title,
  description,
  data,
  color,
  valueFormatter = String
}: DailyTrendChartProps) {
  return (
    <Card className='rounded-3xl shadow-none'>
      <CardContent className='p-5'>
        <div className='mb-4'>
          <h3 className='text-ink text-base font-semibold'>{title}</h3>
          {description ? <p className='text-muted mt-1 text-sm'>{description}</p> : null}
        </div>
        <div className='h-64 w-full'>
          <ResponsiveContainer height='100%' width='100%'>
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke='var(--border)' strokeDasharray='3 3' vertical={false} />
              <XAxis
                axisLine={{ stroke: 'var(--border)' }}
                dataKey='date'
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                tickFormatter={formatShortDate}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                tickFormatter={valueFormatter}
                tickLine={false}
                width={56}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--popover)',
                  color: 'var(--popover-foreground)',
                  fontSize: 13
                }}
                formatter={(value) => [valueFormatter(Number(value)), title]}
                labelFormatter={(label) => formatShortDate(String(label))}
              />
              <Line
                activeDot={{ r: 5 }}
                dataKey='value'
                dot={{ r: 3, strokeWidth: 0, fill: color }}
                stroke={color}
                strokeWidth={2}
                type='monotone'
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
