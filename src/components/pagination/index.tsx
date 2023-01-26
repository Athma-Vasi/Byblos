import React from "react";
import { AllStates, AllActions, AllDispatches } from "../../types";

type PaginationProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function Pagination({ allStates, allActions, allDispatches }: PaginationProps) {
  const {
    responseState: { searchResults },
  } = allStates;
  return <div>Pagination</div>;
}

export default Pagination;
