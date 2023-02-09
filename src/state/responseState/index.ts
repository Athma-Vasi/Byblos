import { ResponseActions, ResponseDispatch, ResponseState } from "../../types";

const initialResponseState: ResponseState = {
  fetchUrl: "",
  startIndex: 0,
  searchTerm: "",
  searchResults: null,
  selectedVolume: null,
  selectedAuthor: "",
  selectedPublisher: "",
};

const responseActions: ResponseActions = {
  setFetchUrl: "setFetchUrl",
  setStartIndex: "setStartIndex",
  setSearchTerm: "setSearchTerm",
  setSearchResults: "setSearchResults",
  setSelectedVolume: "setSelectedVolume",
  setSelectedAuthor: "setSelectedAuthor",
  setSelectedPublisher: "setSelectedPublisher",
  setAll: "setAll",
};

function responseReducer(
  responseState: ResponseState,
  responseDispatch: ResponseDispatch
) {
  const {
    payload: {
      responseState: {
        fetchUrl,
        startIndex,
        searchTerm,
        searchResults,
        selectedVolume,
        selectedAuthor,
        selectedPublisher,
      },
    },
  } = responseDispatch;

  switch (responseDispatch.type) {
    case responseActions.setFetchUrl: {
      return { ...responseState, fetchUrl: fetchUrl };
    }

    case responseActions.setStartIndex: {
      return { ...responseState, startIndex: startIndex };
    }

    case responseActions.setSearchTerm: {
      return { ...responseState, searchTerm: searchTerm };
    }

    case responseActions.setSearchResults: {
      return { ...responseState, searchResults: searchResults };
    }

    case responseActions.setSelectedVolume: {
      return { ...responseState, selectedVolume: selectedVolume };
    }

    case responseActions.setSelectedAuthor: {
      return { ...responseState, selectedAuthor: selectedAuthor };
    }

    case responseActions.setSelectedPublisher: {
      return { ...responseState, selectedPublisher: selectedPublisher };
    }

    case responseActions.setAll: {
      const responseClone = structuredClone(responseState);

      responseClone.fetchUrl = fetchUrl;
      responseClone.startIndex = startIndex;
      responseClone.searchTerm = searchTerm;
      responseClone.searchResults = searchResults;
      responseClone.selectedVolume = selectedVolume;
      responseClone.selectedAuthor = selectedAuthor;
      responseClone.selectedPublisher = selectedPublisher;

      return responseClone;
    }

    default: {
      return responseState;
    }
  }
}

export { initialResponseState, responseActions, responseReducer };
