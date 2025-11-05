import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityHeatmapData {
  hour: number;
  Sunday: number;
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
}

interface ActivityHeatmapProps {
  data: ActivityHeatmapData[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            tickFormatter={(value) => `${value}:00`}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => `Hour: ${value}:00`}
            formatter={(value, name) => [value, name]}
          />
          {daysOfWeek.map((day, index) => (
            <Bar
              key={day}
              dataKey={day}
              stackId="a"
              fill={`hsl(${index * 51}, 70%, 50%)`}
              name={day}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}