import { ResponseActions, ResponseDispatch, ResponseState } from "../types";

const initialResponseState: ResponseState = {
  searchTerm: "",
  activePage: 1,
  fetchUrl: "",
  selectedVolume: null,
  otherEditions: null,
  selectedAuthor: "",
  resultsPerPage: "10",
  searchResults: null,
};

const responseActions: ResponseActions = {
  setSearchTerm: "setSearchTerm",
  setActivePage: "setActivePage",
  setFetchUrl: "setFetchUrl",
  setSelectedVolume: "setSelectedVolume",
  setOtherEditions: "setOtherEditions",
  setSelectedAuthor: "setSelectedAuthor",
  setResultsPerPage: "setResultsPerPage",
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
      responseState: {
        selectedVolume,
        otherEditions,
        selectedAuthor,
        fetchUrl,
        searchTerm,
        activePage,
        searchResults,
        resultsPerPage,
      },
    },
  } = responseDispatch;

  switch (responseDispatch.type) {
    case responseActions.setSearchTerm: {
      responseClone.searchTerm = searchTerm;
      return responseClone;
    }

    case responseActions.setActivePage: {
      responseClone.activePage = activePage;
      return responseClone;
    }

    case responseActions.setResultsPerPage: {
      responseClone.resultsPerPage = resultsPerPage;
      return responseClone;
    }

    case responseActions.setSelectedVolume: {
      responseClone.selectedVolume = selectedVolume;
      return responseClone;
    }

    case responseActions.setOtherEditions: {
      responseClone.otherEditions = otherEditions;
      return responseClone;
    }

    case responseActions.setSelectedAuthor: {
      responseClone.selectedAuthor = selectedAuthor;
      return responseClone;
    }

    case responseActions.setFetchUrl: {
      responseClone.fetchUrl = fetchUrl;
      return responseClone;
    }

    case responseActions.setSearchResults: {
      responseClone.searchResults = searchResults;
      return responseClone;
    }

    case responseActions.setAll: {
      responseClone.searchTerm = searchTerm;
      responseClone.activePage = activePage;
      responseClone.fetchUrl = fetchUrl;
      responseClone.selectedVolume = selectedVolume;
      responseClone.otherEditions = otherEditions;
      responseClone.selectedAuthor = selectedAuthor;
      responseClone.resultsPerPage = resultsPerPage;
      responseClone.searchResults = searchResults;
      return responseClone;
    }

    default:
      return responseClone;
  }
}

export { initialResponseState, responseActions, responseReducer };
