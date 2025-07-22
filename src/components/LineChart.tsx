import React, { useEffect, useRef } from "react";

interface LineChartProps {
  data: number[];
  color: string;
  height?: number;
  label?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, color, height = 100, label = "Chart" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length === 0) return;

    const padding = 20;
    const width = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + (width / (data.length - 1)) * index;
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + (width / (data.length - 1)) * index;
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw points
    ctx.fillStyle = color;
    data.forEach((value, index) => {
      const x = padding + (width / (data.length - 1)) * index;
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={height}
      className="chart-canvas"
      style={{ height: `${height}px` }}
      role="img"
      aria-label={label}
    />
  );
};