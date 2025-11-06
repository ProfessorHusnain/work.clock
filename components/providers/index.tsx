import { ThemeProvider } from "./theme-provider";
import { TimezoneProvider } from "@/lib/hooks/useTimezones";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TimezoneProvider>
        {children}
      </TimezoneProvider>
    </ThemeProvider>
  );
}
