import { useReducer } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AdvancedSearch } from "./components/advancedSearch";
import { Home } from "./components/home";
import { Welcome } from "./components/welcome";
import { useWindowSize } from "./hooks/useWindowSize";
import { initialResponseState, responseActions, responseReducer } from "./state";
import { ThemeProvider } from "./ThemeProvider";
import { AllActions, AllDispatches } from "./types";

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
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Welcome
                allStates={allStates}
                allActions={allActions}
                allDispatches={allDispatches}
              />
            }
          >
            <Route
              index
              element={
                <Welcome
                  allStates={allStates}
                  allActions={allActions}
                  allDispatches={allDispatches}
                />
              }
            />
          </Route>
          <Route
            path="/home"
            element={
              <Home
                allStates={allStates}
                allActions={allActions}
                allDispatches={allDispatches}
              />
            }
          >
            <Route
              index
              element={
                <Home
                  allStates={allStates}
                  allActions={allActions}
                  allDispatches={allDispatches}
                />
              }
            />

            <Route
              path="advancedSearch"
              element={
                <AdvancedSearch
                  allStates={allStates}
                  allActions={allActions}
                  allDispatches={allDispatches}
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

//AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI
//TODO: restrict API key: https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key

/**
 <ThemeProvider>
      <Home allStates={allStates} allActions={allActions} allDispatches={allDispatches} />
    </ThemeProvider>
 */
