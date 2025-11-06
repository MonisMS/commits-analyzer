'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RepositoryData {
  repositoryName: string;
  commitCount: number;
}

interface RepositoryComparisonChartProps {
  data: RepositoryData[];
}

export function RepositoryComparisonChart({ data }: RepositoryComparisonChartProps) {
  // Get color based on commit count
  const getColor = (commits: number, maxCommits: number) => {
    const intensity = commits / maxCommits;
    if (intensity < 0.25) return '#93C5FD'; // Light blue
    if (intensity < 0.5) return '#60A5FA'; // Medium blue
    if (intensity < 0.75) return '#3B82F6'; // Blue
    return '#2563EB'; // Dark blue
  };

  const maxCommits = Math.max(...data.map(d => d.commitCount), 1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold truncate max-w-[200px]">{payload[0].payload.repositoryName}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} {payload[0].value === 1 ? 'commit' : 'commits'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Truncate long repo names
  const formatRepoName = (name: string) => {
    if (name.length > 15) {
      return name.substring(0, 12) + '...';
    }
    return name;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="repositoryName"
          tick={{ fontSize: 11 }}
          stroke="#9CA3AF"
          angle={-45}
          textAnchor="end"
          height={80}
          tickFormatter={formatRepoName}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#9CA3AF"
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
        <Bar dataKey="commitCount" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.commitCount, maxCommits)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
