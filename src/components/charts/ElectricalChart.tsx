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
  phase_r: number;
  phase_s: number;
  phase_t: number;
}

interface ElectricalChartProps {
  data: DataPoint[];
  timeRange: string;
}

const ElectricalChart = ({ data, timeRange }: ElectricalChartProps) => {
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
                {entry.name}: {entry.value.toFixed(1)}V
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
          data={data}
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
            domain={[180, 260]}
            label={{ 
              value: 'Voltage (V)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#aaa', fontSize: 12 } 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Warning and critical voltage ranges */}
          <ReferenceArea y1={240} y2={250} fill="#ffb74d" fillOpacity={0.2} />
          <ReferenceArea y1={250} y2={260} fill="#ff5252" fillOpacity={0.2} />
          <ReferenceArea y1={180} y2={190} fill="#ff5252" fillOpacity={0.2} />
          <ReferenceArea y1={190} y2={210} fill="#ffb74d" fillOpacity={0.2} />
          
          <Line 
            type="monotone" 
            dataKey="phase_r" 
            name="Phase R" 
            stroke="#ff5252" 
            dot={false} 
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="phase_s" 
            name="Phase S" 
            stroke="#ffb74d" 
            dot={false} 
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="phase_t" 
            name="Phase T" 
            stroke="#4caf50" 
            dot={false} 
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ElectricalChart;