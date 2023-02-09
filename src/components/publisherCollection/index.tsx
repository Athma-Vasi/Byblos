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
  const [publisherCollection, setPublisherCollection] = useState<
    VolumeWithCustomId[]
  >([]);

  const navigate = useNavigate();
  const { volumeId } = useParams();
  const { width = 0 } = useWindowSize();
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
  const { responseDispatch } = allDispatches;
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
    const fetchPublisherVolumes = async () => {
      try {
        const fetchUrlWithPublisher = `https://www.googleapis.com/books/v1/volumes?q=${allStates.responseState.selectedAuthor}+inpublisher:${selectedVolume?.volumeInfo.publisher}&maxResults=40&startIndex=0&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrlWithPublisher: ", fetchUrlWithPublisher);

        const { data } = await axios.get(fetchUrlWithPublisher);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        // allStates.responseState.publisherCollection = itemsWithCustomId;
        allStates.responseState.searchResults = data;
        allStates.responseState.fetchUrl = fetchUrlWithPublisher;

        try {
          await localforage.setItem(
            "byblos-searchResults",
            allStates.responseState.searchResults
          );

          await localforage.setItem(
            "byblos-fetchUrl",
            allStates.responseState.fetchUrl
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
          <div ref={ref}></div>
        </Suspense>
      </ErrorBoundary>
    </Fragment>
  );
}

export default PublisherCollection;
