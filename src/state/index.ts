import { ResponseActions, ResponseDispatch, ResponseState } from "../types";

const initialResponseState: ResponseState = {
  searchTerm: "",
  searchResults: null,
};

const responseActions: ResponseActions = {
  setSearchTerm: "setSearchTerm",
  setSearchResults: "setSearchResults",
  setAll: "setAll",
};

function responseReducer(
  responseState: ResponseState,
  responseDispatch: ResponseDispatch,
) {
  const responseClone = structuredClone(responseState);
  const {
    payload: {
      responseState: { searchTerm, searchResults },
    },
  } = responseDispatch;

  switch (responseDispatch.type) {
    case responseActions.setSearchTerm: {
      responseClone.searchTerm = searchTerm;
      return responseClone;
    }

    case responseActions.setSearchResults: {
      responseClone.searchResults = searchResults;
      return responseClone;
    }

    case responseActions.setAll: {
      responseClone.searchTerm = searchTerm;
      responseClone.searchResults = searchResults;
      return responseClone;
    }

    default:
      return responseClone;
  }
}

export { initialResponseState, responseActions, responseReducer };
