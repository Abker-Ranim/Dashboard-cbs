// src/components/ApiUsagePieChart.tsx
import type React from "react";
import { useRef, useEffect, useState } from "react";
import "../styles/ApiUsagePieChart.css";

interface ApiUsageData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface ApiUsagePieChartProps {
  data?: ApiUsageData[];
}

export const ApiUsagePieChart: React.FC<ApiUsagePieChartProps> = ({ data = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: ApiUsageData } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = rect.width / 2;
    const centerY = (rect.height / 2) - 20;
    const radius = Math.min(centerX, centerY);

    ctx.clearRect(0, 0, rect.width, rect.height);

    let currentAngle = -Math.PI / 2;

    data.forEach((segment, index) => {
      const sliceAngle = (segment.percentage / 100) * 2 * Math.PI;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.closePath();

      ctx.fillStyle = segment.color;
      if (hoveredSegment === index) {
        ctx.save();
        const expandDistance = 6;
        const midAngle = currentAngle + sliceAngle / 2;
        const expandX = Math.cos(midAngle) * expandDistance;
        const expandY = Math.sin(midAngle) * expandDistance;
        ctx.translate(expandX, expandY);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fill();
      }

      ctx.strokeStyle = hoveredSegment === index ? "#ffffff" : "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (segment.percentage > 10) {
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * 0.65;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${segment.percentage.toFixed(1)}%`, labelX, labelY);
      }

      currentAngle += sliceAngle;
    });
  }, [hoveredSegment, data]);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = (rect.height / 2) - 20;
    const radius = Math.min(centerX, centerY) - 20;

    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

    if (distance <= radius) {
      const angle = Math.atan2(y - centerY, x - centerX) + Math.PI / 2;
      const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;

      let currentAngle = 0;
      let segmentIndex = -1;

      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (data[i].percentage / 100) * 2 * Math.PI;
        if (normalizedAngle >= currentAngle && normalizedAngle < currentAngle + sliceAngle) {
          segmentIndex = i;
          break;
        }
        currentAngle += sliceAngle;
      }

      if (segmentIndex !== -1 && segmentIndex !== hoveredSegment) {
        setHoveredSegment(segmentIndex);
        setTooltip({
          x: event.clientX,
          y: event.clientY,
          data: data[segmentIndex],
        });
      }
    } else {
      setHoveredSegment(null);
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
    setTooltip(null);
  };

  return (
    <div className="api-usage-container">
      <div className="api-chart-wrapper">
        <canvas
          ref={canvasRef}
          className="api-chart-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      <div className="api-legend">
        {data.map((segment, index) => (
          <div
            key={index}
            className={`legend-item ${hoveredSegment === index ? "legend-item-active" : ""}`}
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="legend-header">
              <div className="legend-indicator" style={{ backgroundColor: segment.color }} />
              <span className="legend-name">{segment.name}</span>
              <span className="legend-percentage">{segment.percentage.toFixed(1)}%</span>
            </div>
            <div className="legend-details">
              <span className="legend-count">{segment.count.toLocaleString()} appels</span>
            </div>
          </div>
        ))}
      </div>
      {tooltip && (
        <div
          className="api-tooltip"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
          }}
        >
          <div className="tooltip-header">
            <div className="tooltip-color" style={{ backgroundColor: tooltip.data.color }} />
            <span className="tooltip-label">{tooltip.data.name}</span>
          </div>
          <div className="tooltip-content">
            <div className="tooltip-value">{tooltip.data.count.toLocaleString()} appels</div>
            <div className="tooltip-percentage">{tooltip.data.percentage.toFixed(1)}%</div>
          </div>
        </div>
      )}
    </div>
  );
};