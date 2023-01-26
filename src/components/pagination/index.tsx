import { Pagination } from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import axios from "axios";
import React, { useState } from "react";
import { responseActions } from "../../state";
import { AllStates, AllActions, AllDispatches, ApiResponseVolume } from "../../types";

type MyPaginationProps = {
  children?: React.ReactNode;
  allStates: AllStates;
  allActions: AllActions;
  allDispatches: AllDispatches;
};

function MyPagination({
  allStates: { responseState },
  allActions: { responseActions },
  allDispatches: { responseDispatch },
}: MyPaginationProps) {
  const { searchTerm, fetchUrl, activePage, searchResults, resultsPerPage } =
    responseState;
  console.log("searchResults", searchResults);

  const totalItems = searchResults?.totalItems ?? 0;
  const numberOfPages = Math.ceil(totalItems / Number(resultsPerPage));
  console.log("numberOfPages", numberOfPages);
  const startIndex = Number(activePage) * Number(resultsPerPage);
  console.log("startIndex", startIndex);
  console.log("activePage", activePage);

  const pagination = usePagination({
    total: numberOfPages,
    initialPage: Number(activePage),
  });
  //
  async function handlePageChange() {
    console.log("fetchUrl", fetchUrl);
    const searchStrWithStartIndex = `${fetchUrl}&startIndex=${startIndex}`;
    console.log("searchStrWithStartIndex", searchStrWithStartIndex);

    const { data } = await axios.get(searchStrWithStartIndex);
    //set active page

    responseState.activePage = activePage;
    // set the state of the search results
    responseState.searchResults = data as ApiResponseVolume | null;
    responseDispatch({
      type: responseActions.setAll,
      payload: {
        responseState,
      },
    });
    console.log("data", data);

    pagination.next();

    //scrolls to top of page
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <Pagination
        page={pagination.active}
        onChange={handlePageChange}
        total={numberOfPages}
      />
    </div>
  );
}

export { MyPagination };
