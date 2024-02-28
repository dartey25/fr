import * as React from "react";

import { cn } from "../../utils";
import { Object } from "ts-toolbelt";

export interface TextareaProps
  extends Object.Overwrite<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    { value?: string | number | null }
  > {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "form-control tw-h-[76px] tw-overflow-hidden tw-text-clip tw-resize-none disabled:tw-cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
        value={props.value === null ? undefined : props.value}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
