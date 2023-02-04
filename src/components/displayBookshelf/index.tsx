import { Space } from "@mantine/core";
import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import { AllStates, AllActions, AllDispatches } from "../../types";
import DisplayGeneric from "../displayGeneric";
import { MyPagination } from "../pagination";
import { Search } from "../search";

type DisplayBookshelfProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function DisplayBookshelf({
  allStates,
  allActions,
  allDispatches,
}: DisplayBookshelfProps) {
  const { volumeId, page } = useParams();
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
        parentPath="/home/displayBookshelf/"
        allStates={allStates}
        allActions={allActions}
        allDispatches={allDispatches}
      />
    </Fragment>
  );
}

export default DisplayBookshelf;
