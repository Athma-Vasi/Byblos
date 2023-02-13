import { Flex, Space, Text, Title } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";

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
  allStates,
  allActions,
  allDispatches,
}: AuthorCollectionProps) {
  const [authorCollection, setAuthorCollection] = useState<
    VolumeWithCustomId[]
  >([]);
  const [isFetchedDataPresent, setIsFetchedDataPresent] =
    useState<boolean>(true);

  const { volumeId } = useParams();
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
    const fetchAuthorCollection = async () => {
      try {
        const [url, params] = fetchUrl.split("q=");
        const fetchUrlWithAuthor = `${url}q=+inauthor:${
          selectedAuthor ||
          selectedVolume?.volumeInfo.authors ||
          authorCollection[0].volumeInfo.authors ||
          searchResults?.items[0].volumeInfo.authors ||
          ""
        }&maxResults=40${params}`;

        console.log(
          "fetchUrlWithAuthor inside authorCollection: ",
          fetchUrlWithAuthor
        );

        const { data } = await axios.get(fetchUrlWithAuthor);

        const itemsWithCustomId = insertCustomId(data.items ?? []);

        startIndex = 0;
        searchTerm = `+inauthor:${
          selectedAuthor ||
          selectedVolume?.volumeInfo.authors ||
          authorCollection[0].volumeInfo.authors ||
          searchResults?.items[0].volumeInfo.authors ||
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

          console.log("fetchMoreResults inside authorCollection: ", fetchUrl_);

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
            } else {
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

      fetchMoreResults();
    }

    //clean up function ensures that the fetch that’s not relevant anymore will immediately get cleaned up so its copy of the ignore variable will be set to true
    return () => {
      ignore = true;
    };
  }, [inView]);

  return (
    <Fragment>
      <Flex justify="center">
        <Title order={3} color={theme === "light" ? "dark.6" : "gray.5"}>
          Author collection
        </Title>
      </Flex>

      <Space h="md" />

      <ErrorBoundary
        fallback={
          <Text>
            {`Unable to display other volumes ${
              selectedAuthor ?? authorCollection[0]?.volumeInfo.authors[0] ?? ""
            }`}
          </Text>
        }
      >
        <Suspense
          fallback={
            <Text>
              {`Loading other volumes ${
                selectedAuthor ??
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
          {/* removes ref if server does not return any more items and allows
            for the spoiler button to show the description and prevent unnecessary fetches
          */}
          <div ref={isFetchedDataPresent ? ref : null}></div>
        </Suspense>
      </ErrorBoundary>
    </Fragment>
  );
}

export default AuthorCollection;
