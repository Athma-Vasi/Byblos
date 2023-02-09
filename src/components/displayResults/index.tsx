import { Space } from "@mantine/core";
import axios from "axios";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { InView, useInView } from "react-intersection-observer";
import { Outlet, useParams } from "react-router-dom";

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
import InfiniteResults from "../infiniteResults";
import { Search } from "../search";

type DisplayResultsProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayResults({
  children,
  allStates,
  allActions,
  allDispatches,
}: DisplayResultsProps) {
  let {
    responseState: {
      fetchUrl,
      startIndex,
      searchTerm,
      searchResults,
      selectedVolume,
      selectedAuthor,
      selectedPublisher,
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
    },
  } = allActions;

  const { volumeId, page } = useParams();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

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
            searchResults?.items?.push(...data.items);
            responseDispatch({
              type: "setAll",
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
                },
              },
            });
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
    <div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Space key={i} h="xs" />
      ))}

      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
      {Array.from({ length: 5 }).map((_, i) => (
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

      <h4 ref={ref}> {`Header inside viewport ${inView}`}</h4>
    </div>
  );
}

export default DisplayResults;

/**
 // const [localForageFallback, setLocalForageFallback] = useState<
  //   VolumeWithCustomId[]
  // >([]);

  // useEffect(() => {
  //   const fetchLocalStorageFallback = async () => {
  //     try {
  //       await localforage
  //         .getItem<ResponseState["searchResults"]>("byblos-searchResults")
  //         .then((value) => {
  //           if (value) {
  //             setLocalForageFallback(insertCustomId(value?.items ?? []));
  //           }
  //         });
  //     } catch (error: any) {
  //       const error_ = new Error(error, {
  //         cause: "fetchLocalStorageFallback()",
  //       });

  //       console.group("Error in displayResults useEffect");
  //       console.error("name: ", error_.name);
  //       console.error("message: ", error_.message);
  //       console.error("cause: ", error_.cause);
  //       console.groupCollapsed("stack trace");
  //       console.trace(error_);
  //       console.error("detailed stack trace", error_.stack);
  //       console.groupEnd();
  //     }
  //   };

  //   fetchLocalStorageFallback();
  // }, [allStates.responseState.searchResults]);
 */
