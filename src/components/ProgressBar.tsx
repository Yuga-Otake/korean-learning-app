import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  color = '#4caf50',
  showPercentage = true,
  height = 20
}) => {
  return (
    <div className="progress-bar-container">
      {label && <div className="progress-bar-label">{label}</div>}
      <div className="progress-bar-outer" style={{ height: `${height}px` }}>
        <div
          className="progress-bar-inner"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        >
          {showPercentage && <span className="progress-bar-text">{percentage}%</span>}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 