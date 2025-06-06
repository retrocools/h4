import { Box, Typography } from '@mui/material';

interface StatusIndicatorProps {
  status: 'normal' | 'warning' | 'critical';
  label: string;
  large?: boolean;
}

const StatusIndicator = ({ status, label, large = false }: StatusIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'critical': return '#ff5252';
      case 'warning': return '#ffb74d';
      default: return '#4caf50';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'critical': return 'rgba(255, 82, 82, 0.1)';
      case 'warning': return 'rgba(255, 183, 77, 0.1)';
      default: return 'rgba(76, 175, 80, 0.1)';
    }
  };

  const color = getStatusColor();
  const bgColor = getBackgroundColor();

  return (
    <Box
      className="status-indicator"
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: large ? '8px 16px' : '4px 8px',
        borderRadius: large ? 2 : 1,
        bgcolor: bgColor,
        border: `1px solid ${color}`,
        animation: status !== 'normal' ? 'pulse 2s infinite' : 'none',
      }}
    >
      <Box
        sx={{
          width: large ? 12 : 8,
          height: large ? 12 : 8,
          borderRadius: '50%',
          bgcolor: color,
          mr: 1,
          boxShadow: `0 0 ${large ? 8 : 4}px ${color}`,
        }}
      />
      <Typography
        variant={large ? "subtitle1" : "caption"}
        sx={{
          color: color,
          fontWeight: status !== 'normal' ? 600 : 400,
          textTransform: status !== 'normal' ? 'uppercase' : 'none',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default StatusIndicator;