import React, { useEffect, useRef } from "react";

interface DonutChartProps {
  data: number[];
  colors: string[];
  labels: string[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, colors, labels }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const innerRadius = radius * 0.6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();
      currentAngle += sliceAngle;
    });
  }, [data, colors]);

  return (
    <div className="donut-chart-container" role="figure" aria-label="Donut chart showing data distribution">
      <canvas ref={canvasRef} width={120} height={120} aria-hidden="true" />
      <div className="donut-chart-legend">
        {labels.map((label, index) => (
          <div key={label} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: colors[index] }} />
            <span className="legend-label">{label}</span>
            <span className="legend-value">({data[index]})</span>
          </div>
        ))}
      </div>
    </div>
  );
};