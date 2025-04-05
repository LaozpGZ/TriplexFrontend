"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  className?: string
  min?: number
  max?: number
  step?: number
  value?: number[]
  onValueChange?: (value: number[]) => void
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ 
    className, 
    value = [0], 
    min = 0, 
    max = 100, 
    step = 1, 
    onValueChange, 
    disabled = false,
    ...props 
  }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseFloat(event.target.value)]
      onValueChange?.(newValue)
    }

    return (
      <div className={cn("relative w-full touch-none select-none", className)}>
        <div className="relative w-full h-2 bg-muted overflow-hidden rounded-full">
          <div
            className="absolute h-full bg-primary"
            style={{
              width: `${(((value[0] || 0) - min) / (max - min)) * 100}%`,
            }}
          />
        </div>
        <input
          type="range"
          ref={ref}
          value={value[0]}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            "absolute inset-0 w-full h-2 opacity-0 cursor-pointer",
            disabled && "pointer-events-none"
          )}
          onChange={handleChange}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider } 