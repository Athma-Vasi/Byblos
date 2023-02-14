import { Space, Text } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";

import {
  AllActions,
  AllDispatches,
  AllStates,
  HistoryState,
  ResponseState,
} from "../../types";
import DisplayGeneric from "../displayGeneric";

type DisplayResultsProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayResults({
  allStates,
  allActions,
  allDispatches,
}: DisplayResultsProps) {
  const [isFetchedDataPresent, setIsFetchedDataPresent] =
    useState<boolean>(true);

  const { volumeId, page } = useParams();
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
    let ignore = false;

    if (inView) {
      const fetchMoreResults = async () => {
        const currStartIdx = startIndex + 40;

        try {
          // console.log(
          //   "OG fetchUrl fetchMoreResults inside displayResults: ",
          //   fetchUrl
          // );

          const searchTerm_ =
            searchTerm ||
            (await localforage.getItem<ResponseState["searchTerm"]>(
              "byblos-searchTerm"
            )) ||
            (await localforage
              .getItem<HistoryState>("byblos-searchTerm")
              .then((value) => value?.at(-1)?.searchTerm)) ||
            "";

          // console.log(
          //   "searchTerm_ fetchMoreResults inside displayResults: ",
          //   searchTerm_
          // );

          const [url, params] =
            fetchUrl.split("?q=") ||
            (await localforage
              .getItem<ResponseState["fetchUrl"]>("byblos-fetchUrl")
              .then((value) => value?.split("?q="))) ||
            (await localforage
              .getItem<HistoryState>("byblos-fetchUrl")
              .then((value) => value?.at(-1)?.fetchUrl?.split("?q="))) ||
            "";

          console.log("url fetchMoreResults inside displayResults: ", url);
          console.log(
            "params fetchMoreResults inside displayResults: ",
            params
          );

          //includes check is for when the user searches using the search bar
          //and not the advanced search page, as the fetchUrl from responseState ( fetchUrl never gets modified ) term does not
          //include the maxResults param
          const fetchUrl_ = params.includes("&maxResults=")
            ? `${url}?q=${searchTerm}&startIndex=${currStartIdx}${params}`
            : `${url}?q=${searchTerm}&startIndex=${currStartIdx}&maxResults=40${params}`;

          console.log("fetchMoreResults inside displayResults: ", fetchUrl_);

          const { data } = await axios.get(fetchUrl_);

          console.log("data fetchMoreResults inside displayResults: ", data);

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

  return (
    <div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Space key={i} h="xs" />
      ))}

      <DisplayGeneric
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
      {/* removes ref if server does not return any more items and allows
            for the spoiler button to show the description and prevent unnecessary fetches
          */}
      <div ref={isFetchedDataPresent ? ref : null}></div>
    </div>
  );
}

export default DisplayResults;
