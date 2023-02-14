import { Flex, Space, Text, Title } from "@mantine/core";
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
import MyLoader from "../myLoader";

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
  const [isFetchedDataPresent, setIsFetchedDataPresent] =
    useState<boolean>(true);

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
    themeState: { theme },
  } = allStates;
  let { responseDispatch } = allDispatches;
  let {
    responseActions: { setAll },
  } = allActions;

  useEffect(() => {
    const fetchOtherEditions = async () => {
      try {
        const [url, params] = fetchUrl.split("q=");
        const fetchUrlWithName = `${url}q=${
          selectedVolume?.volumeInfo.title || otherEditions[0].volumeInfo.title
        }+inauthor:${
          selectedAuthor || otherEditions[0].volumeInfo.authors[0]
        }&maxResults=40${params}`;

        console.log(
          "fetchUrlWithName inside otherEditions: ",
          fetchUrlWithName
        );

        const { data } = await axios.get(fetchUrlWithName);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        startIndex = 0;
        searchTerm =
          `${
            selectedVolume?.volumeInfo.title ??
            otherEditions[0].volumeInfo.title
          }` +
          `+inauthor:${
            selectedAuthor ?? otherEditions[0].volumeInfo.authors[0]
          }`;
        searchResults = data;

        try {
          await localforage.setItem<ResponseState["startIndex"]>(
            "byblos-startIndex",
            startIndex
          );

          await localforage.setItem<ResponseState["searchTerm"]>(
            "byblos-searchTerm",
            searchTerm
          );

          await localforage.setItem<ResponseState["searchResults"]>(
            "byblos-searchResults",
            searchResults
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
        try {
          const currStartIdx = startIndex + 40;

          const searchTerm_ =
            searchTerm ||
            (await localforage.getItem<ResponseState["searchTerm"]>(
              "byblos-searchTerm"
            )) ||
            (await localforage
              .getItem<HistoryState>("byblos-searchTerm")
              .then((value) => value?.at(-1)?.searchTerm)) ||
            "";

          const [url, params] =
            fetchUrl.split("?q=") ||
            (await localforage
              .getItem<ResponseState["fetchUrl"]>("byblos-fetchUrl")
              .then((value) => value?.split("?q="))) ||
            (await localforage
              .getItem<HistoryState>("byblos-fetchUrl")
              .then((value) => value?.at(-1)?.fetchUrl?.split("?q="))) ||
            "";

          const fetchUrl_ = `${url}?q=${searchTerm}&startIndex=${currStartIdx}&maxResults=40${params}`;

          console.log("fetchMoreResults inside otherEditions: ", fetchUrl_);

          const { data } = await axios.get(fetchUrl_);

          console.log("data inside otherEditions fetchMoreResults(): ", data);

          if (!ignore) {
            if (data.items) {
              searchResults?.items?.push(...data?.items);
              responseDispatch({
                type: setAll,
                payload: {
                  responseState: {
                    fetchUrl,
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
            //certain popular searches like "the" will return 1000+ results
            //so we set the max results to 600 to limit browser tab memory
            //usage, since all results are stored in memory
            if (currStartIdx > 600 || !data.items) {
              //setIsFetchedDataPresent to false so that the infinite scroll
              //useEffect doesn't run and fetch more results, triggering a
              //rerender and preventing spoiler button from showing description
              setIsFetchedDataPresent(false);
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
      <Flex justify="center">
        <Title order={3} color={theme === "light" ? "dark.5" : "gray.5"}>
          Other editions
        </Title>
      </Flex>

      <Space h="md" />

      <ErrorBoundary
        fallback={
          <Text
            color={theme === "light" ? "dark.5" : "gray.5"}
          >{`Unable to display other editions ${
            selectedVolume ?? otherEditions[0]?.volumeInfo.title ?? ""
          }`}</Text>
        }
      >
        <Suspense fallback={<MyLoader componentName="Other Editions" />}>
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
          />
          {/* removes ref if server does not return any more items and allows
            for the spoiler button to show the description and prevent unnecessary fetches
          */}
          <div ref={isFetchedDataPresent ? ref : null}></div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default OtherEditions;
