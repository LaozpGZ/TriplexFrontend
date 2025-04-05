"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked = false, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked)
  
  React.useEffect(() => {
    setIsChecked(checked)
  }, [checked])
  
  const handleClick = () => {
    const newValue = !isChecked
    setIsChecked(newValue)
    onCheckedChange?.(newValue)
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
        isChecked && "bg-primary",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {isChecked && (
        <Check className="h-4 w-4 text-primary-foreground" />
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox } 