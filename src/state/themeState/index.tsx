import { ThemeActions, ThemeDispatch, ThemeState } from "../../types";

const initialThemeState: ThemeState = {
  theme: "dark",
};

const themeActions: ThemeActions = {
  setLightTheme: "setLightTheme",
  setDarkTheme: "setDarkTheme",
};

function themeReducer(
  themeState: ThemeState,
  themeDispatch: ThemeDispatch
): ThemeState {
  switch (themeDispatch.type) {
    case themeActions.setLightTheme: {
      return { ...themeState, theme: "light" };
    }

    case themeActions.setDarkTheme: {
      return { ...themeState, theme: "dark" };
    }

    default: {
      return themeState;
    }
  }
}

export { initialThemeState, themeActions, themeReducer };
