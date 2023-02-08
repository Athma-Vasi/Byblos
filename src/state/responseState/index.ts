import { ResponseActions, ResponseDispatch, ResponseState } from "../../types";

const initialResponseState: ResponseState = {
  searchTerm: "",
  fetchUrl: "",
  selectedVolume: null,
  selectedAuthor: "",
  selectedPublisher: "",
  searchResults: null,
};

const responseActions: ResponseActions = {
  setSearchTerm: "setSearchTerm",
  setFetchUrl: "setFetchUrl",
  setSelectedVolume: "setSelectedVolume",
  setSelectedAuthor: "setSelectedAuthor",
  setSelectedPublisher: "setSelectedPublisher",
  setSearchResults: "setSearchResults",
  setAll: "setAll",
};

function responseReducer(
  responseState: ResponseState,
  responseDispatch: ResponseDispatch
) {
  const {
    payload: {
      responseState: {
        selectedVolume,
        selectedAuthor,
        selectedPublisher,
        fetchUrl,
        searchTerm,
        searchResults,
      },
    },
  } = responseDispatch;

  switch (responseDispatch.type) {
    case responseActions.setSearchTerm: {
      return { ...responseState, searchTerm: searchTerm };
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

    case responseActions.setFetchUrl: {
      return { ...responseState, fetchUrl: fetchUrl };
    }

    case responseActions.setSearchResults: {
      return { ...responseState, searchResults: searchResults };
    }

    case responseActions.setAll: {
      const responseClone = structuredClone(responseState);

      responseClone.selectedVolume = selectedVolume;
      responseClone.selectedAuthor = selectedAuthor;
      responseClone.selectedPublisher = selectedPublisher;
      responseClone.fetchUrl = fetchUrl;
      responseClone.searchTerm = searchTerm;
      responseClone.searchResults = searchResults;

      return responseClone;
    }

    default: {
      return responseState;
    }
  }
}

export { initialResponseState, responseActions, responseReducer };
