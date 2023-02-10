import { Text } from "@mantine/core";
import React, { Suspense } from "react";
import { useReducer } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ErrorFallback from "./components/errorFallback";
import { Home } from "./components/home";
import MyLoader from "./components/myLoader";
import { Welcome } from "./components/welcome";

import {
  initialResponseState,
  responseActions,
  responseReducer,
} from "./state/responseState";
import {
  initialThemeState,
  themeActions,
  themeReducer,
} from "./state/themeState";
import { ThemeProvider } from "./ThemeProvider";
import { AllActions, AllDispatches } from "./types";

const DisplayResults = React.lazy(() => import("./components/displayResults"));
const DisplayVolume = React.lazy(() => import("./components/displayVolume"));
const DisplayBookshelf = React.lazy(
  () => import("./components/displayBookshelf")
);
const AdvancedSearch = React.lazy(() => import("./components/advancedSearch"));
const Overview = React.lazy(() => import("./components/overview"));
const OtherEditions = React.lazy(() => import("./components/otherEditions"));
const PublisherCollection = React.lazy(
  () => import("./components/publisherCollection")
);
const AuthorCollection = React.lazy(
  () => import("./components/authorCollection")
);

export default function App() {
  const [responseState, responseDispatch] = useReducer(
    responseReducer,
    initialResponseState
  );

  const [themeState, themeDispatch] = useReducer(
    themeReducer,
    initialThemeState
  );

  const allStates = {
    responseState,
    themeState,
  };

  const allActions: AllActions = {
    responseActions,
    themeActions,
  };

  const allDispatches: AllDispatches = {
    responseDispatch,
    themeDispatch,
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary
                fallback={<ErrorFallback componentName="Byblos" />}
              >
                <Suspense fallback={<MyLoader componentName="Byblos" />}>
                  <Welcome
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
                  fallback={<ErrorFallback componentName="Byblos" />}
                >
                  <Suspense fallback={<MyLoader componentName="Byblos" />}>
                    <Welcome
                      allStates={allStates}
                      allActions={allActions}
                      allDispatches={allDispatches}
                    />
                  </Suspense>
                </ErrorBoundary>
              }
            />
          </Route>
          <Route
            path="home"
            element={
              <ErrorBoundary
                fallback={<ErrorFallback componentName="Home page" />}
              >
                <Suspense fallback={<MyLoader componentName="Home" />}>
                  <Home
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
                  fallback={<ErrorFallback componentName="Home page" />}
                >
                  <Suspense fallback={<MyLoader componentName="Home" />}>
                    <Home
                      allStates={allStates}
                      allActions={allActions}
                      allDispatches={allDispatches}
                    />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="advancedSearch"
              element={
                <ErrorBoundary
                  fallback={
                    <ErrorFallback componentName="Advanced search page" />
                  }
                >
                  <Suspense
                    fallback={<MyLoader componentName="Advanced Search" />}
                  >
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
              path="displayBookshelf"
              element={
                <ErrorBoundary
                  fallback={<ErrorFallback componentName="bookshelf page" />}
                >
                  <Suspense fallback={<MyLoader componentName="Bookshelf" />}>
                    <DisplayBookshelf
                      allStates={allStates}
                      allActions={allActions}
                      allDispatches={allDispatches}
                    />
                  </Suspense>
                </ErrorBoundary>
              }
            ></Route>

            <Route
              path="displayResults"
              element={
                <ErrorBoundary
                  fallback={
                    <ErrorFallback componentName="search results page" />
                  }
                >
                  <Suspense
                    fallback={<MyLoader componentName="Search results" />}
                  >
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
                  <ErrorBoundary
                    fallback={
                      <ErrorFallback componentName="search results page" />
                    }
                  >
                    <Suspense
                      fallback={<MyLoader componentName="Search results" />}
                    >
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
                  <ErrorBoundary
                    fallback={
                      <ErrorFallback componentName="search results page" />
                    }
                  >
                    <Suspense
                      fallback={<MyLoader componentName="Search results" />}
                    >
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
                <ErrorBoundary
                  fallback={<ErrorFallback componentName="volume page" />}
                >
                  <Suspense fallback={<MyLoader componentName="volume" />}>
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
                  <ErrorBoundary
                    fallback={<ErrorFallback componentName="volume page" />}
                  >
                    <Suspense fallback={<MyLoader componentName="Overview" />}>
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
                  <ErrorBoundary
                    fallback={<ErrorFallback componentName="overview page" />}
                  >
                    <Suspense fallback={<MyLoader componentName="Overview" />}>
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
                  <ErrorBoundary
                    fallback={
                      <ErrorFallback componentName="Other editions page" />
                    }
                  >
                    <Suspense
                      fallback={<MyLoader componentName="Other editions" />}
                    >
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
                    <ErrorBoundary
                      fallback={
                        <ErrorFallback componentName="Other editions page" />
                      }
                    >
                      <Suspense
                        fallback={<MyLoader componentName="Other editions" />}
                      >
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
                    <ErrorBoundary
                      fallback={
                        <ErrorFallback componentName="Other editions page" />
                      }
                    >
                      <Suspense
                        fallback={<MyLoader componentName="Other editions" />}
                      >
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
                    fallback={
                      <ErrorFallback componentName="Publisher collection page" />
                    }
                  >
                    <Suspense
                      fallback={
                        <MyLoader componentName="Publisher collection" />
                      }
                    >
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
                      fallback={
                        <ErrorFallback componentName="Publisher collection page" />
                      }
                    >
                      <Suspense
                        fallback={
                          <MyLoader componentName="Publisher collection" />
                        }
                      >
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
                      fallback={
                        <ErrorFallback componentName="Publisher collection page" />
                      }
                    >
                      <Suspense
                        fallback={
                          <MyLoader componentName="Publisher collection" />
                        }
                      >
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
                    fallback={
                      <ErrorFallback componentName="Author collection page" />
                    }
                  >
                    <Suspense
                      fallback={<MyLoader componentName="Author collection" />}
                    >
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
                      fallback={
                        <ErrorFallback componentName="Author collection page" />
                      }
                    >
                      <Suspense
                        fallback={
                          <MyLoader componentName="Author collection" />
                        }
                      >
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
                      fallback={
                        <ErrorFallback componentName="Author collection page" />
                      }
                    >
                      <Suspense
                        fallback={
                          <MyLoader componentName="Author collection" />
                        }
                      >
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
