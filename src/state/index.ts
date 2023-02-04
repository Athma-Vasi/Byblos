import { ResponseActions, ResponseDispatch, ResponseState } from "../types";

const initialResponseState: ResponseState = {
  searchTerm: "",
  activePage: 1,
  fetchUrl: "",
  selectedVolume: null,
  selectedAuthor: "",
  selectedPublisher: "",
  resultsPerPage: "10",
  searchResults: null,
};

const responseActions: ResponseActions = {
  setSearchTerm: "setSearchTerm",
  setActivePage: "setActivePage",
  setFetchUrl: "setFetchUrl",
  setSelectedVolume: "setSelectedVolume",
  setSelectedAuthor: "setSelectedAuthor",
  setSelectedPublisher: "setSelectedPublisher",
  setResultsPerPage: "setResultsPerPage",
  setSearchResults: "setSearchResults",
  setAll: "setAll",
};

function responseReducer(
  responseState: ResponseState,
  responseDispatch: ResponseDispatch
) {
  // const responseClone = structuredClone(responseState);
  const {
    payload: {
      responseState: {
        selectedVolume,
        selectedAuthor,
        selectedPublisher,
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
      return { ...responseState, searchTerm: searchTerm };
    }

    case responseActions.setActivePage: {
      return { ...responseState, activePage: activePage };
    }

    case responseActions.setResultsPerPage: {
      return { ...responseState, resultsPerPage: resultsPerPage };
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
      responseClone.activePage = activePage;
      responseClone.searchResults = searchResults;
      responseClone.resultsPerPage = resultsPerPage;

      return responseClone;
    }

    default: {
      return structuredClone(responseState);
    }
  }
}

export { initialResponseState, responseActions, responseReducer };
