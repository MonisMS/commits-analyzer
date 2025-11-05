'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CommitsOverTimeData {
  date: string;
  fullDate: string;
  commits: number;
}

interface CommitsOverTimeChartProps {
  data: CommitsOverTimeData[];
}

export function CommitsOverTimeChart({ data }: CommitsOverTimeChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            labelFormatter={(value, payload) => {
              const data = payload?.[0]?.payload as CommitsOverTimeData;
              return data?.fullDate || value;
            }}
          />
          <Line
            type="monotone"
            dataKey="commits"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}