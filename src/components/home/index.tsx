import { AppShell, Space, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { MyFooter } from "../footer";
import { MyHeader } from "../header";
import { MyNavBar } from "../navbar";

import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  Volume,
} from "../../types";
import React from "react";
import localforage from "localforage";
import { responseActions } from "../../state/responseState";

const Search = React.lazy(() => import("../search"));

type HomeProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Home({ children, allStates, allActions, allDispatches }: HomeProps) {
  let {
    responseState: {
      fetchUrl,
      startIndex,
      searchTerm,
      searchResults,
      selectedVolume,
      selectedAuthor,
      selectedPublisher,
      bookshelfVolumes,
    },
  } = allStates;
  let { responseDispatch } = allDispatches;
  let {
    responseActions: {
      setFetchUrl,
      setStartIndex,
      setSearchTerm,
      setSearchResults,
      setSelectedVolume,
      setSelectedAuthor,
      setSelectedPublisher,
      setBookshelfVolumes,
    },
  } = allActions;

  const theme = useMantineTheme();
  const navigate = useNavigate();
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
    // crude implementation of the browser history state to fetch the correct
    // state upon browser back button click as component state is not persisted
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
        <MyNavBar
          setOpened={setOpened}
          opened={opened}
          allStates={allStates}
          allActions={allActions}
          allDispatches={allDispatches}
        />
      }
      header={
        <MyHeader
          opened={opened}
          setOpened={setOpened}
          allStates={allStates}
          allActions={allActions}
          allDispatches={allDispatches}
        />
      }
      footer={<MyFooter />}
      data-cy="home-appShell"
    >
      <Outlet />
    </AppShell>
  );
}

export { Home };
