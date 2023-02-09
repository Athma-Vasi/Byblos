import { Text } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import { useNavigate, useParams } from "react-router-dom";

import { useWindowSize } from "../../hooks/useWindowSize";
import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";
import DisplayGeneric from "../displayGeneric";

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
  const [authorCollection, setAuthorCollection] = useState<
    VolumeWithCustomId[]
  >([]);

  const navigate = useNavigate();
  const { width = 0 } = useWindowSize();
  const { volumeId } = useParams();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

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
      setAll,
    },
  } = allActions;

  useEffect(() => {
    const fetchAuthorCollection = async () => {
      try {
        const fetchUrlWithAuthor = `https://www.googleapis.com/books/v1/volumes?q=${
          allStates.responseState.selectedAuthor
        }+inauthor:${selectedVolume?.volumeInfo.authors.join(
          ","
        )}&maxResults=40&startIndex=0&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrlWithAuthor :", fetchUrlWithAuthor);

        const { data } = await axios.get(fetchUrlWithAuthor);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        // allStates.responseState.authorCollection = itemsWithCustomId;
        allStates.responseState.searchResults = data;
        allStates.responseState.fetchUrl = fetchUrlWithAuthor;

        try {
          await localforage.setItem("byblos-searchResults", data);

          await localforage.setItem("byblos-fetchUrl", fetchUrlWithAuthor);
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

  useEffect(() => {
    let ignore = false;

    if (inView) {
      const fetchMoreResults = async () => {
        const currStartIdx = startIndex + 40;

        const searchTerm_ =
          searchTerm ||
          (await localforage
            .getItem<HistoryState>("byblos-historyState")
            .then((value) => value?.at(-1)?.searchTerm ?? ""));

        console.log("searchTerm: ", searchTerm_);

        const fetchUrl_ =
          fetchUrl !== ""
            ? fetchUrl.split("&startIndex=")[0] + `&startIndex=${currStartIdx}`
            : await localforage
                .getItem<ResponseState["fetchUrl"]>("byblos-fetchUrl")
                .then(
                  (value) =>
                    value?.split("&startIndex=")[0] +
                    `&startIndex=${currStartIdx}`
                );

        console.log("fetchUrl: ", fetchUrl_);
        try {
          const { data } = await axios.get(
            fetchUrl_ ??
              `https://www.googleapis.com/books/v1/volumes?q=${
                searchTerm_ ?? ""
              }&maxResults=40&startIndex=0&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`
          );
          if (!ignore) {
            if (data.items) {
              searchResults?.items?.push(...data?.items);
              responseDispatch({
                type: setAll,
                payload: {
                  responseState: {
                    fetchUrl: fetchUrl_,
                    startIndex: currStartIdx,
                    searchTerm: searchTerm_,
                    searchResults: {
                      ...data,
                      items: searchResults?.items,
                    },
                    selectedVolume: selectedVolume,
                    selectedAuthor: selectedAuthor,
                    selectedPublisher: selectedPublisher,
                    bookshelfVolumes,
                  },
                },
              });
            }
          }
        } catch (error: any) {
          const error_ = new Error(error, {
            cause: "fetchMoreResults()",
          });

          console.group("Error in displayResults useEffect");
          console.error("name: ", error_.name);
          console.error("message: ", error_.message);
          console.error("cause: ", error_.cause);
          console.groupCollapsed("stack trace");
          console.trace(error_);
          console.error("detailed stack trace", error_.stack);
          console.groupEnd();
        }
      };

      fetchMoreResults();
    }

    //clean up function ensures that the fetch that’s not relevant anymore will immediately get cleaned up so its copy of the ignore variable will be set to true
    return () => {
      ignore = true;
    };
  }, [inView]);

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
          <div ref={ref}></div>
        </Suspense>
      </ErrorBoundary>
    </Fragment>
  );
}

export default AuthorCollection;
