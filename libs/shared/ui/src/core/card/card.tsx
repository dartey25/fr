import React from "react";
import { cn } from "../../utils";

interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

function Card(props: BaseProps) {
  return (
    <div className={cn("card card-light", props.className)}>
      {props.children}
    </div>
  );
}

function CardHeader(props: BaseProps) {
  return (
    <div
      className={cn(
        "card-header bg-light header-elements-inline",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

function CardContent(props: BaseProps) {
  return (
    <div className={cn("card-body", props.className)}>{props.children}</div>
  );
}

function CardTitle(props: BaseProps) {
  return (
    <h6 className={cn("card-title tw-text-[15px]", props.className)}>
      {props.children}
    </h6>
  );
}

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("tw-flex tw-items-center tw-p-4 tw-pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter, CardTitle };
