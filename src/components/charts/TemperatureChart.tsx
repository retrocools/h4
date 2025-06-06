import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceArea
} from 'recharts';
import { Typography, Box } from '@mui/material';
import { format, parseISO } from 'date-fns';

interface DataPoint {
  timestamp: string;
  value: number;
}

interface TemperatureChartProps {
  nocData: DataPoint[];
  upsData: DataPoint[];
  timeRange: string;
}

const TemperatureChart = ({ nocData, upsData, timeRange }: TemperatureChartProps) => {
  // Combine data for chart
  const mergedData = nocData.map((item, index) => ({
    timestamp: item.timestamp,
    nocTemperature: item.value,
    upsTemperature: upsData[index]?.value || null,
  }));

  // Format x-axis ticks based on time range
  const formatXAxis = (tickItem: string) => {
    try {
      const date = parseISO(tickItem);
      if (timeRange === '24h') {
        return format(date, 'HH:mm');
      } else if (timeRange === '7d') {
        return format(date, 'dd/MM');
      } else {
        return format(date, 'dd/MM');
      }
    } catch (error) {
      return '';
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      try {
        const date = parseISO(label);
        const formattedDate = format(date, 'dd MMM yyyy HH:mm');
        
        return (
          <Box 
            sx={{ 
              bgcolor: 'background.paper', 
              p: 1.5, 
              borderRadius: 1,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              {formattedDate}
            </Typography>
            {payload.map((entry: any, index: number) => (
              <Typography 
                key={`tooltip-${index}`} 
                variant="body2"
                sx={{ 
                  color: entry.color,
                  display: 'flex',
                  alignItems: 'center',
                  my: 0.5
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    bgcolor: entry.color, 
                    borderRadius: '50%',
                    display: 'inline-block',
                    mr: 1
                  }} 
                />
                {entry.name}: {entry.value.toFixed(1)}°C
              </Typography>
            ))}
          </Box>
        );
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={mergedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis} 
            stroke="#aaa"
            tick={{ fill: '#aaa', fontSize: 12 }}
          />
          <YAxis 
            stroke="#aaa"
            tick={{ fill: '#aaa', fontSize: 12 }}
            domain={[15, 40]}
            label={{ 
              value: 'Temperature (°C)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#aaa', fontSize: 12 } 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Warning and critical temperature ranges */}
          <ReferenceArea y1={28} y2={32} fill="#ffb74d" fillOpacity={0.2} />
          <ReferenceArea y1={32} y2={40} fill="#ff5252" fillOpacity={0.2} />
          
          <Line 
            type="monotone" 
            dataKey="nocTemperature" 
            name="NOC Temperature" 
            stroke="#3f88f2" 
            dot={false} 
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="upsTemperature" 
            name="UPS Temperature" 
            stroke="#00b0ff" 
            dot={false} 
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TemperatureChart;