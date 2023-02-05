import { Text } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, Suspense, useEffect, useState } from "react";
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
import DisplayGeneric from "../displayGeneric";
import { MyPagination } from "../pagination";

type PublisherCollectionProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function PublisherCollection({
  children,
  allStates,
  allActions,
  allDispatches,
}: PublisherCollectionProps) {
  const { responseState, historyState } = allStates;
  const { responseDispatch, historyDispatch } = allDispatches;
  const { responseActions, historyActions } = allActions;
  const {
    responseState: { selectedVolume },
  } = allStates;

  const navigate = useNavigate();
  const { volumeId } = useParams();
  const { width = 0 } = useWindowSize();

  const [publisherCollection, setPublisherCollection] = useState<
    VolumeWithCustomId[]
  >([]);

  useEffect(() => {
    const fetchPublisherVolumes = async () => {
      try {
        const fetchUrlWithPublisher = `https://www.googleapis.com/books/v1/volumes?q=${allStates.responseState.selectedAuthor}+inpublisher:${selectedVolume?.volumeInfo.publisher}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrlWithPublisher: ", fetchUrlWithPublisher);

        const { data } = await axios.get(fetchUrlWithPublisher);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        // allStates.responseState.publisherCollection = itemsWithCustomId;
        allStates.responseState.searchResults = data;
        allStates.responseState.fetchUrl = fetchUrlWithPublisher;
        allStates.responseState.activePage = 1;

        try {
          await localforage.setItem(
            "byblos-searchResults",
            allStates.responseState.searchResults
          );

          await localforage.setItem(
            "byblos-fetchUrl",
            allStates.responseState.fetchUrl
          );

          await localforage.setItem(
            "byblos-activePage",
            allStates.responseState.activePage
          );
        } catch (error: any) {
          const error_ = new Error(error, {
            cause: "inner try block inside fetchPublisherVolumes()",
          });

          console.group("Error in publisherCollection useEffect");
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

          setPublisherCollection(itemsWithCustomId);
        }
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "outer try block inside fetchPublisherVolumes()",
        });

        console.group("Error in publisherCollection useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    fetchPublisherVolumes();
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

        console.group("Error in publisherCollection useEffect");
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
    <Fragment>
      <ErrorBoundary
        fallback={
          <Text>
            {`Unable to display other editions of ${
              allStates.responseState.selectedVolume ??
              publisherCollection[0]?.volumeInfo.title ??
              ""
            }`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other editions of ${
                allStates.responseState.selectedVolume ??
                publisherCollection[0]?.volumeInfo.title ??
                ""
              }`}
            </Text>
          }
        >
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
          />
        </Suspense>
      </ErrorBoundary>

      <MyPagination
        parentPath={`/home/displayVolume/${volumeId}/publisherCollection/`}
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default PublisherCollection;
