import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 20_000, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-sans",
          style: {
            background: "#FFFFFF",
            color: "#1E241C",
            border: "1px solid #E8EDE6",
            borderRadius: 14,
          },
        }}
      />
    </QueryClientProvider>
  );
}
