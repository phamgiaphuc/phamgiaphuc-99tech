import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const InputIcon = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {startIcon && React.isValidElement(startIcon) && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{React.cloneElement(startIcon)}</div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-10" : "",
            endIcon ? "pr-10" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon && React.isValidElement(endIcon) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{React.cloneElement(endIcon)}</div>
        )}
      </div>
    );
  }
);

InputIcon.displayName = "InputIcon";

export default InputIcon;
