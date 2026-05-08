import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Configure the QueryClient with specific cache and retry policies.
 * - staleTime: 5 minutes (1000 * 60 * 5)
 * - retry: 1 attempt
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

/**
 * Provider component that wraps the application with the TanStack Query client.
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
