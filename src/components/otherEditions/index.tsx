import { Text, Title } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import { useNavigate, useParams } from "react-router-dom";

import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";

const DisplayGeneric = React.lazy(() => import("../displayGeneric"));

type OtherEditionsProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function OtherEditions({
  allStates,
  allActions,
  allDispatches,
}: OtherEditionsProps) {
  const [otherEditions, setOtherEditions] = useState<VolumeWithCustomId[]>([]);

  const { volumeId, page } = useParams();
  const navigate = useNavigate();

  const { ref, inView } = useInView({
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
    responseActions: { setAll },
  } = allActions;

  useEffect(() => {
    const fetchOtherEditions = async () => {
      try {
        const fetchUrlWithName =
          fetchUrl.split("q=")[0] +
          `q=${
            selectedVolume?.volumeInfo.title ??
            otherEditions[0].volumeInfo.title
          }+inauthor:${
            selectedAuthor ?? otherEditions[0].volumeInfo.authors[0]
          }&maxResults=40&startIndex=${startIndex}&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        const { data } = await axios.get(fetchUrlWithName);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        searchResults = data;
        fetchUrl = fetchUrlWithName;

        try {
          await localforage.setItem<ResponseState["searchResults"]>(
            "byblos-searchResults",
            allStates.responseState.searchResults
          );

          await localforage.setItem<ResponseState["fetchUrl"]>(
            "byblos-fetchUrl",
            allStates.responseState.fetchUrl
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
          responseDispatch({
            type: setAll,
            payload: {
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
            },
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

  //fetches more results when the user scrolls to the bottom of the page
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

      fetchMoreResults();
    }

    //clean up function ensures that the fetch that’s not relevant anymore will immediately get cleaned up so its copy of the ignore variable will be set to true
    return () => {
      ignore = true;
    };
  }, [inView]);

  return (
    <div>
      <Title order={3}>Other editions</Title>
      <ErrorBoundary
        fallback={
          <Text>{`Unable to display other editions ${
            "of" + selectedVolume ?? otherEditions[0]?.volumeInfo.title ?? ""
          }`}</Text>
        }
      >
        <Suspense
          fallback={
            <Text>{`Loading other editions ${
              "of" + selectedVolume ?? otherEditions[0]?.volumeInfo.title ?? ""
            }`}</Text>
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
    </div>
  );
}

export default OtherEditions;
