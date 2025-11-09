'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeeklyPatternData {
  day: string;
  commits: number;
}

interface WeeklyPatternChartProps {
  data: WeeklyPatternData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: WeeklyPatternData;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold">{payload[0].payload.day}</p>
        <p className="text-sm text-gray-600">
          {payload[0].value} {payload[0].value === 1 ? 'commit' : 'commits'}
        </p>
      </div>
    );
  }
  return null;
};

export function WeeklyPatternChart({ data }: WeeklyPatternChartProps) {
  // Get color based on commit count
  const getColor = (commits: number) => {
    if (commits === 0) return '#E5E7EB'; // Gray
    if (commits < 5) return '#93C5FD'; // Light blue
    if (commits < 10) return '#60A5FA'; // Medium blue
    if (commits < 20) return '#3B82F6'; // Blue
    return '#2563EB'; // Dark blue
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12 }}
          stroke="#9CA3AF"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#9CA3AF"
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
        <Bar dataKey="commits" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.commits)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
