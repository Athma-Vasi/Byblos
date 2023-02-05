import { Text, Title } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import React, { Suspense } from "react";
import { Fragment, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";
import { MyImageModal } from "../myImageModal";
import { MyPagination } from "../pagination";

const DisplayGeneric = React.lazy(() => import("../displayGeneric"));

type OtherEditionsProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function OtherEditions({
  children,
  allStates,
  allActions,
  allDispatches,
}: OtherEditionsProps) {
  const { responseState, historyState } = allStates;
  const { responseDispatch, historyDispatch } = allDispatches;
  const { responseActions, historyActions } = allActions;

  const {
    responseState: { selectedVolume, selectedAuthor },
  } = allStates;

  const { volumeId, page } = useParams();
  const navigate = useNavigate();

  const [otherEditions, setOtherEditions] = useState<VolumeWithCustomId[]>([]);
  const { width = 0 } = useWindowSize();

  useEffect(() => {
    const fetchOtherEditions = async () => {
      try {
        const fetchUrlWithName = `https://www.googleapis.com/books/v1/volumes?q=${
          selectedVolume?.volumeInfo.title ?? otherEditions[0].volumeInfo.title
        }+inauthor:${
          selectedAuthor ?? otherEditions[0].volumeInfo.authors[0]
        }&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrlWithName from otherEditions", fetchUrlWithName);

        const { data } = await axios.get(fetchUrlWithName);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        // allStates.responseState.otherEditions = itemsWithCustomId;
        allStates.responseState.searchResults = data;
        allStates.responseState.fetchUrl = fetchUrlWithName;
        allStates.responseState.activePage = 1;

        try {
          await localforage.setItem<ResponseState["searchResults"]>(
            "byblos-searchResults",
            allStates.responseState.searchResults
          );

          await localforage.setItem<ResponseState["fetchUrl"]>(
            "byblos-fetchUrl",
            allStates.responseState.fetchUrl
          );

          await localforage.setItem<ResponseState["activePage"]>(
            "byblos-activePage",
            allStates.responseState.activePage
          );
        } catch (error: any) {
          const error_ = new Error(error, {
            cause: "inner try block inside fetchOtherEditions()",
          });

          console.group("Error in otherEditions useEffect");
          console.error("name: ", error_.name);
          console.error("message: ", error_.message);
          console.error("cause: ", error_.cause);
          console.groupCollapsed("stack trace");
          console.trace(error_);
          console.error("detailed stack trace", error_.stack);
          console.groupEnd();
        } finally {
          allDispatches.responseDispatch({
            type: allActions.responseActions.setAll,
            payload: { responseState: allStates.responseState },
          });

          setOtherEditions(itemsWithCustomId);
        }
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "outer try block inside fetchOtherEditions()",
        });

        console.group("Error in otherEditions useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    fetchOtherEditions();
  }, []);

  //handles browser back button click and is included here separately from the function inside pagination component's useEffect because the pagination component is not rendered here
  useEffect(() => {
    const onBackButtonEvent = async (event: PopStateEvent) => {
      event.preventDefault();

      try {
        await localforage
          .getItem<ResponseState["activePage"]>("byblos-activePage")
          .then((value) => {
            if (value) {
              if (value === 1) {
                // set response state to prev history state
                const prevHistoryState = historyState.pop();
                if (prevHistoryState) {
                  responseState.activePage = prevHistoryState.activePage;
                  responseState.searchResults = prevHistoryState.searchResults;
                  responseState.fetchUrl = prevHistoryState.fetchUrl;
                  responseState.selectedVolume =
                    prevHistoryState.selectedVolume;
                  responseState.selectedAuthor =
                    prevHistoryState.selectedAuthor;
                  responseState.selectedPublisher =
                    prevHistoryState.selectedPublisher;

                  responseDispatch({
                    type: responseActions.setAll,
                    payload: { responseState },
                  });

                  //remove the current state from history by popping the current responseState from the historyState stack
                  historyDispatch({
                    type: historyActions.popHistory,
                    payload: {
                      historyState: {
                        searchTerm: responseState.searchTerm,
                        activePage: responseState.activePage,
                        fetchUrl: responseState.fetchUrl,
                        selectedVolume: responseState.selectedVolume,
                        selectedAuthor: responseState.selectedAuthor,
                        selectedPublisher: responseState.selectedPublisher,
                        resultsPerPage: responseState.resultsPerPage,
                        searchResults: responseState.searchResults,
                      },
                    },
                  });

                  navigate(
                    `/home/displayResults/${prevHistoryState.activePage}`
                  );

                  return;
                }
              }
              //activePage is not 1 and continue going back
              responseState.activePage = value - 1;
            }
          });
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "onBackButtonEvent()",
        });

        console.group("Error in otherEditions useEffect");
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
    <div>
      <Title order={3}>Other editions</Title>
      <ErrorBoundary
        fallback={<Text>{`Unable to display other editions`}</Text>}
      >
        <Suspense fallback={<Text>{`Loading other editions`}</Text>}>
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
          />
        </Suspense>
      </ErrorBoundary>

      <MyPagination
        parentPath={`/home/displayVolume/${volumeId}/otherEditions/${allStates.responseState.activePage}`}
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </div>
  );
}

export default OtherEditions;
