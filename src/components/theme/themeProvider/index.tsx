import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { CustomFonts } from "../customFonts";
import { AllStates } from "../../../types";

type ThemeProviderProps = {
  children: React.ReactNode;
  allStates: AllStates;
};

function ThemeProvider({ children, allStates }: ThemeProviderProps) {
  const {
    themeState: { theme },
  } = allStates;

  const theme_: MantineThemeOverride = {
    colorScheme: theme,

    colors: {
      brand: [
        "#FFE5B4",
        "#FBCEB1",
        "#FF7F50",
        "#FA8072",
        "#B06519",
        "#CC4E5C",
        "#B7410E",
        "#A0522D",
        "#B87333",
        "#C04000",
      ],
    },

    primaryColor: "brand",

    primaryShade: { light: 4, dark: 8 },

    fontFamily: theme === "dark" ? "Work Sans, sans-serif" : "Lora, serif",

    headings: {
      fontWeight: 700,
      fontFamily: theme === "dark" ? "Work Sans, sans-serif" : "Lora, serif",
    },

    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    },
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme_}>
      <CustomFonts />
      {children}
    </MantineProvider>
  );
}

export { ThemeProvider };
