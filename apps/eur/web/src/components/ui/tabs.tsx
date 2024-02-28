import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../utils";
import { VariantProps, cva } from "class-variance-authority";

const Tabs = TabsPrimitive.Root;

const triggerVariants = cva("", {
  variants: {
    triggerVariant: {
      default: "nav-item tw-group",
      crimson:
        "nav-item tw-outline-none data-[state=active]:tw-text-[#ec407a] data-[state=active]:tw-shadow-[inset_0_-1px_0_0,0_1px_0_0] tw-group",
    },
  },
  defaultVariants: {
    triggerVariant: "default",
  },
});

const textVariants = cva("", {
  variants: {
    textVariant: {
      default:
        "nav-link tw-text-[#333] group-data-[state=active]:tw-bg-[#fff] group-data-[state=active]:tw-border group-data-[state=active]:tw-border-gray-300 group-data-[state=active]:tw-border-b-white",
      crimson: "nav-link group-data-[state=active]:tw-text-[#333]",
    },
  },
  defaultVariants: {
    textVariant: "default",
  },
});

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("nav nav-tabs", className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof triggerVariants>,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, triggerVariant, textVariant, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(triggerVariants({ triggerVariant, className }))}
      // className="nav-item tw-group"
      {...props}
    >
      <span className={cn(textVariants({ textVariant }))}>
        {props.children}
      </span>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "tw-mt-2 focus-visible:tw-outline-none focus-visible:tw-ring-none",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
