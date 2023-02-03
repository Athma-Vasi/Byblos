import { Space } from "@mantine/core";
import localforage from "localforage";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  AllActions,
  AllDispatches,
  AllStates,
  ResponseState,
  VolumeWithCustomId,
} from "../../types";
import { insertCustomId } from "../../utils";
import DisplayGeneric from "../displayGeneric";
import { MyPagination } from "../pagination";
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
  const [localForageFallback, setLocalForageFallback] = useState<
    VolumeWithCustomId[]
  >([]);

  useEffect(() => {
    const fetchLocalStorageFallback = async () => {
      try {
        await localforage
          .getItem<ResponseState["searchResults"]>("byblos-searchResults")
          .then((value) => {
            if (value) {
              setLocalForageFallback(insertCustomId(value?.items ?? []));
            }
          });
      } catch (error) {
        console.error(
          "Error in displayResults useEffect  fetchLocalStorageFallback(): ",
          error
        );
      }
    };

    fetchLocalStorageFallback();
  }, [allStates.responseState.searchResults]);

  return (
    <Fragment>
      <Search
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
      <DisplayGeneric
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
      {Array.from({ length: 5 }).map((_, i) => (
        <Space key={i} h="lg" />
      ))}
      <MyPagination
        parentPath="/home/displayResults/"
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default DisplayResults;
