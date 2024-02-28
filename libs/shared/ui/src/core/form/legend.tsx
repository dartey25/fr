;

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const legendVariants = cva("text-uppercase font-size-sm font-weight-bold py-2 tw-select-none");

interface LegendProps
  extends VariantProps<typeof legendVariants>,
    Omit<React.HTMLAttributes<HTMLLegendElement>, "className"> {}

const Legend = React.forwardRef<HTMLLegendElement, LegendProps>((props, ref) => (
  <legend ref={ref} className={legendVariants()} {...props} />
));

Legend.displayName = "Legend";

export { Legend };
