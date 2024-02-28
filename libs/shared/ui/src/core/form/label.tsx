;

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

const labelVariants = cva("col-form-label text-md-right tw-select-none", {
  variants: {
    size: {
      default: "col-3",
      sm: "col-2",
      xs: "col-1",
      none: ""
    }
  },
  defaultVariants: {
    size: "default"
  }
});

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> & { required?: boolean; requiredPos?: "right" | "left" }
>(({ className, required, size, requiredPos = "left", ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ size }), className)} {...props}>
    {required && requiredPos === "left" && <span className="text-bold text-danger mr-1">*</span>}
    {props.children}
    {required && requiredPos === "right" && <span className="text-bold text-danger ml-1">*</span>}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
