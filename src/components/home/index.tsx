import { AppShell, useMantineTheme } from "@mantine/core";
import { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  NavlinksState,
  ResponseState,
  ThemeState,
} from "../../types";
import React from "react";
import localforage from "localforage";
import { responseActions } from "../../state/responseState";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../errorFallback";
import MyLoader from "../myLoader";

const MyNavBar = React.lazy(() => import("../navbar"));
const MyHeader = React.lazy(() => import("../header"));
const MyFooter = React.lazy(() => import("../footer"));

type HomeProps = {
  children?: React.ReactNode;
  themeState: ThemeState;
  responseState: ResponseState;
  navlinksState: NavlinksState;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Home({
  themeState,
  responseState,
  navlinksState,
  allActions,
  allDispatches,
}: HomeProps) {
  let {
    fetchUrl,
    startIndex,
    searchTerm,
    searchResults,
    selectedVolume,
    selectedAuthor,
    selectedPublisher,
    bookshelfVolumes,
  } = responseState;
  let { responseDispatch } = allDispatches;

  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const alertUser = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  useEffect(() => {
    // implementation of the browser history state to fetch the correct
    // state upon browser back button click as component state is not persisted.
    // whenever user clicks on a title, current state of the app is saved
    // as an array of responsState objects in localforage
    // whenever user clicks on the browser back button, the last state is
    // retrieved from localforage and set as the current state and is popped

    const onBackButtonEvent = async (event: PopStateEvent) => {
      event.preventDefault();
      try {
        const historyStateLocalForage = await localforage.getItem<HistoryState>(
          "byblos-historyState"
        );

        const latestHistoryState =
          historyStateLocalForage?.[historyStateLocalForage.length - 1];

        historyStateLocalForage?.pop();

        await localforage.setItem(
          "byblos-historyState",
          historyStateLocalForage
        );

        if (historyStateLocalForage) {
          responseDispatch({
            type: responseActions.setAll,
            payload: {
              responseState: {
                fetchUrl: latestHistoryState?.fetchUrl ?? fetchUrl,
                startIndex: latestHistoryState?.startIndex ?? startIndex,
                searchTerm: latestHistoryState?.searchTerm ?? searchTerm,
                searchResults:
                  latestHistoryState?.searchResults ?? searchResults,
                selectedVolume:
                  latestHistoryState?.selectedVolume ?? selectedVolume,
                selectedAuthor:
                  latestHistoryState?.selectedAuthor ?? selectedAuthor,
                selectedPublisher:
                  latestHistoryState?.selectedPublisher ?? selectedPublisher,
                bookshelfVolumes:
                  latestHistoryState?.bookshelfVolumes ?? bookshelfVolumes,
              },
            },
          });
        }
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "handleOnBackButonEvent()",
        });

        console.group("Error in home useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      padding="md"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <ErrorBoundary fallback={<ErrorFallback componentName="Navbar" />}>
          <Suspense fallback={<MyLoader componentName="Navbar" />}>
            <MyNavBar
              setOpened={setOpened}
              opened={opened}
              allStates={allStates}
              allActions={allActions}
              allDispatches={allDispatches}
            />
          </Suspense>
        </ErrorBoundary>
      }
      header={
        <ErrorBoundary fallback={<ErrorFallback componentName="Header" />}>
          <Suspense fallback={<MyLoader componentName="Header" />}>
            <MyHeader
              opened={opened}
              setOpened={setOpened}
              allStates={allStates}
              allActions={allActions}
              allDispatches={allDispatches}
            />
          </Suspense>
        </ErrorBoundary>
      }
      footer={
        <ErrorBoundary fallback={<ErrorFallback componentName="Footer" />}>
          <Suspense fallback={<MyLoader componentName="Footer" />}>
            <MyFooter
              allStates={allStates}
              allActions={allActions}
              allDispatches={allDispatches}
            />
          </Suspense>
        </ErrorBoundary>
      }
      data-cy="home-appShell"
    >
      <Outlet />
    </AppShell>
  );
}

export { Home };
