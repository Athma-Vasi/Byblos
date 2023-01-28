import { ResponseActions, ResponseDispatch, ResponseState } from "../types";

const initialResponseState: ResponseState = {
  searchTerm: "",
  activePage: 1,
  fetchUrl: "",
  selectedVolume: null,
  otherEditions: null,
  publisherCollection: null,
  authorCollection: null,
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
  setOtherEditions: "setOtherEditions",
  setPublisherCollection: "setPublisherCollection",
  setAuthorCollection: "setAuthorCollection",
  setSelectedAuthor: "setSelectedAuthor",
  setSelectedPublisher: "setSelectedPublisher",
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
        publisherCollection,
        authorCollection,
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

    case responseActions.setPublisherCollection: {
      responseClone.publisherCollection = publisherCollection;
      return responseClone;
    }

    case responseActions.setAuthorCollection: {
      responseClone.authorCollection = authorCollection;
      return responseClone;
    }

    case responseActions.setSelectedAuthor: {
      responseClone.selectedAuthor = selectedAuthor;
      return responseClone;
    }

    case responseActions.setSelectedPublisher: {
      responseClone.selectedPublisher = selectedPublisher;
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
      responseClone.publisherCollection = publisherCollection;
      responseClone.authorCollection = authorCollection;
      responseClone.selectedAuthor = selectedAuthor;
      responseClone.selectedPublisher = selectedPublisher;
      responseClone.resultsPerPage = resultsPerPage;
      responseClone.searchResults = searchResults;
      return responseClone;
    }

    default:
      return responseClone;
  }
}

export { initialResponseState, responseActions, responseReducer };
