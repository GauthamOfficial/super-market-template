"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value = "", onValueChange, ...props }, ref) => {
    const name = React.useId();
    return (
      <RadioGroupContext.Provider
        value={{
          name,
          value,
          onValueChange: onValueChange ?? (() => {}),
        }}
      >
        <div ref={ref} className={cn("grid gap-2", className)} {...props} />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) return null;
    const genId = id ?? `${context.name}-${value}`;
    return (
      <input
        ref={ref}
        type="radio"
        id={genId}
        name={context.name}
        value={value}
        checked={context.value === value}
        onChange={() => context.onValueChange(value)}
        className={cn("h-4 w-4 border-input", className)}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
