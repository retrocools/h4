import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from 'recharts';
import { Box, Typography } from '@mui/material';

interface GaugeChartProps {
  value: number;
  title: string;
  min: number;
  max: number;
  unit: string;
  color: string;
  thresholds: {
    warning: [number, number];
    danger: [number, number];
  };
  statusLabel?: string;
  statusColor?: string;
}

const GaugeChart = ({ 
  value, 
  title, 
  min, 
  max, 
  unit, 
  color, 
  thresholds, 
  statusLabel,
  statusColor 
}: GaugeChartProps) => {
  const range = max - min;
  const normalizedValue = Math.max(Math.min(value, max), min) - min;
  const percentage = (normalizedValue / range) * 100;

  // Create data for the gauge
  const data = [
    { name: 'Value', value: percentage },
    { name: 'Empty', value: 100 - percentage },
  ];

  // Calculate zones (normal, warning, danger) for the background
  const normalLow = ((thresholds.warning[0] - min) / range) * 100;
  const warningLow = ((thresholds.danger[0] - min) / range) * 100;
  const warningHigh = ((thresholds.warning[1] - min) / range) * 100;
  const normalHigh = ((thresholds.danger[1] - min) / range) * 100;

  // Background zones data
  const backgroundData = [
    { name: 'Danger Low', value: warningLow, color: '#ff5252' },
    { name: 'Warning Low', value: normalLow - warningLow, color: '#ffb74d' },
    { name: 'Normal', value: warningHigh - normalLow, color: '#4caf50' },
    { name: 'Warning High', value: normalHigh - warningHigh, color: '#ffb74d' },
    { name: 'Danger High', value: 100 - normalHigh, color: '#ff5252' },
  ];

  return (
    <Box sx={{ width: '100%', height: 140, position: 'relative' }}>
      {title && (
        <Typography 
          variant="subtitle1" 
          sx={{ 
            textAlign: 'center', 
            mb: 1,
            fontWeight: 500
          }}
        >
          {title}
        </Typography>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Background zones */}
          <Pie
            data={backgroundData}
            cx="50%"
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={45}
            outerRadius={55}
            paddingAngle={0}
            dataKey="value"
          >
            {backgroundData.map((entry, index) => (
              <Cell key={`cell-bg-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {/* Value gauge */}
          <Pie
            data={data}
            cx="50%"
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={35}
            outerRadius={45}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="transparent" />
            <Label
              content={({ viewBox }) => {
                const { cx, cy } = viewBox as { cx: number; cy: number };
                return (
                  <g>
                    {/* Status label at the top of gauge */}
                    {statusLabel && (
                      <text
                        x={cx}
                        y={cy - 35}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={statusColor || color}
                        fontSize="10"
                        fontWeight="600"
                        style={{ textTransform: 'uppercase' }}
                      >
                        {statusLabel}
                      </text>
                    )}
                    {/* Value */}
                    <text
                      x={cx}
                      y={cy - 15}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize="18"
                      fontWeight="bold"
                    >
                      {value.toFixed(1)}
                    </text>
                    {/* Unit */}
                    <text
                      x={cx}
                      y={cy + 5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#aaa"
                      fontSize="10"
                    >
                      {unit}
                    </text>
                  </g>
                );
              }}
            />
          </Pie>
          
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'Value' ? `${value.toFixed(1)}%` : '', 
              name === 'Value' ? 'Value' : ''
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between',
          px: 1
        }}
      >
        <Typography variant="caption" color="text.secondary">{min}{unit}</Typography>
        <Typography variant="caption" color="text.secondary">{max}{unit}</Typography>
      </Box>
    </Box>
  );
};

export default GaugeChart;