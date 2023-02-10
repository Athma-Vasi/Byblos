import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { AllStates } from "../../types";

type ThemeProviderProps = {
  children: React.ReactNode;
  allStates: AllStates;
};

function ThemeProvider({ children, allStates }: ThemeProviderProps) {
  const theme: MantineThemeOverride = {
    colorScheme: allStates.themeState.theme,
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      {children}
    </MantineProvider>
  );
}

export { ThemeProvider };
