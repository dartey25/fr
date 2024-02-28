import { QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "./query-client";

function Providers(props: { children: React.ReactNode }) {
  const [client] = useState(queryClient);

  return (
    <QueryClientProvider client={client}>
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster richColors position="bottom-right" expand={false} />
    </QueryClientProvider>
  );
}

export { Providers };
