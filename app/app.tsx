import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "./contexts/theme";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

function App({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
