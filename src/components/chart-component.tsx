
import React, { useEffect, useRef } from "react"

interface ChartProps {
  data: number[]
  color: string
  height?: number
}

export function LineChart({ data, color, height = 100 }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (data.length === 0) return

    const padding = 20
    const width = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Find min and max values
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw the line
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.beginPath()
    data.forEach((value, index) => {
      const x = padding + (width / (data.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding)
    gradient.addColorStop(0, color + "40")
    gradient.addColorStop(1, color + "00")

    ctx.fillStyle = gradient
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = padding + (width / (data.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.closePath()
    ctx.fill()

    // Draw points
    ctx.fillStyle = color
    data.forEach((value, index) => {
      const x = padding + (width / (data.length - 1)) * index
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [data, color])

  return <canvas ref={canvasRef} width={400} height={height} className="w-full" style={{ height: `${height}px` }} />
}

export function DonutChart({ data, colors, labels }: { data: number[]; colors: string[]; labels: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20
    const innerRadius = radius * 0.6

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const total = data.reduce((sum, value) => sum + value, 0)
    let currentAngle = -Math.PI / 2

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      // Draw outer arc
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
      ctx.closePath()
      ctx.fillStyle = colors[index]
      ctx.fill()

      currentAngle += sliceAngle
    })
  }, [data, colors])

  return (
    <div className="flex items-center space-x-4">
      <canvas ref={canvasRef} width={120} height={120} />
      <div className="space-y-2">
        {labels.map((label, index) => (
          <div key={label} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }} />
            <span className="text-sm text-white">{label}</span>
            <span className="text-sm text-slate-300">({data[index]})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
