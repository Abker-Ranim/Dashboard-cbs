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

    const padding = 20;
    const width = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    // Fonction pour dessiner les éléments de base
    const drawBaseChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      const points = data.map((value, index) => {
        const x = padding + (width / (data.length - 1)) * index;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        return { x, y, value };
      });
      points.forEach((point, index) => {
        index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Draw gradient fill
      const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(1, `${color}00`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      points.forEach((point, index) => {
        index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.lineTo(padding, canvas.height - padding);
      ctx.closePath();
      ctx.fill();

      // Draw points
      ctx.fillStyle = color;
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Initial draw
    drawBaseChart();

    // Gestion de l'hover
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      let closestPoint = null;
      let minDistance = Infinity;

      // Ensure points is accessible here
      const points = data.map((value, index) => {
        const x = padding + (width / (data.length - 1)) * index;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        return { x, y, value };
      });

      points.forEach((point: { x: number; y: number; value: number }) => {
        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance && distance < 10) { // Rayon de 10px pour détecter
          minDistance = distance;
          closestPoint = point;
        }
      });

      // Redessiner la base
      drawBaseChart();

      // Ajouter le tooltip si un point est proche
      if (closestPoint !== null) {
        // Type assertion to ensure closestPoint is the correct type
        const typedPoint = closestPoint as { x: number; y: number; value: number };
        const index = points.findIndex(
          (p) => p.x === typedPoint.x && p.y === typedPoint.y && p.value === typedPoint.value
        );
        const tooltipText = `${index}, ${typedPoint.value.toFixed(2)}`;
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(typedPoint.x - 30, typedPoint.y - 30, 60, 20);
        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tooltipText, typedPoint.x, typedPoint.y - 20);
      }
    };

    const handleMouseLeave = () => {
      // Redessiner uniquement la base sans tooltip
      drawBaseChart();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
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