import {
  HistoryActions,
  HistoryDispatch,
  HistoryState,
} from "../../types/index.d";

const initialHistoryState: HistoryState = [
  {
    searchTerm: "",
    fetchUrl: "",
    selectedVolume: null,
    selectedAuthor: "",
    selectedPublisher: "",
    resultsPerPage: "10",
    searchResults: null,
  },
];

const historyActions: HistoryActions = {
  pushHistory: "pushHistory",
  popHistory: "popHistory",
};

function historyReducer(
  historyState: HistoryState,
  historyDispatch: HistoryDispatch
) {
  const {
    payload: {
      historyState: {
        selectedVolume,
        selectedAuthor,
        selectedPublisher,
        fetchUrl,
        searchTerm,
        searchResults,
        resultsPerPage,
      },
    },
  } = historyDispatch;

  switch (historyDispatch.type) {
    case historyActions.pushHistory: {
      return [
        ...historyState,
        {
          selectedVolume,
          selectedAuthor,
          selectedPublisher,
          fetchUrl,
          searchTerm,
          searchResults,
          resultsPerPage,
        },
      ];
    }

    case historyActions.popHistory: {
      return historyState.slice(0, historyState.length - 1);
    }

    default: {
      return historyState;
    }
  }
}

export { initialHistoryState, historyActions, historyReducer };
