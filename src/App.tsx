import { Text } from "@mantine/core";
import React, { Suspense, useEffect } from "react";
import { useReducer } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import { Home } from "./components/home";
import { Welcome } from "./components/welcome";
import { useExitPrompt } from "./hooks/useExitPrompt";
import { initialResponseState, responseActions, responseReducer } from "./state";
import { ThemeProvider } from "./ThemeProvider";
import { AllActions, AllDispatches } from "./types";

const DisplayResults = React.lazy(() => import("./components/displayResults"));
const DisplayVolume = React.lazy(() => import("./components/displayVolume"));
const AdvancedSearch = React.lazy(() => import("./components/advancedSearch"));
const Overview = React.lazy(() => import("./components/overview"));
const OtherEditions = React.lazy(() => import("./components/otherEditions"));
const PublisherCollection = React.lazy(() => import("./components/publisherCollection"));
const AuthorCollection = React.lazy(() => import("./components/authorCollection"));

export default function App() {
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
            path="home"
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
                <ErrorBoundary
                  fallback={<Text>Unable to fetch advanced search page</Text>}
                >
                  <Suspense fallback={<Text>Loading advanced search...</Text>}>
                    <AdvancedSearch
                      allStates={allStates}
                      allActions={allActions}
                      allDispatches={allDispatches}
                    />
                  </Suspense>
                </ErrorBoundary>
              }
            />

            <Route
              path="displayResults"
              element={
                <ErrorBoundary fallback={<Text>Unable to fetch search results</Text>}>
                  <Suspense fallback={<Text>Loading results...</Text>}>
                    <DisplayResults
                      allStates={allStates}
                      allActions={allActions}
                      allDispatches={allDispatches}
                    />
                  </Suspense>
                </ErrorBoundary>
              }
              errorElement={<Text>Unable to fetch search results</Text>}
            >
              <Route
                index
                element={
                  <ErrorBoundary fallback={<Text>Unable to fetch search results</Text>}>
                    <Suspense fallback={<Text>Loading results...</Text>}>
                      <DisplayResults
                        allStates={allStates}
                        allActions={allActions}
                        allDispatches={allDispatches}
                      />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route
                path=":page"
                element={
                  <ErrorBoundary fallback={<Text>Unable to fetch search results</Text>}>
                    <Suspense fallback={<Text>Loading results...</Text>}>
                      <DisplayResults
                        allStates={allStates}
                        allActions={allActions}
                        allDispatches={allDispatches}
                      />
                    </Suspense>
                  </ErrorBoundary>
                }
              ></Route>
            </Route>

            <Route
              path="displayVolume/:volumeId"
              element={
                <ErrorBoundary fallback={<Text>Unable to fetch volume</Text>}>
                  <Suspense fallback={<Text>Loading volume...</Text>}>
                    <DisplayVolume
                      allStates={allStates}
                      allActions={allActions}
                      allDispatches={allDispatches}
                    />
                  </Suspense>
                </ErrorBoundary>
              }
            >
              {/* inside displayVolume */}
              <Route
                index
                element={
                  <ErrorBoundary fallback={<Text>Unable to fetch overview</Text>}>
                    <Suspense fallback={<Text>Loading overview...</Text>}>
                      <Overview
                        allStates={allStates}
                        allActions={allActions}
                        allDispatches={allDispatches}
                      />
                    </Suspense>
                  </ErrorBoundary>
                }
              ></Route>

              <Route
                path="overview"
                element={
                  <ErrorBoundary fallback={<Text>Unable to fetch overview</Text>}>
                    <Suspense fallback={<Text>Loading overview...</Text>}>
                      <Overview
                        allStates={allStates}
                        allActions={allActions}
                        allDispatches={allDispatches}
                      />
                    </Suspense>
                  </ErrorBoundary>
                }
              ></Route>

              <Route
                path="otherEditions"
                element={
                  <ErrorBoundary fallback={<Text>Unable to fetch other editions</Text>}>
                    <Suspense fallback={<Text>Loading other editions...</Text>}>
                      <OtherEditions
                        allStates={allStates}
                        allActions={allActions}
                        allDispatches={allDispatches}
                      />
                    </Suspense>
                  </ErrorBoundary>
                }
              >
                <Route
                  index
                  element={
                    <ErrorBoundary fallback={<Text>Unable to fetch other editions</Text>}>
                      <Suspense fallback={<Text>Loading other editions...</Text>}>
                        <OtherEditions
                          allStates={allStates}
                          allActions={allActions}
                          allDispatches={allDispatches}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  }
                ></Route>

                <Route
                  path=":page"
                  element={
                    <ErrorBoundary fallback={<Text>Unable to fetch other editions</Text>}>
                      <Suspense fallback={<Text>Loading other editions...</Text>}>
                        <OtherEditions
                          allStates={allStates}
                          allActions={allActions}
                          allDispatches={allDispatches}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  }
                ></Route>
              </Route>

              <Route
                path="publisherCollection"
                element={
                  <ErrorBoundary
                    fallback={<Text>Unable to fetch publisher collection</Text>}
                  >
                    <Suspense fallback={<Text>Loading publisher collection...</Text>}>
                      <PublisherCollection
                        allStates={allStates}
                        allActions={allActions}
                        allDispatches={allDispatches}
                      />
                    </Suspense>
                  </ErrorBoundary>
                }
              >
                <Route
                  index
                  element={
                    <ErrorBoundary
                      fallback={<Text>Unable to fetch publisher collection</Text>}
                    >
                      <Suspense fallback={<Text>Loading publisher collection...</Text>}>
                        <PublisherCollection
                          allStates={allStates}
                          allActions={allActions}
                          allDispatches={allDispatches}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  }
                ></Route>

                <Route
                  path=":page"
                  element={
                    <ErrorBoundary
                      fallback={<Text>Unable to fetch publisher collection</Text>}
                    >
                      <Suspense fallback={<Text>Loading publisher collection...</Text>}>
                        <PublisherCollection
                          allStates={allStates}
                          allActions={allActions}
                          allDispatches={allDispatches}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  }
                ></Route>
              </Route>

              <Route
                path="authorCollection"
                element={
                  <ErrorBoundary
                    fallback={<Text>Unable to fetch author collection</Text>}
                  >
                    <Suspense fallback={<Text>Loading author collection...</Text>}>
                      <AuthorCollection
                        allStates={allStates}
                        allActions={allActions}
                        allDispatches={allDispatches}
                      />
                    </Suspense>
                  </ErrorBoundary>
                }
              >
                <Route
                  index
                  element={
                    <ErrorBoundary
                      fallback={<Text>Unable to fetch author collection</Text>}
                    >
                      <Suspense fallback={<Text>Loading author collection...</Text>}>
                        <AuthorCollection
                          allStates={allStates}
                          allActions={allActions}
                          allDispatches={allDispatches}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  }
                ></Route>

                <Route
                  path=":page"
                  element={
                    <ErrorBoundary
                      fallback={<Text>Unable to fetch author collection</Text>}
                    >
                      <Suspense fallback={<Text>Loading author collection...</Text>}>
                        <AuthorCollection
                          allStates={allStates}
                          allActions={allActions}
                          allDispatches={allDispatches}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  }
                ></Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

//AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI
//TODO: restrict API key: https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key
