import { ResponseActions, ResponseDispatch, ResponseState } from "../../types";

const initialResponseState: ResponseState = {
  fetchUrl: `https://www.googleapis.com/books/v1/volumes?q=&key=${
    import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
  }`,
  startIndex: 0,
  searchTerm: "",
  searchResults: null,
  selectedVolume: null,
  selectedAuthor: "",
  selectedPublisher: "",
  bookshelfVolumes: null,
};

const responseActions: ResponseActions = {
  setFetchUrl: "setFetchUrl",
  setStartIndex: "setStartIndex",
  setSearchTerm: "setSearchTerm",
  setSearchResults: "setSearchResults",
  setSelectedVolume: "setSelectedVolume",
  setSelectedAuthor: "setSelectedAuthor",
  setSelectedPublisher: "setSelectedPublisher",
  setBookshelfVolumes: "setBookshelfVolumes",
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
        bookshelfVolumes,
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

    case responseActions.setBookshelfVolumes: {
      return { ...responseState, bookshelfVolumes: bookshelfVolumes };
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
      responseClone.bookshelfVolumes = bookshelfVolumes;

      return responseClone;
    }

    default: {
      return responseState;
    }
  }
}

export { initialResponseState, responseActions, responseReducer };
