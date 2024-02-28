import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

const buttonVariants = cva("tw-mb-1 tw-mb-sm-0", {
  variants: {
    variant: {
      default: "btn btn-primary !tw-bg-[#519dd9]",
      danger: "btn btn-danger",
      outline:
        "tw-border tw-border-slate-200 tw-bg-transparent tw-shadow-sm hover:tw-bg-slate-100 hover:tw-text-slate-900 dark:tw-border-slate-800 dark:hover:tw-bg-slate-800 dark:hover:tw-text-slate-50",
      secondary: "btn btn-secondary",
      light: "btn btn-light tw-border-[#ddd]",
      link: "btn tw-text-slate-900 tw-underline-offset-4 hover:tw-underline dark:tw-text-slate-50",
      ghost: "outline-none border-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, /*size,*/ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, /*size,*/ className }))}
        ref={ref}
        {...props}
      >
        {props.icon && (
          <i className={`icon-${props.icon} ${props.children && "mr-2"}`}></i>
        )}
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
