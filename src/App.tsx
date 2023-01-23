import { useReducer } from "react";

import { Home } from "./components/home";
import {
  initialResponseState,
  responseActions,
  responseReducer,
} from "./components/state";
import { AllActions, AllDispatches } from "./components/types";
import { useWindowSize } from "./hooks/useWindowSize";
import { ThemeProvider } from "./ThemeProvider";

export default function App() {
  const { width = 0, height = 0 } = useWindowSize();

  const [responseState, responseDispatch] = useReducer(
    responseReducer,
    initialResponseState,
  );

  const allStates = {
    responseState,
  };

  const allActions: AllActions = {
    responseActions,
  };

  const allDispatches: AllDispatches = {
    responseDispatch,
  };

  return (
    <ThemeProvider>
      <Home allStates={allStates} allActions={allActions} allDispatches={allDispatches} />
    </ThemeProvider>
  );
}

//AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI
//TODO: restrict API key: https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key
