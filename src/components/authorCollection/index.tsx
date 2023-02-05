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

type AuthorCollectionProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function AuthorCollection({
  children,
  allStates,
  allActions,
  allDispatches,
}: AuthorCollectionProps) {
  const { responseState, historyState } = allStates;
  const { responseDispatch, historyDispatch } = allDispatches;
  const { responseActions, historyActions } = allActions;
  const {
    responseState: { selectedVolume },
  } = allStates;
  const [authorCollection, setAuthorCollection] = useState<
    VolumeWithCustomId[]
  >([]);

  const navigate = useNavigate();
  const { width = 0 } = useWindowSize();
  const { volumeId } = useParams();

  useEffect(() => {
    const fetchAuthorCollection = async () => {
      try {
        const fetchUrlWithAuthor = `https://www.googleapis.com/books/v1/volumes?q=${
          allStates.responseState.selectedAuthor
        }+inauthor:${selectedVolume?.volumeInfo.authors.join(
          ","
        )}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrlWithAuthor :", fetchUrlWithAuthor);

        const { data } = await axios.get(fetchUrlWithAuthor);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        // allStates.responseState.authorCollection = itemsWithCustomId;
        allStates.responseState.searchResults = data;
        allStates.responseState.fetchUrl = fetchUrlWithAuthor;
        allStates.responseState.activePage = 1;

        try {
          await localforage.setItem("byblos-searchResults", data);

          await localforage.setItem("byblos-fetchUrl", fetchUrlWithAuthor);

          await localforage.setItem("byblos-activePage", 1);
        } catch (error: any) {
          const error_ = new Error(error, {
            cause: "inner try block inside fetchAuthorCollection()",
          });

          console.group("Error in authorCollection useEffect");
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
          setAuthorCollection(itemsWithCustomId);
        }
      } catch (error: any) {
        const error_ = new Error(error, {
          cause: "outer try block inside fetchAuthorCollection()",
        });

        console.group("Error in authorCollection useEffect");
        console.error("name: ", error_.name);
        console.error("message: ", error_.message);
        console.error("cause: ", error_.cause);
        console.groupCollapsed("stack trace");
        console.trace(error_);
        console.error("detailed stack trace", error_.stack);
        console.groupEnd();
      }
    };

    fetchAuthorCollection();
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

        console.group("Error in authorCollection useEffect");
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
            {`Unable to display other volumes of ${
              allStates.responseState.selectedAuthor ??
              authorCollection[0]?.volumeInfo.authors[0] ??
              ""
            }`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other volumes of ${
                allStates.responseState.selectedAuthor ??
                authorCollection[0]?.volumeInfo.authors[0] ??
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
        parentPath={`/home/displayVolume/${volumeId}/authorCollection/`}
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default AuthorCollection;
