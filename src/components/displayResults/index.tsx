import { Flex, Loader, Space, Text, Title } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";

import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  NavlinksState,
  ResponseState,
  ThemeState,
} from "../../types";
import DisplayGeneric from "../displayGeneric";
import ErrorFallback from "../errorFallback";
import MyLoader from "../myLoader";

type DisplayResultsProps = {
  children?: React.ReactNode;
  themeState: ThemeState;
  responseState: ResponseState;
  navlinksState: NavlinksState;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayResults({
  themeState,
  responseState,
  navlinksState,
  allActions,
  allDispatches,
}: DisplayResultsProps) {
  const [isFetchedDataPresent, setIsFetchedDataPresent] =
    useState<boolean>(true);

  const { volumeId } = useParams();
  const { ref, inView } = useInView({
    threshold: 0,
  });

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
  let {
    responseActions: { setAll },
  } = allActions;

  useEffect(() => {
    let ignore = false;

    if (inView) {
      const fetchMoreResults = async () => {
        const currStartIdx = startIndex + 40;

        try {
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

          //includes check is for when the user searches using the search bar
          //and not the advanced search page, as the fetchUrl from responseState ( fetchUrl never gets modified ) term does not
          //include the maxResults param
          const fetchUrl_ = params.includes("&maxResults=")
            ? `${url}?q=${searchTerm}&startIndex=${currStartIdx}${params}`
            : `${url}?q=${searchTerm}&startIndex=${currStartIdx}&maxResults=40${params}`;

          const { data } = await axios.get(fetchUrl_);

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
            //certain popular searches like "harry potter" will return 2000+ results
            //so max results is set to 600 for best performance because
            //on author's system, >600 results in firefox dev edition causes slowdown

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

    //clean up function ensures that the fetch that’s not relevant anymore
    //will immediately get cleaned up so its copy of the ignore variable will
    //be set to true
    return () => {
      ignore = true;
    };
  }, [inView]);

  const fetchedDataStateText =
    searchResults && isFetchedDataPresent ? (
      <Flex align="center" justify="center">
        <Loader size="sm" />
        <Space w="xs" />
        <Text>Fetching more results...</Text>
      </Flex>
    ) : (
      <Flex align="center" justify="center">
        <Text>No more results</Text>
      </Flex>
    );

  return (
    <div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Space key={i} h="xs" />
      ))}

      <ErrorBoundary
        fallback={<ErrorFallback componentName="Display Results" />}
      >
        <Suspense fallback={<MyLoader componentName="Display Results" />}>
          <DisplayGeneric
            allStates={allStates}
            allActions={allActions}
            allDispatches={allDispatches}
          />
        </Suspense>
      </ErrorBoundary>

      {/* removes ref if server does not return any more items and allows
            for the spoiler button to show the description and prevent unnecessary fetches
          */}
      <div ref={isFetchedDataPresent ? ref : null}>{fetchedDataStateText}</div>
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="xl" />
      ))}
    </div>
  );
}

export default DisplayResults;
