import { Flex, Loader, Space, Text, Title } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";

import {
  AllActions,
  AllDispatches,
  HistoryState,
  NavlinksState,
  ResponseState,
  ThemeState,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId, upgradeLinksToHttps } from "../../utils";
import DisplayGeneric from "../displayGeneric";
import ErrorFallback from "../errorFallback";
import MyLoader from "../myLoader";

type PublisherCollectionProps = {
  children?: React.ReactNode;
  themeState: ThemeState;
  responseState: ResponseState;
  navlinksState: NavlinksState;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function PublisherCollection({
  themeState,
  responseState,
  navlinksState,
  allActions,
  allDispatches,
}: PublisherCollectionProps) {
  const [publisherCollection, setPublisherCollection] = useState<
    VolumeWithCustomId[]
  >([]);
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
  let { theme } = themeState;
  const { responseDispatch } = allDispatches;
  let {
    responseActions: { setAll },
  } = allActions;

  useEffect(() => {
    const fetchPublisherVolumes = async () => {
      try {
        const [url, params] = fetchUrl.split("q=");
        const fetchUrlWithPublisher = `${url}q=${
          selectedAuthor || selectedVolume?.volumeInfo.authors
        }+inpublisher:${
          selectedPublisher ||
          selectedVolume?.volumeInfo.publisher ||
          publisherCollection[0].volumeInfo.publisher ||
          searchResults?.items[0].volumeInfo.publisher ||
          ""
        }&maxResults=40${params}`;

        const { data } = await axios.get(fetchUrlWithPublisher);

        let itemsWithCustomId = insertCustomId(data.items ?? []);
        itemsWithCustomId = upgradeLinksToHttps(itemsWithCustomId);

        startIndex = 0;
        searchTerm = `${
          selectedAuthor || selectedVolume?.volumeInfo.authors
        }+inpublisher:${
          selectedPublisher ||
          selectedVolume?.volumeInfo.publisher ||
          publisherCollection[0].volumeInfo.publisher ||
          searchResults?.items[0].volumeInfo.publisher ||
          ""
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

  //fetches more results when the user scrolls to the bottom of the page
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

          const fetchUrl_ = `${url}?q=${searchTerm}&startIndex=${currStartIdx}&maxResults=40${params}`;

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
            //certain popular searches like "the" will return 1000+ results
            //so we set the max results to 600 for optimal performance
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

      fetchMoreResults();
    }

    //clean up function ensures that the fetch that’s not relevant anymore will immediately get cleaned up so its copy of the ignore variable will be set to true
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
    <Fragment>
      <Flex justify="center">
        <Title order={3} color={theme === "light" ? "dark.5" : "gray.5"}>
          Publisher collection
        </Title>
      </Flex>

      <Space h="md" />

      <ErrorBoundary
        fallback={<ErrorFallback componentName="Publisher Collection" />}
      >
        <Suspense fallback={<MyLoader componentName="Publisher Collection" />}>
          <DisplayGeneric
            themeState={themeState}
            responseState={responseState}
            navlinksState={navlinksState}
            allActions={allActions}
            allDispatches={allDispatches}
          />
          {/* removes ref if server does not return any more items and allows
            for the spoiler button to show the description and prevent unnecessary fetches
          */}
          <div ref={isFetchedDataPresent ? ref : null}>
            {fetchedDataStateText}
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <Space key={i} h="xl" />
          ))}
        </Suspense>
      </ErrorBoundary>
    </Fragment>
  );
}

export default PublisherCollection;
