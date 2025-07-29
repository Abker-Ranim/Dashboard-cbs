import React, { useEffect, useRef, useState } from "react";

interface DonutChartProps {
  data: number[];
  colors: string[];
  labels: string[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, colors, labels }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredInfo, setHoveredInfo] = useState<{
    label: string;
    value: number;
    color: string;
    x: number;
    y: number;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Function to lighten a color for hover effect
  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const innerRadius = radius * 0.6;
    const total = data.reduce((sum, value) => sum + value, 0);
    const segmentAngles: { start: number; end: number; label: string }[] = [];

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let currentAngle = -Math.PI / 2;
      data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const isHovered = hoveredInfo && hoveredInfo.label === labels[index];
        const outerRadius = isHovered ? radius * 1.05 : radius;
        const fillColor = isHovered ? lightenColor(colors[index], 20) : colors[index];
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
        segmentAngles[index] = { start: currentAngle, end: currentAngle + sliceAngle, label: labels[index] };
        currentAngle += sliceAngle;
      });
    };

    drawChart();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - centerX;
      const y = event.clientY - rect.top - centerY;
      const distance = Math.sqrt(x * x + y * y);
      if (distance >= innerRadius && distance <= radius * 1.05) {
        let angle = Math.atan2(y, x);
        if (angle < -Math.PI / 2) angle += 2 * Math.PI;
        angle += Math.PI / 2;
        const hoveredIndex = segmentAngles.findIndex(
          (segment) => angle >= segment.start && angle < segment.end
        );
        if (hoveredIndex !== -1) {
          const label = labels[hoveredIndex];
          if (!hoveredInfo || hoveredInfo.label !== label) {
            setHoveredInfo({
              label,
              value: data[hoveredIndex],
              color: colors[hoveredIndex],
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
            drawChart();
          } else {
            setHoveredInfo((info) =>
              info
                ? { ...info, x: event.clientX - rect.left, y: event.clientY - rect.top }
                : info
            );
          }
        }
      } else if (hoveredInfo !== null) {
        setHoveredInfo(null);
        drawChart();
      }
    };

    const handleMouseOut = () => {
      if (hoveredInfo !== null) {
        setHoveredInfo(null);
        drawChart();
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseout", handleMouseOut);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseout", handleMouseOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, colors, labels, hoveredInfo]);

  // Animation fluide du tooltip
  useEffect(() => {
    let animationFrame: number;
    if (hoveredInfo) {
      const animate = () => {
        setTooltipPos((prev) => {
          if (!prev) return { x: hoveredInfo.x, y: hoveredInfo.y };
          const dx = hoveredInfo.x - prev.x;
          const dy = hoveredInfo.y - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) return hoveredInfo;
          return {
            x: prev.x + dx * 0.2,
            y: prev.y + dy * 0.2,
          };
        });
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    } else {
      setTooltipPos(null);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [hoveredInfo]);

  return (
    <div className="donut-chart-container" role="figure" aria-label="Donut chart showing data distribution">
      <div className="chart-wrapper" style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={250} height={250} aria-hidden="true" />
        {hoveredInfo && tooltipPos && (
          <div
            className="hover-tooltip"
            style={{
              position: "absolute",
              left: tooltipPos.x + 10,
              top: tooltipPos.y - 10,
              background: `${hoveredInfo.color}cc`,
              color: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              border: `2px solid ${hoveredInfo.color}`,
              pointerEvents: "none",
              opacity: hoveredInfo ? 1 : 0,
              transform: "translateY(-8px)",
              fontWeight: "bold",
              zIndex: 10,
              transition: "opacity 0.25s, transform 0.25s",
              willChange: "opacity, transform",
            }}
          >
            <div>{hoveredInfo.label}</div>
            <div style={{ fontSize: "1.1em" }}>{hoveredInfo.value}</div>
          </div>
        )}
      </div>
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