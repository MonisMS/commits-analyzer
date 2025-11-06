'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HourlyActivityData {
  hour: string;
  commits: number;
  hourNum: number;
}

interface DailyActivityPatternProps {
  data: HourlyActivityData[];
}

export function DailyActivityPattern({ data }: DailyActivityPatternProps) {
  // Get color based on commit count (heatmap style)
  const getColor = (commits: number, maxCommits: number) => {
    if (commits === 0) return '#F3F4F6'; // Very light gray
    const intensity = commits / maxCommits;
    if (intensity < 0.25) return '#DBEAFE'; // Very light blue
    if (intensity < 0.5) return '#93C5FD'; // Light blue
    if (intensity < 0.75) return '#3B82F6'; // Blue
    return '#1D4ED8'; // Dark blue
  };

  const maxCommits = Math.max(...data.map(d => d.commits), 1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const hourNum = payload[0].payload.hourNum;
      const formatHour = (h: number) => {
        if (h === 0) return '12 AM';
        if (h === 12) return '12 PM';
        return h > 12 ? `${h - 12} PM` : `${h} AM`;
      };

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{formatHour(hourNum)}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} {payload[0].value === 1 ? 'commit' : 'commits'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {hourNum < 12 ? 'Morning' : hourNum < 17 ? 'Afternoon' : 'Evening'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>🌅 Morning</span>
        <span>☀️ Afternoon</span>
        <span>🌙 Evening</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 11 }}
            stroke="#9CA3AF"
            interval={2}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#9CA3AF"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.commits, maxCommits)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F3F4F6' }}></div>
          <span className="text-gray-600">No activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#93C5FD' }}></div>
          <span className="text-gray-600">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
          <span className="text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1D4ED8' }}></div>
          <span className="text-gray-600">High</span>
        </div>
      </div>
    </div>
  );
}
