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
  const { volumeId, page } = useParams();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    console.log("inView: ", inView);
    console.log("entry: ", entry);

    if (inView) {
      const fetchMoreResults = async () => {
        const fetchUrl = `https://www.googleapis.com/books/v1/volumes?q=${allStates.responseState.searchTerm}&startIndex=10&maxResults=10&key=AIzaSyD-z8oCNZF8d7hRV6YYhtUuqgcBK22SeQI`;

        console.log("fetchUrl: ", fetchUrl);
        try {
          const { data } = await axios.get(fetchUrl);
          allStates.responseState.searchResults?.items?.push(...data.items);
          allDispatches.responseDispatch({
            type: allActions.responseActions.setSearchResults,
            payload: {
              responseState: allStates.responseState,
            },
          });
        } catch (error) {
          console.log("error: ", error);
        }
      };

      fetchMoreResults();
    }
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
