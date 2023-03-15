import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { CustomFonts } from "../customFonts";
import { ThemeState } from "../../../types";

type ThemeProviderProps = {
  children: React.ReactNode;
  themeState: ThemeState;
};

function ThemeProvider({
  children,
  themeState: { theme },
}: ThemeProviderProps) {
  const theme_: MantineThemeOverride = {
    colorScheme: theme,

    colors: {
      brand: [
        "#FFE5B4", // peach
        "#FBCEB1", // apricot
        "#FF7F50", // coral
        "#FA8072", // salmon
        "#B06519", // ginger
        "#CC4E5C", // terracotta
        "#B7410E", // rust
        "#A0522D", // sienna
        "#B87333", // copper
        "#C04000", // mahogany
      ],
    },

    primaryColor: "brand",

    primaryShade: { light: 4, dark: 8 },

    fontFamily: "Lora, serif",

    headings: {
      fontWeight: 700,
      fontFamily: "Lora, serif",
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
